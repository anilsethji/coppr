import axios from 'axios';
import crypto from 'crypto';

export class BinanceFuturesAdapter {
    private baseURL: string;

    constructor(testnet: boolean = false) {
        this.baseURL = testnet ? 'https://testnet.binancefuture.com' : 'https://fapi.binance.com';
    }

    private generateSignature(queryString: string, apiSecret: string): string {
        return crypto
            .createHmac('sha256', apiSecret)
            .update(queryString)
            .digest('hex');
    }

    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<number> {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.generateSignature(queryString, credentials.api_secret);

        try {
            const response = await axios.get(`${this.baseURL}/fapi/v2/balance?${queryString}&signature=${signature}`, {
                headers: { 'X-MBX-APIKEY': credentials.api_key }
            });

            // Find USDT balance in USDⓈ-M wallet
            const usdtBalance = response.data.find((b: any) => b.asset === 'USDT');
            return parseFloat(usdtBalance?.balance || '0');
        } catch (error: any) {
            console.error('[BINANCE_FUTURES] Balance fetch failed:', error.response?.data || error.message);
            throw new Error('BINANCE_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price, sl, tp, leverage } = orderConfig;
        
        const timestamp = Date.now();
        
        // 1. SET LEVERAGE (Optional but recommended for consistency)
        await this.setLeverage(symbol, leverage, credentials);

        // 2. CONSTRUCT ORDER PARAMETERS
        // Action Bridge: BUY -> BUY, SELL -> SELL
        // MT5 'SELL' (from Master) needs to be 'SELL' on Binance
        // If in Hedge Mode, we must provide positionSide: 'LONG' or 'SHORT'
        
        // Logic: Mapping MT5 action to Binance positionSide
        // For now, we assume simple Dual-Side mode (Hedge)
        const side = action === 'BUY' ? 'BUY' : 'SELL';
        const positionSide = action === 'BUY' ? 'LONG' : 'SHORT';

        const params: any = {
            symbol: symbol.toUpperCase().replace('/', ''), // BTC/USDT -> BTCUSDT
            side,
            positionSide,
            type: orderType || 'MARKET',
            quantity: quantity.toString(),
            timestamp
        };

        if (orderType === 'LIMIT') {
            params.price = price.toString();
            params.timeInForce = 'GTC';
        }

        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
            
        const signature = this.generateSignature(queryString, credentials.api_secret);

        try {
            const response = await axios.post(`${this.baseURL}/fapi/v1/order?${queryString}&signature=${signature}`, null, {
                headers: { 'X-MBX-APIKEY': credentials.api_key }
            });

            return {
                success: true,
                orderId: response.data.orderId,
                status: response.data.status
            };
        } catch (error: any) {
            console.error('[BINANCE_FUTURES] Order placement failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.msg || 'BINANCE_EXECUTION_ERROR'
            };
        }
    }

    private async setLeverage(symbol: string, leverage: number, credentials: any) {
        const timestamp = Date.now();
        const cleanSymbol = symbol.toUpperCase().replace('/', '');
        const queryString = `symbol=${cleanSymbol}&leverage=${leverage}&timestamp=${timestamp}`;
        const signature = this.generateSignature(queryString, credentials.api_secret);

        try {
            await axios.post(`${this.baseURL}/fapi/v1/leverage?${queryString}&signature=${signature}`, null, {
                headers: { 'X-MBX-APIKEY': credentials.api_key }
            });
        } catch (error: any) {
            // Leverage might already be set or error occurs, log but don't abort
            console.warn('[BINANCE_FUTURES] Leverage set warning:', error.response?.data?.msg || error.message);
        }
    }

    /**
     * DIAGNOSTIC: Check if account is in Hedge Mode
     */
    async getPositionMode(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<boolean> {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.generateSignature(queryString, credentials.api_secret);

        const response = await axios.get(`${this.baseURL}/fapi/v1/positionSide/dual?${queryString}&signature=${signature}`, {
            headers: { 'X-MBX-APIKEY': credentials.api_key }
        });

        return response.data.dualSidePosition; // true = Hedge Mode
    }
}
