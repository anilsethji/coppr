import Link from 'next/link';
import { HeroWidgets } from '@/components/ui/HeroWidgets';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden border-b border-white/5 bg-navy-deep py-32 lg:py-40 flex flex-col justify-center">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,230,118,0.03)_0%,transparent_60%)] pointer-events-none hidden md:block"></div>
        
        {/* Floating Animated Widgets */}
        <HeroWidgets />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gradient pb-2">
            Your MT5 Bot is Already Running. <br className="hidden md:block"/> You Just Don't Have It Yet.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Live-tested EA bots for gold and forex. Not backtests. Real accounts. Real results.
          </p>
          <div className="flex flex-col items-center">
            <Link href="/checkout" className="btn-primary text-xl py-4 px-10 mb-4 inline-flex">
              Get Instant Access — Rs.1999/month
            </Link>
            <p className="text-sm text-gray-400 mb-2">Cancel anytime. No lock-in. 7-day refund on first payment.</p>
            <p className="text-xs text-gray-600 uppercase tracking-widest mt-4">For educational use only. Not financial advice. Trading involves risk.</p>
          </div>
        </div>
      </section>

      {/* PROOF SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Watch before you decide</h2>
          <p className="text-gray-400">Same bot. Three account sizes. Real MT5. No demo.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {[
            { tag: "$50 Starter — Lot 0.01", highlight: false },
            { tag: "$250 Mid — Lot 0.05", highlight: true },
            { tag: "$1000 Pro — Lot 0.20", highlight: false }
          ].map((card, i) => (
            <div key={i} className={`card p-6 flex flex-col items-center ${card.highlight ? 'border-green-electric/50 shadow-[0_0_30px_rgba(0,230,118,0.1)]' : ''}`}>
              <div className="w-full aspect-video bg-navy-deep rounded-card border border-white/10 flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm">[Video Embed Placeholder]</span>
              </div>
              <p className="font-bold text-lg text-white">{card.tag}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">Screen recordings from real broker accounts. Wins and losses both shown.</p>
      </section>

      {/* VALUE STACK SECTION */}
      <section className="bg-navy-card py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Everything inside the Algo Trading Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              "All EA bots for MT5 — download instantly",
              "All indicators — with MT5 install guides",
              "New bots added every month",
              "Video tutorials for $50, $250, $1000 accounts",
              "Live trade recordings — real account",
              "Lot size and risk control guides",
              "Setup guides — install bot in under 10 minutes",
              "Direct founder support via WhatsApp"
            ].map((feature, i) => (
              <div key={i} className="bg-[#0A0F1E] p-6 rounded-card border border-white/5 flex items-start">
                <span className="text-green-electric mr-3 font-bold">✓</span>
                <p className="text-sm font-medium text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
          <div className="max-w-xl mx-auto text-center border p-8 rounded-card border-gold-badge/30 bg-[#F5A623]/5">
            <h3 className="text-3xl font-bold text-white mb-2">Rs.1999/month</h3>
            <p className="text-gold-badge font-medium mb-4">— less than Rs.66/day —</p>
            <p className="text-sm text-gray-400">Most courses cost Rs.15,000–30,000 and teach theory. This gives you working tools.</p>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why I show losses too</h2>
          <p className="text-gray-400">Real trading isn't a straight line up. High-probability trading systems experience drawdown. By showing you the unedited screen recordings containing real losses, you learn exactly how these tools handle market volatility. Total transparency is the only way to build trust.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map((i) => (
            <div key={i} className="card p-4">
              <div className="w-full aspect-square bg-[#0A0F1E] rounded-card border border-white/5 flex items-center justify-center">
                <span className="text-gray-500 text-sm whitespace-pre-wrap text-center">Real MT5 account.\nNo edits.</span>
              </div>
            </div>
           ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-navy-card py-20 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is this for beginners?", a: "Yes — setup guides for all levels." },
              { q: "What broker do I need?", a: "Any MT5-compatible broker. List inside dashboard." },
              { q: "How do I install?", a: "Step-by-step video guide inside dashboard. Under 10 minutes." },
              { q: "Can I cancel anytime?", a: "Yes. No penalties. Access until end of billing period." },
              { q: "Is this a signal service?", a: "No. Automated bots run on your own MT5. You control your account." },
              { q: "Are profits guaranteed?", a: "No. Trading involves risk. We show wins and losses." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#0A0F1E] p-6 rounded-card border border-white/5">
                <h4 className="font-bold text-white mb-2 text-lg">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-8">Start trading smarter today</h2>
        <div className="flex flex-col items-center">
          <Link href="/checkout" className="btn-primary text-xl py-4 px-10 mb-6 inline-flex">
            Subscribe Now — Rs.1999/month
          </Link>
          <div className="flex items-center justify-center gap-4 text-gray-400 font-semibold text-sm mb-4 bg-navy-card py-2 px-6 rounded-full border border-white/10">
            <span>UPI</span> • <span>PhonePe</span> • <span>GPay</span> • <span>Paytm</span> • <span>Visa</span> • <span>Mastercard</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Secure payment. Your data is protected.</p>
        </div>
      </section>

    </div>
  );
}
