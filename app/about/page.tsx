export const metadata = { title: 'About Us | Built by a trader, for traders' };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      
      {/* FOUNDER */}
      <section className="text-center mb-20">
        <img src="/founder_photo.jpg" alt="Anil Seth" className="w-40 h-40 border-[3px] border-gold-badge/50 rounded-full mx-auto mb-6 object-cover object-top shadow-[0_0_30px_rgba(255,215,0,0.2)] bg-navy-card" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Built by a trader, for traders.</h1>
        <p className="text-gold-badge font-medium mb-8 text-lg">Anil Seth</p>
        <div className="card p-8 text-left max-w-3xl mx-auto relative">
          <span className="text-6xl text-white/5 absolute top-4 left-4 font-serif">"</span>
          <p className="text-gray-300 text-lg leading-relaxed relative z-10">
            I am Anil Seth from New Delhi, India. I have been trading forex and gold on MT5 for 8 years. I built my first EA bot because I was tired of sitting in front of charts for hours. After testing dozens of strategies and losing money on bad advice, I decided to build my own system and test it publicly — not in a backtest.<br/><br/>
            Coppr is the result. I share exactly what I use — real account recordings, real results, and real losses included. No hype. No guaranteed profits.
          </p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12">
         <div>
           <h2 className="text-2xl font-bold mb-6">What We Do</h2>
           <ul className="space-y-4 text-gray-300">
             <li className="flex items-start"><span className="text-green-electric mr-3 font-bold">✓</span> We build and test EA bots on real live accounts</li>
             <li className="flex items-start"><span className="text-green-electric mr-3 font-bold">✓</span> We record every significant trade — wins and losses both</li>
             <li className="flex items-start"><span className="text-green-electric mr-3 font-bold">✓</span> We update the kit monthly with new tools</li>
             <li className="flex items-start"><span className="text-green-electric mr-3 font-bold">✓</span> We teach lot size control and risk management</li>
           </ul>
         </div>
         <div className="bg-[#110505] p-6 rounded-card border border-red-900/30">
           <h2 className="text-xl font-bold mb-4 text-red-500">What We Don't Do</h2>
           <ul className="space-y-4 text-gray-300">
             <li className="flex items-start"><span className="text-red-500 mr-3 font-bold">✗</span> We do NOT provide financial advice or trading signals</li>
             <li className="flex items-start"><span className="text-red-500 mr-3 font-bold">✗</span> We are NOT a signal service or portfolio management service</li>
           </ul>
         </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="mb-20 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Why we show losses</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          Trust is built on transparency, not highlights. The algorithmic trading space is polluted with flawless backtests that fail in live markets. By showcasing periods of drawdown and genuine losing streaks, we provide a mathematically realistic look at EA performance. 
        </p>
      </section>

      {/* DISCLAIMER BOX & BUSINESS INFO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="card p-6 border border-gold-badge/50 bg-[#F5A623]/10 relative">
          <p className="text-sm font-bold text-gold-badge mb-3 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-gold-badge"></span> IMPORTANT
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Coppr is NOT registered with SEBI as an investment advisor, portfolio manager, or research analyst. We do NOT provide financial advice or investment recommendations. All EA bots, indicators, and content are for educational purposes only. Trading forex and gold involves significant risk of loss. You are solely responsible for all trading decisions.
          </p>
        </div>
        <div className="card p-6 border border-white/10">
          <h3 className="font-bold text-white mb-4">Business Information</h3>
          <div className="text-sm text-gray-400 space-y-3">
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Business name:</strong> <span>Coppr</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Owner name:</strong> <span>Anil Seth</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Entity Type:</strong> <span>Sole Proprietor</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Founded:</strong> <span>2026</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Email:</strong> <span>anil@coppr.com</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>WhatsApp:</strong> <span>+91 9876543210</span></p>
            <p className="flex flex-col border-b border-white/5 pb-2"><strong>Address:</strong> <span className="mt-1">Connaught Place, New Delhi 110001, India</span></p>
            <p className="flex justify-between pt-1 text-green-electric"><strong>Support:</strong> <span>Mon–Sat 10AM–7PM IST</span></p>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="card p-4 text-xs font-semibold text-gray-300 flex items-center justify-center min-h-[80px]">Real MT5 accounts — not demo</div>
        <div className="card p-4 text-xs font-semibold text-gray-300 flex items-center justify-center min-h-[80px]">Monthly updated content</div>
        <div className="card p-4 text-xs font-semibold text-gray-300 flex items-center justify-center min-h-[80px]">Cancel anytime</div>
        <div className="card p-4 text-xs font-semibold text-gray-300 flex items-center justify-center min-h-[80px]">7-day refund on first payment</div>
      </section>

    </div>
  );
}
