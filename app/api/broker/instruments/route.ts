import { NextResponse } from 'next/server';
import { BinanceFuturesAdapter } from '@/lib/brokers/BinanceFuturesAdapter';
import { BybitAdapter } from '@/lib/brokers/BybitAdapter';
import { MexcAdapter } from '@/lib/brokers/MexcAdapter';
import { BingXAdapter } from '@/lib/brokers/BingXAdapter';
import { DhanAdapter } from '@/lib/brokers/DhanAdapter';
import axios from 'axios';

// 24-hour In-Memory Cache
const instrumentCache: Record<string, { data: any[], timestamp: number }> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000;

async function fetchZerodhaInstruments() {
    try {
        const response = await axios.get('https://api.kite.trade/instruments');
        // Parse CSV-ish data from Zerodha
        const lines = response.data.split('\n');
        return lines.slice(1, 1000).map((line: string) => {
            const cols = line.split(',');
            return {
                symbol: cols[2], // trading_symbol
                displayName: cols[3], // name
                type: cols[11] === 'EQ' ? 'EQUITY' : 'OPTIONS'
            };
        }).filter((i: any) => i.symbol);
    } catch (err) {
        console.error('[ZERODHA_FETCH] Failed:', err);
        return [];
    }
}

async function fetchAngelOneInstruments() {
    try {
        const response = await axios.get('https://margincalculator.angelbroking.com/OpenAPI_Standard/metadata/nse_all.json');
        return response.data.slice(0, 1000).map((i: any) => ({
            symbol: i.symbol,
            displayName: i.name,
            type: i.instrumenttype === 'OPTIDX' || i.instrumenttype === 'OPTSTK' ? 'OPTIONS' : 'EQUITY'
        }));
    } catch (err) {
        console.error('[ANGELONE_FETCH] Failed:', err);
        return [];
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const brokerType = searchParams.get('brokerType');

    if (!brokerType) return NextResponse.json({ error: 'Missing brokerType' }, { status: 400 });

    // Check Cache
    const cached = instrumentCache[brokerType];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
    }

    try {
        let instruments: any[] = [];

        switch (brokerType) {
            case 'BINANCE_FUTURES':
                instruments = await new BinanceFuturesAdapter().getInstruments();
                break;
            case 'BYBIT':
                instruments = await new BybitAdapter().getInstruments();
                break;
            case 'MEXC':
                instruments = await new MexcAdapter().getInstruments();
                break;
            case 'BINGX':
                instruments = await new BingXAdapter().getInstruments();
                break;
            case 'DHAN':
                instruments = await new DhanAdapter().getInstruments();
                break;
            case 'ZERODHA':
                instruments = await fetchZerodhaInstruments();
                break;
            case 'ANGELONE':
                instruments = await fetchAngelOneInstruments();
                break;
            case 'GROWW':
                // Reuse Dhan/Zerodha logic or provide curated list
                instruments = await fetchZerodhaInstruments();
                break;
            case 'MT5':
            case 'TRADINGVIEW_DEMO':
                instruments = [
                    { symbol: 'XAUUSD', displayName: 'Gold (Spot)', type: 'COMMODITY' },
                    { symbol: 'BTCUSD', displayName: 'Bitcoin', type: 'CRYPTO' },
                    { symbol: 'EURUSD', displayName: 'EUR/USD', type: 'FOREX' },
                    { symbol: 'GBPUSD', displayName: 'GBP/USD', type: 'FOREX' },
                    { symbol: 'NAS100', displayName: 'Nasdaq 100', type: 'INDEX' },
                    { symbol: 'US30', displayName: 'Dow Jones 30', type: 'INDEX' }
                ];
                break;
            default:
                instruments = [{ symbol: 'BTCUSD', displayName: 'Bitcoin', type: 'CRYPTO' }];
        }

        // Store in Cache
        instrumentCache[brokerType] = { data: instruments, timestamp: Date.now() };
        
        return NextResponse.json(instruments);
    } catch (err: any) {
        console.error('[INSTRUMENTS_API] Error:', err.message);
        return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
    }
}
