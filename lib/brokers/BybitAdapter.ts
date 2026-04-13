import axios from 'axios';
import crypto from 'crypto';

export class BybitAdapter {
    private baseURL: string;

    constructor(testnet: boolean = false) {
        this.baseURL = testnet ? 'https://api-testnet.bybit.com' : 'https://api.bybit.com';
    }

    private generateSignature(params: any, credentials: { api_key: string, api_secret: string }, timestamp: number, recvWindow: number = 5000): string {
        const paramStr = timestamp + credentials.api_key + recvWindow + JSON.stringify(params);
        return crypto
            .createHmac('sha256', credentials.api_secret)
            .update(paramStr)
            .digest('hex');
    }

    // Since Bybit V5 uses a different signature for GET vs POST
    private signV5(apiSecret: string, timestamp: number, api_key: string, recvWindow: number, payload: string): string {
        return crypto.createHmac('sha256', apiSecret).update(timestamp + api_key + recvWindow + payload).digest('hex');
    }

    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<number> {
        const timestamp = Date.now().toString();
        const recvWindow = 5000;
        const endpoint = '/v5/account/wallet-balance?accountType=UNIFIED';
        const signature = crypto.createHmac('sha256', credentials.api_secret).update(timestamp + credentials.api_key + recvWindow + 'accountType=UNIFIED').digest('hex');

        try {
            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                headers: {
                    'X-BAPI-API-KEY': credentials.api_key,
                    'X-BAPI-SIGN': signature,
                    'X-BAPI-TIMESTAMP': timestamp,
                    'X-BAPI-RECV-WINDOW': recvWindow.toString(),
                }
            });

            const balances = response.data.result?.list?.[0]?.coin || [];
            const usdt = balances.find((b: any) => b.coin === 'USDT');
            return parseFloat(usdt?.walletBalance || '0');
        } catch (error: any) {
            console.error('[BYBIT] Balance fetch failed:', error.response?.data || error.message);
            throw new Error('BYBIT_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price, leverage } = orderConfig;
        const timestamp = Date.now().toString();
        const recvWindow = 5000;

        // Bybit V5 Mapping: 
        // positionIdx: 0 (one-way), 1 (Buy side of hedge), 2 (Sell side of hedge)
        const side = action === 'BUY' ? 'Buy' : 'Sell';
        const positionIdx = action === 'BUY' ? 1 : 2; 

        const payload = {
            category: 'linear',
            symbol: symbol.toUpperCase().replace('/', ''),
            side,
            orderType: orderType || 'Market',
            qty: quantity.toString(),
            positionIdx,
            timeInForce: 'GTC'
        };

        if (orderType === 'Limit') {
            (payload as any).price = price.toString();
        }

        const jsonPayload = JSON.stringify(payload);
        const signature = crypto.createHmac('sha256', credentials.api_secret).update(timestamp + credentials.api_key + recvWindow + jsonPayload).digest('hex');

        try {
            const response = await axios.post(`${this.baseURL}/v5/order/create`, payload, {
                headers: {
                    'X-BAPI-API-KEY': credentials.api_key,
                    'X-BAPI-SIGN': signature,
                    'X-BAPI-TIMESTAMP': timestamp,
                    'X-BAPI-RECV-WINDOW': recvWindow.toString(),
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.retCode !== 0) {
                throw new Error(response.data.retMsg);
            }

            return {
                success: true,
                orderId: response.data.result.orderId
            };
        } catch (error: any) {
            console.error('[BYBIT] Order failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.message || 'BYBIT_EXECUTION_ERROR'
            };
        }
    }

    async getPositionMode(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<boolean> {
        const timestamp = Date.now().toString();
        const recvWindow = 5000;
        const endpoint = '/v5/position/list?category=linear&settleCoin=USDT&limit=1';
        const signature = crypto.createHmac('sha256', credentials.api_secret).update(timestamp + credentials.api_key + recvWindow + 'category=linear&settleCoin=USDT&limit=1').digest('hex');

        const response = await axios.get(`${this.baseURL}${endpoint}`, {
            headers: {
                'X-BAPI-API-KEY': credentials.api_key,
                'X-BAPI-SIGN': signature,
                'X-BAPI-TIMESTAMP': timestamp,
                'X-BAPI-RECV-WINDOW': recvWindow.toString(),
            }
        });

        // Bybit returns positionIdx 1 or 2 if in hedge mode.
        // We'll check the first item's positionIdx.
        const position = response.data.result?.list?.[0];
        return position ? (position.positionIdx !== 0) : true; // Default to true if no positions
    }

    async getInstruments(): Promise<any[]> {
        try {
            const response = await axios.get(`${this.baseURL}/v5/market/instruments-info?category=linear`);
            if (response.data.retCode !== 0) return [];

            return response.data.result.list
                .filter((s: any) => s.status === 'Trading' && s.quoteCoin === 'USDT')
                .map((s: any) => ({
                    symbol: s.symbol,
                    baseAsset: s.baseCoin,
                    quoteAsset: s.quoteCoin,
                    displayName: `${s.baseCoin}/USDT`,
                    type: 'CRYPTO'
                }));
        } catch (error: any) {
            console.error('[BYBIT] Failed to fetch instruments:', error.message);
            return [];
        }
    }
}
