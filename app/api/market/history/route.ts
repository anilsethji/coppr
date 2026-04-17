import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'XAUUSD';
    const timeframe = searchParams.get('timeframe') || '15m';

    const getYahooSymbol = (sym: string) => {
        const map: Record<string, string> = {
            'NIFTY': '^NSEI',
            'BANKNIFTY': '^NSEBANK',
            'SENSEX': '^BSESN',
            'XAUUSD': 'GC=F',
            'CRUDEOIL': 'CL=F',
            'SILVER': 'SI=F',
            'EURUSD': 'EURUSD=X',
            'GBPUSD': 'GBPUSD=X',
            'USDJPY': 'JPY=X',
        };
        if (map[sym.toUpperCase()]) return map[sym.toUpperCase()];
        
        // Assume Indian stock if not mapped and not containing Forex/Crypto identifiers
        if (!sym.includes('USD') && !sym.includes('JPY') && !sym.includes('=X')) {
            return `${sym.toUpperCase()}.NS`;
        }
        return sym;
    };

    try {
        const yahooSym = getYahooSymbol(symbol);
        
        let yfInterval = timeframe;
        let range = '5d';
        
        if (timeframe === '1m') { range = '1d'; }
        else if (timeframe === '5m' || timeframe === '15m') { range = '5d'; yfInterval = timeframe; }
        else if (timeframe === '1h') { range = '1mo'; yfInterval = '60m'; }
        else if (timeframe === '4h') { range = '1mo'; yfInterval = '60m'; } // Fallback to 1h
        else if (timeframe === '1d') { range = '1y'; yfInterval = '1d'; }

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSym}?range=${range}&interval=${yfInterval}`;
        
        const response = await fetch(url, { cache: 'no-store' });
        const textData = await response.text();
        
        if (!response.ok) {
            throw new Error(`Market API error: ${response.status} - ${textData}`);
        }

        const data = JSON.parse(textData);
        const result = data.chart?.result?.[0];
        
        if (!result || !result.timestamp) {
             throw new Error('No market data found for this symbol');
        }

        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        const formattedData = [];
        
        for (let i = 0; i < timestamps.length; i++) {
            if (quotes.open[i] !== null && quotes.high[i] !== null && quotes.low[i] !== null && quotes.close[i] !== null) {
                formattedData.push({
                    time: timestamps[i],
                    open: parseFloat(quotes.open[i].toFixed(2)),
                    high: parseFloat(quotes.high[i].toFixed(2)),
                    low: parseFloat(quotes.low[i].toFixed(2)),
                    close: parseFloat(quotes.close[i].toFixed(2))
                });
            }
        }

        return NextResponse.json(formattedData);
    } catch (error: any) {
        console.error('Real Market Data Fetch Failure:', error.message);
        return NextResponse.json({ error: 'Broker API Sync Failure', details: error.message }, { status: 500 });
    }
}
