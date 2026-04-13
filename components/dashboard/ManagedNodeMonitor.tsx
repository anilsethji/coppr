'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Loader2,
  Power,
  RefreshCw,
  Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ManagedNodeMonitorProps {
  strategyId: string;
  isCreator?: boolean;
}

export default function ManagedNodeMonitor({ strategyId, isCreator = false }: ManagedNodeMonitorProps) {
  const [status, setStatus] = useState<'STOPPED' | 'PROVISIONING' | 'RUNNING' | 'ERROR'>('STOPPED');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // 1. Initial Fetch
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('managed_node_status')
        .eq('id', strategyId)
        .single();
      
      if (!error && data) {
        setStatus(data.managed_node_status as any);
      }
      setLoading(false);
    };

    fetchStatus();

    // 2. Real-time Subscription to Status Changes
    const channel = supabase
      .channel(`node-status-${strategyId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'strategies',
        filter: `id=eq.${strategyId}`
      }, (payload) => {
        if (payload.new.managed_node_status) {
          setStatus(payload.new.managed_node_status);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [strategyId]);

  const handleAction = async (action: 'START' | 'STOP') => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/manage/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId, action })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Action failed');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-24 bg-white/5 rounded-3xl" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[32px] backdrop-blur-xl overflow-hidden relative"
    >
      {/* Background Pulse for RUNNING status */}
      <AnimatePresence>
        {status === 'RUNNING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#00E676]/5 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500 ${
            status === 'RUNNING' ? 'bg-[#00E676]/10 border-[#00E676]/30 shadow-[0_0_20px_rgba(0,230,118,0.2)]' :
            status === 'PROVISIONING' ? 'bg-orange-500/10 border-orange-500/30 animate-pulse' :
            'bg-white/5 border-white/10'
          }`}>
            {status === 'PROVISIONING' ? (
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-orange-500 animate-spin" />
            ) : (
              <Bot className={`w-5 h-5 md:w-6 md:h-6 ${status === 'RUNNING' ? 'text-[#00E676]' : 'text-white/20'}`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
              <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest leading-none">Virtual Node Status</h4>
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                status === 'RUNNING' ? 'bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]' :
                status === 'PROVISIONING' ? 'bg-orange-500 animate-bounce' :
                'bg-white/10'
              }`} />
            </div>
            <p className={`text-[12px] md:text-[14px] font-black uppercase italic tracking-tight ${
              status === 'RUNNING' ? 'text-[#00E676]' :
              status === 'PROVISIONING' ? 'text-orange-500' :
              'text-white/40'
            }`}>
              {status}
            </p>
          </div>
        </div>

        {isCreator && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            {status === 'STOPPED' || status === 'ERROR' ? (
              <button 
                onClick={() => handleAction('START')}
                disabled={actionLoading}
                className="flex-1 md:flex-none px-6 py-3 bg-[#FFD700] text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#FFD700]/10"
              >
                {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
                Launch Virtual Node
              </button>
            ) : (
              <button 
                onClick={() => handleAction('STOP')}
                disabled={actionLoading || status === 'PROVISIONING'}
                className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20"
              >
                {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
                Shutdown Node
              </button>
            )}
          </div>
        )}

        {!isCreator && status === 'RUNNING' && (
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 py-2.5 md:py-3 bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl">
             <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Network</span>
                <span className="text-[9px] md:text-[10px] font-black text-[#00E676] uppercase italic">Coppr Fiber Live</span>
             </div>
             <div className="w-[1px] h-5 md:h-6 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Latency</span>
                <span className="text-[9px] md:text-[10px] font-black text-white/60">~14ms</span>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
