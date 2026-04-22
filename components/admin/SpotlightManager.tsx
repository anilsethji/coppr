'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Shield, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { updateStrategy, deleteStrategy } from '@/app/dashboard/admin/actions';

export default function SpotlightManager() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [purgeStatus, setPurgeStatus] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simplify query to verify basic functionality
      const { data, error: dbError } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dbError) throw dbError;
      setStrategies(data || []);
    } catch (err: any) {
      console.error('Failed to load strategies:', err);
      setError(err.message || 'Network error while reaching command node.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, field: string, currentValue: boolean) => {
    try {
      setUpdatingId(`${id}-${field}`);
      console.log(`SPOTLIGHT_UPDATE_INIT: ${id} | ${field} -> ${!currentValue}`);
      
      const res = await updateStrategy(id, { [field]: !currentValue });
      
      if (res.success) {
        setStrategies(prev => prev.map(s => s.id === id ? { ...s, [field]: !currentValue } : s));
        console.log(`SPOTLIGHT_UPDATE_SUCCESS: ${id}`);
      } else {
        console.error(`SPOTLIGHT_UPDATE_FAILURE: ${res.error}`);
        alert(`ACCESS_DENIED: ${res.error || 'Server Action failed to synchronize.'}\n\nPlease ensure your SUPABASE_SERVICE_ROLE_KEY is correctly set in .env.local.`);
      }
    } catch (err: any) {
      alert(`NETWORK_HANDSHAKE_ERROR: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = strategies.filter(s => 
    (s.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (s.creator_profiles?.display_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
           <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Strategic Spotlight Manager</h3>
           <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Mark community alpha as FEATURED or OFFICIAL</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Filter by agent name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-[#00E676]/40 transition-all italic"
            />
          </div>
          <button onClick={fetchStrategies} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center gap-4 text-red-500">
           <AlertTriangle className="w-6 h-6 shrink-0" />
           <p className="text-xs font-black uppercase tracking-widest italic">{error}</p>
        </div>
      )}

      <div className="bg-[#131929]/40 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-20 flex justify-center">
             <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-white/5">
                    <th className="p-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Asset Name</th>
                    <th className="p-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Origin</th>
                    <th className="p-4 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Featured Spotlight</th>
                    <th className="p-4 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Official Release</th>
                    <th className="p-4 text-[9px] font-black text-white/20 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filtered.map((s) => (
                   <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                     <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">
                              {s.type === 'MT5_EA' ? '🤖' : '📊'}
                           </div>
                           <div>
                              <div className="text-[11px] font-black text-white truncate max-w-[150px]">{s.name}</div>
                              <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">{s.creator_profiles?.display_name || 'Anonymous'}</div>
                           </div>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                          s.origin === 'OFFICIAL' ? 'bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676]' : 'bg-white/5 border-white/10 text-white/20'
                        }`}>
                           {s.origin}
                        </span>
                     </td>
                     <td className="p-4 text-center">
                        <button 
                          onClick={() => handleToggle(s.id, 'is_featured', s.is_featured)}
                          disabled={updatingId === `${s.id}-is_featured`}
                          className={`p-2 rounded-lg transition-all ${
                            s.is_featured ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'bg-white/5 text-white/10 hover:text-white/40'
                          }`}
                        >
                          {updatingId === `${s.id}-is_featured` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        </button>
                     </td>
                     <td className="p-4 text-center">
                        <button 
                          onClick={() => handleToggle(s.id, 'is_official', s.is_official)}
                          disabled={updatingId === `${s.id}-is_official`}
                          className={`p-2 rounded-lg transition-all ${
                            s.is_official ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'bg-white/5 text-white/10 hover:text-white/40'
                          }`}
                        >
                          {updatingId === `${s.id}-is_official` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        </button>
                     </td>
                     <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            disabled={!!deletingId}
                            onClick={async () => {
                              if (confirmDeleteId !== s.id) {
                                setConfirmDeleteId(s.id);
                                setTimeout(() => setConfirmDeleteId(null), 3000);
                                return;
                              }

                              try {
                                setDeletingId(s.id);
                                setConfirmDeleteId(null);
                                setPurgeStatus('Analyzing dependency tree...');
                                
                                const timeoutId = setTimeout(() => {
                                   setPurgeStatus('Handshake taking longer than expected...');
                                }, 8000);

                                setPurgeStatus('Stage 1: Severing mirror links...');
                                const res = await deleteStrategy(s.id);
                                
                                clearTimeout(timeoutId);

                                if (res.success) {
                                   setPurgeStatus('Purge complete.');
                                   await fetchStrategies();
                                } else {
                                   setPurgeStatus(`Error: ${res.error}`);
                                   setTimeout(() => setPurgeStatus(''), 5000);
                                }
                              } catch (err: any) {
                                console.error('ATOMIC_PURGE_FATAL:', err);
                              } finally {
                                setDeletingId(null);
                                if (!purgeStatus.startsWith('Error')) setPurgeStatus('');
                              }
                            }}
                            className={`px-4 py-2 flex items-center gap-2 transition-all rounded-xl border relative z-50 ${
                              deletingId === s.id 
                                ? 'bg-red-500/20 border-red-500/40 text-red-500 animate-pulse' 
                                : confirmDeleteId === s.id
                                ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                : 'text-white/10 hover:text-red-500 hover:bg-red-500/10 border-transparent hover:border-red-500/20'
                            }`}
                          >
                             {deletingId === s.id ? (
                               <Loader2 className="w-4 h-4 animate-spin" />
                             ) : (
                               <Trash2 className={`w-4 h-4 ${confirmDeleteId === s.id ? 'animate-bounce' : ''}`} />
                             )}
                             {confirmDeleteId === s.id && (
                               <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Confirm Purge?</span>
                             )}
                          </button>
                          {deletingId === s.id && (
                             <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter animate-pulse">{purgeStatus}</span>
                          )}
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
