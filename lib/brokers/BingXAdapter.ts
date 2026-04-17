import axios from 'axios';
import crypto from 'crypto';

export class BingXAdapter {
    private baseURL: string = 'https://open-api.bingx.com';

    constructor() {}

    private sign(params: string, secret: string) {
        return crypto.createHmac('sha256', secret).update(params).digest('hex');
    }

    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<number> {
        const timestamp = Date.now().toString();
        const queryString = `timestamp=${timestamp}&apiKey=${credentials.api_key}`;
        const signature = this.sign(queryString, credentials.api_secret);

        try {
            const response = await axios.get(`${this.baseURL}/openApi/swap/v2/user/balance?${queryString}&signature=${signature}`);
            const data = response.data.data?.balance || {};
            return parseFloat(data.balance || '0');
        } catch (error: any) {
             console.error('[BINGX] Balance check failed:', error.response?.data || error.message);
             throw new Error('BINGX_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price } = orderConfig;
        const timestamp = Date.now().toString();

        // BingX Side Mapping: 
        // side: BUY, SELL
        // positionSide: LONG, SHORT (Hedge Mode)
        const side = action === 'BUY' ? 'BUY' : 'SELL';
        const positionSide = action === 'BUY' ? 'LONG' : 'SHORT';

        const queryString = `symbol=${symbol.toUpperCase().replace('/', '-')}&side=${side}&positionSide=${positionSide}&type=${orderType.toUpperCase()}&quantity=${quantity}&timestamp=${timestamp}&apiKey=${credentials.api_key}`;
        const signature = this.sign(queryString, credentials.api_secret);

        try {
            const response = await axios.post(`${this.baseURL}/openApi/swap/v2/trade/order?${queryString}&signature=${signature}`);
            
            if (response.data.code !== 0) {
                throw new Error(response.data.msg);
            }

            return {
                success: true,
                orderId: response.data.data.orderId
            };
        } catch (error: any) {
            console.error('[BINGX] Order failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.message || 'BINGX_EXECUTION_ERROR'
            };
        }
    }

    async getPositionMode(credentials: { account_id?: string, api_key: string, api_secret: string }): Promise<boolean> {
        const timestamp = Date.now().toString();
        const queryString = `timestamp=${timestamp}&apiKey=${credentials.api_key}`;
        const signature = this.sign(queryString, credentials.api_secret);

        const response = await axios.get(`${this.baseURL}/openApi/swap/v1/positionMode?${queryString}&signature=${signature}`);
    // dualSidePosition = true means Hedge Mode
        return response.data.data?.dualSidePosition === true;
    }

    async getInstruments(): Promise<any[]> {
        try {
            const response = await axios.get(`${this.baseURL}/openApi/swap/v2/quote/contracts`);
            if (response.data.code !== 0) return [];

            return response.data.data.map((s: any) => ({
                symbol: s.symbol,
                displayName: s.symbol.replace('-', '/'),
                type: 'CRYPTO'
            }));
        } catch (error: any) {
            console.error('[BINGX] Failed to fetch instruments:', error.message);
            return [];
        }
    }
}
