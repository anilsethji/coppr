export interface BrokerOrder {
    symbol: string;
    action: 'BUY' | 'SELL' | 'CLOSE';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT' | 'STOP';
    limitPrice?: number;
    price?: number;
    sl?: number;
    tp?: number;
}

export interface BrokerResponse {
    success: boolean;
    orderId?: string;
    error?: string;
}

export abstract class BrokerAdapter {
    abstract placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse>;
}

export class ZerodhaAdapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[ZERODHA] [${credentials.account_id}] Execution: ${order.action} ${typeStr} ${order.symbol} x ${order.quantity}`);
        return { success: true, orderId: `ZERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    }
}

export class AngelOneAdapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[ANGELONE] [${credentials.account_id}] Execution: ${order.action} ${typeStr} ${order.symbol} x ${order.quantity}`);
        return { success: true, orderId: `ANGL-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    }
}

export class MT5Adapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[MT5] [${credentials.account_id}] Mirroring ${order.action} ${typeStr} ${order.symbol} x ${order.quantity}`);
        return { success: true, orderId: `MT5-${credentials.account_id}-${Date.now()}` };
    }
}
