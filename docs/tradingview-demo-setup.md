# 📚 Tutorial: TradingView Demo Setup (Step-by-Step)

This guide will walk you through setting up a **TradingView Demo** account on Coppr. This is a risk-free simulator that allows you to test your Pine Script indicator alerts before going live.

---

### Step 1: Connect to the Coppr Simulator
First, you need to tell Coppr that you want to use a "Demo" connection for your bot.

1.  Open your **[Signal Sync Vault](http://localhost:3000/dashboard/vault)**.
2.  Find the bot you want to test and click **"Connect API"**.
3.  Select **TradingView Demo** from the broker list.
4.  **Simulation Name**: Enter any name you like (e.g., `MyTestBot` or `PaperTrade01`). 
    - *Note: You do NOT need a real TradingView API key or Secret here.*
5.  Check the risk acceptance box and click **Initialize Linking**.
6.  **Copy the Webhook URL**: Once linked, click the bot card again to see your unique **Webhook URL**. Copy this.

---

### Step 2: Set Up the Alert in TradingView
Now, you need to tell TradingView to send signals to Coppr.

1.  Open your chart on **TradingView**.
2.  Click the **Alert** icon (Alarms) in the top right.
3.  **Condition**: Select your indicator or strategy.
4.  **Notifications Tab**: 
    - Check **Webhook URL**.
    - Paste the **Webhook URL** you copied from Coppr.
5.  **Settings Tab**:
    - Select your Trigger (e.g. "Once per bar close").
    - **Message**: This is where you paste the JSON code (see Step 3 below).
6.  Click **Create**.

---

### Step 3: JSON Message Templates
Depending on what you are trading, paste the following into the **Message** field of your TradingView alert.

#### 🟠 FOR BITCOIN (BTCUSD)
```json
{
  "action": "{{strategy.order.action}}",
  "symbol": "BTCUSD",
  "quantity": 1,
  "price": "{{strategy.order.price}}",
  "order_type": "MARKET"
}
```

#### 🔵 FOR ETHEREUM (ETHUSD)
```json
{
  "action": "{{strategy.order.action}}",
  "symbol": "ETHUSD",
  "quantity": 10,
  "price": "{{strategy.order.price}}",
  "order_type": "MARKET"
}
```

#### 🟡 FOR GOLD (XAUUSD)
```json
{
  "action": "{{strategy.order.action}}",
  "symbol": "XAUUSD",
  "quantity": 0.1,
  "price": "{{strategy.order.price}}",
  "order_type": "MARKET"
}
```

---

### Step 4: Verify Your Test
1.  Wait for your indicator to trigger a "Buy" or "Sell" on TradingView.
2.  Check the **Live Terminal** on the Coppr Dashboard.
3.  You should see a log entry saying **`SIMULATED_SUCCESS`**. This confirms that Coppr successfully received your TradingView alert and "executed" it in the simulation!

> [!TIP]
> **Important**: Ensure your "Simulation Name" in Step 1 is simple and contains no special characters for the best experience.
