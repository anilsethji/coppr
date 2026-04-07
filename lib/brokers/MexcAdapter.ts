import axios from 'axios';
import crypto from 'crypto';

export class MexcAdapter {
    private baseURL: string = 'https://contract.mexc.com';

    constructor() {}

    private generateSignature(params: any, apiSecret: string, timestamp: number): string {
        const paramStr = timestamp + JSON.stringify(params);
        return crypto
            .createHmac('sha256', apiSecret)
            .update(paramStr)
            .digest('hex');
    }

    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<number> {
        const timestamp = Date.now().toString();
        const endpoint = '/api/v1/private/account/assets';
        
        // MEXC signature is often simpler in v1 but check headers
        try {
            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                headers: {
                    'ApiKey': credentials.api_key,
                    'Request-Time': timestamp,
                    'Signature': crypto.createHmac('sha256', credentials.api_secret).update(credentials.api_key + timestamp).digest('hex'),
                    'Content-Type': 'application/json'
                }
            });

            const balances = response.data.data || [];
            const usdt = balances.find((b: any) => b.currency === 'USDT');
            return parseFloat(usdt?.availableBalance || '0');
        } catch (error: any) {
            console.error('[MEXC] Balance fetch failed:', error.response?.data || error.message);
            throw new Error('MEXC_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price } = orderConfig;
        const timestamp = Date.now().toString();

        // MEXC Mapping: 
        // Side: 1 (Open Buy), 2 (Close Sell), 3 (Open Sell), 4 (Close Buy)
        // Since we are doing MT5 binary execution, we'll use 1 and 3 for open.
        const side = action === 'BUY' ? 1 : 3;
        const type = orderType === 'Limit' ? 1 : 5; // 5 = Market

        const payload = {
            symbol: symbol.toUpperCase().replace('/', '_'),
            price: price || 0,
            vol: quantity.toString(),
            side,
            type,
            openType: 1 // 1=Isolated, 2=Cross
        };

        const signature = crypto.createHmac('sha256', credentials.api_secret).update(credentials.api_key + timestamp + JSON.stringify(payload)).digest('hex');

        try {
            const response = await axios.post(`${this.baseURL}/api/v1/private/order/create`, payload, {
                headers: {
                    'ApiKey': credentials.api_key,
                    'Request-Time': timestamp,
                    'Signature': signature,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }

            return {
                success: true,
                orderId: response.data.data
            };
        } catch (error: any) {
            console.error('[MEXC] Order failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.message || 'MEXC_EXECUTION_ERROR'
            };
        }
    }

    async getPositionMode(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<boolean> {
        const timestamp = Date.now().toString();
        const endpoint = '/api/v1/private/account/config';
        
        const response = await axios.get(`${this.baseURL}${endpoint}`, {
            headers: {
                'ApiKey': credentials.api_key,
                'Request-Time': timestamp,
                'Signature': crypto.createHmac('sha256', credentials.api_secret).update(credentials.api_key + timestamp).digest('hex'),
            }
        });

        // 1=Hedge, 2=One-Way in MEXC context usually
        return response.data.data?.positionMode === 1;
    }
}
