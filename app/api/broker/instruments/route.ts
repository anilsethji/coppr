import { NextResponse } from 'next/server';
import { BinanceFuturesAdapter } from '@/lib/brokers/BinanceFuturesAdapter';
import { BybitAdapter } from '@/lib/brokers/BybitAdapter';

/**
 * GET /api/broker/instruments?brokerType=BINANCE_FUTURES
 * Fetches available symbols for a specific broker bridge.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const brokerType = searchParams.get('brokerType');

    try {
        let instruments: any[] = [];

        switch (brokerType) {
            case 'BINANCE_FUTURES':
                const binance = new BinanceFuturesAdapter();
                instruments = await binance.getInstruments();
                break;
            
            case 'BYBIT':
                const bybit = new BybitAdapter();
                instruments = await bybit.getInstruments();
                break;

            case 'MEXC':
            case 'BINGX':
                // For other crypto brokers, we use a robust liquidated curated list
                instruments = [
                    { symbol: 'BTCUSDT', displayName: 'Bitcoin / USDT', type: 'CRYPTO' },
                    { symbol: 'ETHUSDT', displayName: 'Ethereum / USDT', type: 'CRYPTO' },
                    { symbol: 'SOLUSDT', displayName: 'Solana / USDT', type: 'CRYPTO' },
                    { symbol: 'XRPUSDT', displayName: 'Ripple / USDT', type: 'CRYPTO' },
                    { symbol: 'XAUUSD', displayName: 'Gold / USD', type: 'COMMODITY' }
                ];
                break;

            case 'MT5':
            case 'TRADINGVIEW_DEMO':
                instruments = [
                    { symbol: 'XAUUSD', displayName: 'Gold (Spot)', type: 'COMMODITY' },
                    { symbol: 'BTCUSD', displayName: 'Bitcoin', type: 'CRYPTO' },
                    { symbol: 'ETHUSD', displayName: 'Ethereum', type: 'CRYPTO' },
                    { symbol: 'EURUSD', displayName: 'EUR/USD', type: 'FOREX' },
                    { symbol: 'GBPUSD', displayName: 'GBP/USD', type: 'FOREX' },
                    { symbol: 'USDJPY', displayName: 'USD/JPY', type: 'FOREX' },
                    { symbol: 'AUDUSD', displayName: 'AUD/USD', type: 'FOREX' },
                    { symbol: 'US30', displayName: 'Dow Jones 30', type: 'INDEX' },
                    { symbol: 'NAS100', displayName: 'Nasdaq 100', type: 'INDEX' },
                    { symbol: 'GER40', displayName: 'DAX 40', type: 'INDEX' },
                    { symbol: 'UK100', displayName: 'FTSE 100', type: 'INDEX' },
                ];
                break;

            case 'ZERODHA':
            case 'ANGELONE':
            case 'DHAN':
            case 'GROWW':
                instruments = [
                    { symbol: 'NIFTY 50', displayName: 'Nifty 50 Index', type: 'INDEX' },
                    { symbol: 'BANKNIFTY', displayName: 'Nifty Bank', type: 'INDEX' },
                    { symbol: 'FINNIFTY', displayName: 'Nifty Financial Services', type: 'INDEX' },
                    { symbol: 'RELIANCE', displayName: 'Reliance Industries', type: 'EQUITY' },
                    { symbol: 'HDFCBANK', displayName: 'HDFC Bank', type: 'EQUITY' },
                    { symbol: 'INFY', displayName: 'Infosys', type: 'EQUITY' },
                    { symbol: 'TCS', displayName: 'Tata Consultancy', type: 'EQUITY' },
                    { symbol: 'ICICIBANK', displayName: 'ICICI Bank', type: 'EQUITY' },
                    { symbol: 'SBIN', displayName: 'State Bank of India', type: 'EQUITY' },
                    { symbol: 'GOLD APR FUT', displayName: 'MCX Gold Futures', type: 'COMMODITY' },
                    { symbol: 'CRUDEOIL APR FUT', displayName: 'MCX Crude Oil', type: 'COMMODITY' },
                ];
                break;

            default:
                // Default fallback for any newly added brokers
                instruments = [
                    { symbol: 'BTCUSD', displayName: 'Bitcoin', type: 'CRYPTO' },
                    { symbol: 'XAUUSD', displayName: 'Gold', type: 'COMMODITY' }
                ];
                break;
        }

        return NextResponse.json(instruments);
    } catch (err: any) {
        console.error('[INSTRUMENTS_API] Error:', err.message);
        return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
    }
}
