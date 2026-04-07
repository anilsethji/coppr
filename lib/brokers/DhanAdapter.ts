import axios from 'axios';

export class DhanAdapter {
    private baseURL: string = 'https://api.dhan.co';

    constructor() {}

    /**
     * DHAN API requires the access_token in the header.
     * Retail users copy this from the DhanHQ dashboard (Daily refresh).
     */
    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret?: string }): Promise<number> {
        // Dhan uses 'api_key' as the JWT Access Token
        try {
            const response = await axios.get(`${this.baseURL}/fundlimit`, {
                headers: {
                    'access-token': credentials.api_key,
                    'Content-Type': 'application/json'
                }
            });

            // Dhan returns 'availabelBalance'
            return parseFloat(response.data.dhanRestData?.availabelBalance || '0');
        } catch (error: any) {
            console.error('[DHAN] Balance fetch failed:', error.response?.data || error.message);
            throw new Error('DHAN_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret?: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price, sl, tp, product } = orderConfig;

        // Dhan Order Mapping:
        // transactionType: BUY, SELL
        // productType: INTRADAY, MARGIN, CNC
        // exchangeSegment: NSE_EQ, NSE_FNO, MCX_COMM
        
        const payload = {
            dhanClientId: credentials.account_id,
            correlationId: `coppr_${Date.now()}`,
            transactionType: action.toUpperCase(),
            exchangeSegment: 'NSE_EQ', // Default to NSE Equity
            productType: product || 'INTRADAY',
            orderType: orderType === 'MARKET' ? 'MARKET' : 'LIMIT',
            validity: 'DAY',
            securityId: '1333', // HDFC Example - In reality, we need symbol mapping
            quantity: Math.floor(quantity),
            price: price || 0,
        };

        try {
            const response = await axios.post(`${this.baseURL}/orders`, payload, {
                headers: {
                    'access-token': credentials.api_key,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'failure') {
                throw new Error(response.data.remarks);
            }

            return {
                success: true,
                orderId: response.data.dhanRestData.orderId
            };
        } catch (error: any) {
            console.error('[DHAN] Order failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.message || 'DHAN_EXECUTION_ERROR'
            };
        }
    }
}
