export interface BrokerOrder {
    symbol: string;
    action: 'BUY' | 'SELL' | 'CLOSE';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT' | 'STOP';
    limitPrice?: number;
    price?: number;
    sl?: number;
    tp?: number;
    leverage?: number;
}

export interface BrokerResponse {
    success: boolean;
    orderId?: string;
    error?: string;
}

export abstract class BrokerAdapter {
    abstract placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse>;
    abstract getAccountBalance(credentials: any): Promise<number>;
}

export class ZerodhaAdapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[ZERODHA] [${credentials.account_id}] Execution: ${order.action} ${typeStr} ${order.symbol} x ${order.quantity}`);
        return { success: true, orderId: `ZERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    }

    async getAccountBalance(credentials: any): Promise<number> {
        return 10000; // Mock balance
    }
}

export class AngelOneAdapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[ANGELONE] [${credentials.account_id}] Execution: ${order.action} ${typeStr} ${order.symbol} x ${order.quantity}`);
        return { success: true, orderId: `ANGL-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    }

    async getAccountBalance(credentials: any): Promise<number> {
        return 10000; // Mock balance
    }
}

export class MT5Adapter extends BrokerAdapter {
    async placeOrder(order: BrokerOrder, credentials: any): Promise<BrokerResponse> {
        const typeStr = order.orderType === 'MARKET' ? 'MARKET' : `LIMIT @ ${order.limitPrice}`;
        console.log(`[MT5] [${credentials.account_id}] Mirroring ${order.action} ${typeStr} ${order.symbol} x ${order.quantity} (Lev: ${order.leverage || 1}x)`);
        return { success: true, orderId: `MT5-${credentials.account_id}-${Date.now()}` };
    }

    async getAccountBalance(credentials: any): Promise<number> {
        return 10000; // Mock balance
    }
}
