import Link from "next/link";

export default function GuidesPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20 px-4 pt-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">Protocol Setup Guides</h1>
        <p className="text-gray-500">Everything you need to deploy your terminals correctly.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="stat-card border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer">
           <div className="flex items-center gap-6 p-2">
              <div className="text-3xl">📥</div>
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">MT5 Installation Protocol</h3>
                 <p className="text-xs text-gray-500">Learn how to install .ex5 and .mq5 files into your MetaTrader 5 terminal.</p>
              </div>
              <div className="text-[#00E676] font-bold text-xs">VIEW GUIDE →</div>
           </div>
        </div>

        <div className="stat-card border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer">
           <div className="flex items-center gap-6 p-2">
              <div className="text-3xl">⚙️</div>
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">Bot Parameter Optimization</h3>
                 <p className="text-xs text-gray-500">Understanding SL, TP, and Lot Size management for Gold (XAUUSD).</p>
              </div>
              <div className="text-[#00E676] font-bold text-xs">VIEW GUIDE →</div>
           </div>
        </div>

        <div className="stat-card border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer">
           <div className="flex items-center gap-6 p-2">
              <div className="text-3xl">☁️</div>
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">VPS Deployment Guide</h3>
                 <p className="text-xs text-gray-500">Keep your bots running 24/7 with a specialized trading VPS setup.</p>
              </div>
              <div className="text-[#00E676] font-bold text-xs">VIEW GUIDE →</div>
           </div>
        </div>
      </div>
    </div>
  );
}
