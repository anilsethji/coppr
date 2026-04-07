import axios from 'axios';

export class GrowwAdapter {
    private baseURL: string = 'https://api.groww.in';

    constructor() {}

    /**
     * GROWW ACCESS TOKEN HANDSHAKE
     * Typically requires daily session token from Groww dashboard.
     */
    async getAccountBalance(credentials: { account_id?: string, api_key: string, api_secret?: string }): Promise<number> {
        try {
            const response = await axios.get(`${this.baseURL}/v1/funds`, {
                headers: {
                    'Authorization': `Bearer ${credentials.api_key}`,
                    'Content-Type': 'application/json'
                }
            });

            // Groww returns available cash
            return parseFloat(response.data.available_cash || '0');
        } catch (error: any) {
             console.error('[GROWW] Balance fetch failed:', error.response?.data || error.message);
             throw new Error('GROWW_API_ERROR');
        }
    }

    async placeOrder(orderConfig: any, credentials: { account_id?: string, api_key: string, api_secret?: string }): Promise<any> {
        const { symbol, action, quantity, orderType, price, product } = orderConfig;

        // Groww Mapping:
        // transaction_type: BUY, SELL
        // order_type: MARKET, LIMIT
        // product_type: INTRADAY, DELIVERY, FNO
        
        const payload = {
            exchange: 'NSE', // Default to NSE
            symbol_token: '1333', // Fixed Example Token
            transaction_type: action.toUpperCase(),
            order_type: orderType.toUpperCase(),
            quantity: Math.floor(quantity),
            price: price || 0,
            product_type: product || 'INTRADAY'
        };

        try {
            const response = await axios.post(`${this.baseURL}/v1/orders`, payload, {
                headers: {
                    'Authorization': `Bearer ${credentials.api_key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'failure') {
                throw new Error(response.data.message);
            }

            return {
                success: true,
                orderId: response.data.order_id
            };
        } catch (error: any) {
            console.error('[GROWW] Order failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.message || 'GROWW_EXECUTION_ERROR'
            };
        }
    }
}
