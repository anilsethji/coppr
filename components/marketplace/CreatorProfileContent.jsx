'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, TrendingUp, LayoutGrid, Share2, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatorProfileContent({ initialData, isModal = false, onFollowToggle }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [following, setFollowing] = useState(false); // Should be fetched from initialData/profile
  const [loadingFollow, setLoadingFollow] = useState(false);

  const creator = data.creator || {};
  const strategies = data.strategies || [];

  const handleFollow = async () => {
    try {
      setLoadingFollow(true);
      const res = await fetch(`/api/creators/${creator.handle}/follow`, { method: 'POST' });
      const resData = await res.json();
      setFollowing(resData.following);
      setLoadingFollow(false);
      if (onFollowToggle) onFollowToggle(resData.following);
    } catch (err) {
      console.error('Follow error:', err);
      setLoadingFollow(false);
    }
  };

  const copyProfileLink = () => {
    const url = `${window.location.origin}/creator/${creator.handle}`;
    navigator.clipboard.writeText(url);
    // Trigger toast here
  };

  return (
    <div className="w-full flex flex-col">
      {/* Cover Banner */}
      <div className="h-28 w-full bg-gradient-to-r from-[#FFD700]/20 via-[#FF8C00]/10 to-transparent relative">
        <div className="absolute inset-0 bg-navy-deep/20 backdrop-blur-[2px]" />
      </div>

      <div className="px-6 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 -mt-8 relative z-10">
          <div className="w-20 h-20 rounded-full border-[3px] border-[#080C14] bg-white/5 overflow-hidden flex items-center justify-center text-3xl shadow-xl">
             {creator.avatar_type === 'EMOJI' ? creator.avatar_data : '👤'}
          </div>
          <button 
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`mt-10 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                following 
                ? 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]' 
                : 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20'
            }`}
          >
            {following ? 'Following ✓' : 'Follow Creator'}
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">{creator.display_name}</h2>
                    {creator.is_verified && <CheckCircle2 className="w-5 h-5 text-[#FFD700] fill-current" />}
                </div>
                <div className="text-[12px] font-bold text-white/30 uppercase tracking-wider">@{creator.handle}</div>
            </div>

            <p className="text-[13px] text-white/50 leading-relaxed max-w-md">
                {creator.bio || "Quantitative trader specializing in gold scalping and trend-following algorithms. Creator of some of the most consistent EA bots on Coppr."}
            </p>

            <div className="flex items-center gap-12 py-6 border-y border-white/5 bg-white/[0.01]">
                {[
                    { label: 'Strategies', value: strategies.length, icon: LayoutGrid },
                    { label: 'Followers', value: creator.follower_count, icon: Users },
                    { label: 'Avg Win Rate', value: '72%', icon: TrendingUp }
                ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">{s.value}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Strategies List */}
            <div className="space-y-4 pt-6">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-white/30">Active Portfolio</h3>
                <div className="space-y-2.5">
                    {strategies.map(strat => (
                        <div 
                          key={strat.id}
                          onClick={() => router.push(`/dashboard/marketplace/${strat.id}`)}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                    <TrendingUp className="w-5 h-5 text-white/20" />
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-white group-hover:text-[#FFD700] transition-colors">{strat.name}</div>
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{strat.type.replace('_', ' ')} • {strat.symbol}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[12px] font-bold text-[#00E676]">{strat.win_rate}% WR</div>
                                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">₹{strat.monthly_price_inr}/mo</div>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#FFD700]/10 group-hover:text-[#FFD700] transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!isModal && (
                <div className="pt-8">
                    <button 
                      onClick={copyProfileLink}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        Share This Profile
                    </button>
                    <p className="text-center text-[9px] text-white/10 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                        Optimized for Instagram Bio · No login required to view portfolio
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
