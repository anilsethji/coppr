/**
 * EA CONFIGURATION GENERATOR
 * Generates a JSON configuration file for the MetaTrader 5 EA Bot.
 */
export function downloadEAConfig(strategy: any, subscription: any) {
  const config = {
    metadata: {
      generated_at: new Date().toISOString(),
      platform: "Coppr Marketplace",
      version: "2.0"
    },
    strategy: {
      id: strategy.id,
      name: strategy.name,
      symbol: strategy.symbol,
      type: strategy.type
    },
    license: {
      subscription_id: subscription.id,
      signal_key: subscription.signal_key,
      mt5_account: subscription.mt5_account_number || "NOT_LINKED",
      status: subscription.status
    },
    connection: {
      api_endpoint: "https://www.coppr.in/api/license/signal",
      heartbeat_interval: 60,
      retry_attempts: 3
    }
  };

  const fileName = `coppr_config_${strategy.name.toLowerCase().replace(/\s+/g, '_')}.json`;
  const jsonString = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
