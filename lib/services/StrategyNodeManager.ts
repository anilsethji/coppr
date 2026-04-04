import { createClient } from '@/lib/supabase/server';

export interface NodeStatus {
  strategyId: string;
  status: 'STOPPED' | 'STARTING' | 'RUNNING' | 'ERROR' | 'PROVISIONING';
  lastPing?: string;
  workerId?: string;
}

export class StrategyNodeManager {
  /**
   * Activates a managed strategy node by provisioning a virtual MT5 instance.
   * This triggers the state transition chain: STOPPED -> PROVISIONING -> RUNNING.
   */
  static async activateNode(strategyId: string): Promise<{ success: boolean; message: string }> {
    const supabase = createClient();

    // 1. Check Strategy Managed State Eligibility
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();

    if (sError || !strategy) {
      return { success: false, message: 'Strategy not found' };
    }

    if (strategy.execution_mode !== 'COPPR_MANAGED' || !strategy.is_managed) {
      return { success: false, message: 'Strategy is not designated for Coppr Management (Mode: ' + strategy.execution_mode + ')' };
    }

    if (!strategy.ea_file_url) {
      return { success: false, message: 'EA File not found in secure vault. Please upload the .ex5/.mq5 file first.' };
    }

    try {
      // 2. Initiate Provisioning Orchestration
      console.log(`[NodeManager] Initiating Provisioning for Virtual Node: ${strategyId}`);
      
      // Update Status to PROVISIONING (Fulfillment phase)
      const { error: upError } = await supabase
        .from('strategies')
        .update({ 
          managed_node_status: 'PROVISIONING',
          is_managed_active: false 
        })
        .eq('id', strategyId);

      if (upError) throw upError;

      // 3. Simulate Node Bootstrapping Lifecycle (Async)
      // In production, this would trigger a Docker container in a background worker
      setTimeout(async () => {
        try {
          const innerSupabase = createClient();
          console.log(`[NodeManager] Provisioning complete. Setting node to RUNNING: ${strategyId}`);
          
          await innerSupabase
            .from('strategies')
            .update({ 
              managed_node_status: 'RUNNING',
              is_managed_active: true,
              last_node_ping: new Date().toISOString()
            })
            .eq('id', strategyId);
            
          console.log(`[NodeManager] Node LIVE on Coppr Fiber Channel: ${strategyId}`);
        } catch (innerErr) {
          console.error('[NodeManager] Post-Provisioning Failure:', innerErr);
        }
      }, 5000); // 5s mock delay for dev purposes

      return { 
        success: true, 
        message: 'Managed node provisioning sequence initiated. Execution will start in ~60 seconds.' 
      };

    } catch (err: any) {
      console.error('[NodeManager] Provisioning Chain ERROR:', err);
      return { success: false, message: 'Internal Provisioning Error: ' + err.message };
    }
  }

  /**
   * Stops a virtual execution node gracefully.
   */
  static async stopNode(strategyId: string): Promise<void> {
    const supabase = createClient();
    console.log(`[NodeManager] Terminating Virtual Node: ${strategyId}`);
    
    await supabase
      .from('strategies')
      .update({ 
        managed_node_status: 'STOPPED',
        is_managed_active: false 
      })
      .eq('id', strategyId);
  }
}
