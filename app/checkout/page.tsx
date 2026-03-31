import Link from 'next/link';

export const metadata = { title: 'Secure Checkout | Coppr' };

export default function CheckoutPage() {
  return (
    <div className="w-full min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Order Summary */}
        <div className="space-y-8">
          <div>
             <h1 className="text-3xl font-bold mb-4">Complete your subscription</h1>
             <p className="text-gray-400">You are moments away from accessing the complete Algo Trading Kit.</p>
          </div>
          
          <div className="card p-6 border-gold-badge/30 bg-[#F5A623]/5">
             <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
               <div>
                 <h3 className="font-bold text-white text-lg">Coppr Monthly Access</h3>
                 <p className="text-sm text-gray-400 mt-1">Next renewal: Nov 30, 2026</p>
               </div>
               <div className="text-2xl font-black text-white">Rs.1999<span className="text-sm text-gray-500 font-normal">/mo</span></div>
             </div>
             <ul className="space-y-3 text-sm text-gray-300 mb-6">
               <li className="flex items-center gap-3"><span className="text-green-electric font-bold">✓</span> All EA bots, indicators & updates</li>
               <li className="flex items-center gap-3"><span className="text-green-electric font-bold">✓</span> Step-by-step video tutorials</li>
               <li className="flex items-center gap-3"><span className="text-green-electric font-bold">✓</span> Live trade recordings & logs</li>
               <li className="flex items-center gap-3"><span className="text-green-electric font-bold">✓</span> Direct WhatsApp support</li>
             </ul>
             <p className="text-xs text-green-electric font-bold bg-green-electric/10 border border-green-electric/20 inline-block px-3 py-1.5 rounded-badge uppercase tracking-widest">No setup fee. No hidden charges.</p>
          </div>
          
          <div className="text-sm text-gray-400 flex items-start gap-3 bg-navy-card p-4 rounded-card">
             <span className="text-xl block">🛡️</span>
             <p><strong>7-day refund on first payment. Cancel anytime.</strong><br/>If you decide the tools aren't for you within 7 days, just email us for a full refund.</p>
          </div>
        </div>

        {/* Payment Box */}
        <div className="card p-8 shadow-2xl bg-[#0A0F1E] border-white/10 h-fit">
           <h2 className="text-xl font-bold mb-6">Payment Details</h2>
           
           <div className="flex items-start mb-8">
            <input type="checkbox" className="mt-1 w-5 h-5 min-w-[20px] rounded border-gray-600 outline-none accent-green-electric" required id="compliance_checkout" />
            <label htmlFor="compliance_checkout" className="ml-3 text-xs text-gray-400 leading-tight">
              I have read and agree to the <Link href="/terms" className="text-white hover:underline transition-colors">Terms</Link>, <Link href="/privacy" className="text-white hover:underline transition-colors">Privacy Policy</Link>, and <Link href="/refund" className="text-white hover:underline transition-colors">Refund Policy</Link>.
            </label>
          </div>

          <Link href="/dashboard" className="btn-primary w-full py-4 text-lg shadow-[0_4px_20px_0_rgba(0,230,118,0.3)] mb-6 flex flex-col items-center">
            <span>Pay Rs.1999 via UPI / Card</span>
          </Link>
          
          <div className="flex justify-center flex-wrap gap-4 text-gray-500 font-semibold text-sm mb-6 pb-6 border-b border-white/10">
            <span>UPI</span> • <span>PhonePe</span> • <span>GPay</span> • <span>Cards</span>
          </div>
          
          <div className="text-center text-xs text-gray-500 flex flex-col items-center gap-2">
            <span className="flex items-center gap-1"><span className="text-gold-badge">🔒</span> Secured by Trusted Gateway</span>
            <span>Your financial details are never stored by us.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
