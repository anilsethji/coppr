import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'XAUUSD';
    const timeframe = searchParams.get('timeframe') || '15m';

    // INSTITUTIONAL PERSISTENT SIMULATOR
    // This uses a seeded random walk based on the current timestamp (5m blocks)
    // to ensure the price is "persistent" across multiple heartbeats.
    const generatePersistentData = (sym: string, tf: string) => {
        const data = [];
        const count = 300;
        
        // Institutional Base Prices
        const BASE_PRICES: Record<string, number> = {
            'XAUUSD': 2350.45,
            'BTCUSD': 65420.10,
            'ETHUSD': 3450.25,
            'NIFTY': 22450.00,
            'BANKNIFTY': 47820.00,
            'EURUSD': 1.0845,
            'GBPUSD': 1.2640,
            'USDJPY': 151.20,
            'CRUDEOIL': 83.45,
            'SILVER': 27.85
        };

        const basePrice = BASE_PRICES[sym.toUpperCase()] || 150.00;
        const currentTime = Math.floor(Date.now() / 1000);
        const interval = tf === '1d' ? 86400 : tf === '4h' ? 14400 : tf === '1h' ? 3600 : tf === '15m' ? 900 : 300;

        // Seed generator with symbol + current hour block for persistence
        const hourBlock = Math.floor(currentTime / 3600);
        let seed = (sym.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + hourBlock) % 10000;
        
        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        let currentClose = basePrice;
        for (let i = 0; i < count; i++) {
            const time = currentTime - (count - i) * interval;
            const volatility = basePrice * 0.0005; // 0.05% volatility per bar
            
            const open = currentClose;
            const move = (seededRandom() - 0.48) * volatility; // Slight upward bias
            const close = open + move;
            const high = Math.max(open, close) + seededRandom() * (volatility * 0.3);
            const low = Math.min(open, close) - seededRandom() * (volatility * 0.3);
            
            data.push({
                time,
                open: parseFloat(open.toFixed(sym.includes('USD') && !sym.includes('JPY') ? 4 : 2)),
                high: parseFloat(high.toFixed(sym.includes('USD') && !sym.includes('JPY') ? 4 : 2)),
                low: parseFloat(low.toFixed(sym.includes('USD') && !sym.includes('JPY') ? 4 : 2)),
                close: parseFloat(close.toFixed(sym.includes('USD') && !sym.includes('JPY') ? 4 : 2))
            });
            currentClose = close;
        }
        return data;
    };

    try {
        const data = generatePersistentData(symbol, timeframe);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Data Fetch Failure' }, { status: 500 });
    }
}
