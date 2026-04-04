//+------------------------------------------------------------------+
//|                                           CopprSyncBridge.mq5    |
//|                                  Copyright 2026, Coppr Protocol  |
//|                                       https://coppr.network      |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Coppr Protocol"
#property link      "https://coppr.network"
#property version   "2.00"
#property strict

// 1. INPUT PARAMETERS: NEURAL CONNECTION
input string InpStrategyID = "STRAT-UUID-HERE"; // Strategy UUID (from Creator Dashboard)
input string InpMasterKey  = "COPPR-KEY-HERE";  // Security Master Key (from Creator Dashboard)
input int    InpPollInterval = 10;              // Heartbeat Interval (seconds)

// 2. GLOBALS
datetime last_sync;
string   signal_hub_url = "https://coppr-signal-hub.vercel.app/api/broadcast";

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit() {
   Print("🚀 [COPPR] Initializing Neural Handshake for Strategy: ", InpStrategyID);
   last_sync = TimeCurrent();
   EventSetTimer(InpPollInterval);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert timer function                                            |
//+------------------------------------------------------------------+
void OnTimer() {
   SendHeartbeat();
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason) {
   EventKillTimer();
   Print("🛑 [COPPR] Terminating Bridge Connection.");
}

//+------------------------------------------------------------------+
//| BROADCAST SIGNAL TO THE GRID                                     |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                       const MqlTradeRequest &request,
                       const MqlTradeResult &result) {
   
   if(trans.type == TRADE_TRANSACTION_ORDER_ADD) {
      BroadcastSignal(trans.symbol, "ORDER_EVENT", trans.order);
   }
}

//+------------------------------------------------------------------+
//| CORE WEB REQUEST LOGIC                                           |
//+------------------------------------------------------------------+
void BroadcastSignal(string symbol, string action, ulong ticket) {
   string cookie=NULL,headers;
   char post[],result[];
   int res;
   
   string json = StringFormat("{\"strategyId\":\"%s\", \"masterKey\":\"%s\", \"symbol\":\"%s\", \"action\":\"%s\", \"ticket\":%llu}", 
                 InpStrategyID, InpMasterKey, symbol, action, ticket);
                 
   StringToCharArray(json, post);
   
   res = WebRequest("POST", signal_hub_url, headers, 1000, post, result, headers);
   
   if(res == 200) {
      Print("✅ [COPPR] Signal Propagated Successfully.");
   } else {
      Print("❌ [COPPR] Security Abort: Signal Failed. Code: ", res);
   }
}

void SendHeartbeat() {
   string cookie=NULL,headers;
   char post[],result[];
   int res;
   
   string json = StringFormat("{\"strategyId\":\"%s\", \"masterKey\":\"%s\", \"status\":\"ONLINE\"}", 
                 InpStrategyID, InpMasterKey);
                 
   StringToCharArray(json, post);
   res = WebRequest("POST", signal_hub_url + "/heartbeat", headers, 1000, post, result, headers);
}
