export default function SupportPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20 px-4 pt-10">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-4">Command Support</h1>
        <p className="text-gray-500">Our team is standby to assist with any terminal issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="stat-card border-[#00B0FF]/20 bg-[#00B0FF]/5 text-center p-10 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📱</div>
            <h3 className="text-xl font-bold text-white mb-2">WhatsApp Direct</h3>
            <p className="text-sm text-gray-400 mb-6">Fastest response for setup help and technical issues.</p>
            <a href="https://wa.me/919876543210" className="inline-block px-8 py-3 bg-[#00B0FF] text-[#0A0F1E] font-black uppercase tracking-widest rounded-[6px] text-xs">Open Chat</a>
         </div>

         <div className="stat-card border-[#9C6EFA]/20 bg-[#9C6EFA]/5 text-center p-10 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📧</div>
            <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-400 mb-6">For billing queries and account documentation.</p>
            <a href="mailto:anil@coppr.com" className="inline-block px-8 py-3 bg-[#9C6EFA] text-[#0A0F1E] font-black uppercase tracking-widest rounded-[6px] text-xs">Send Ticket</a>
         </div>
      </div>

      <div className="mt-12 p-8 bg-white/[0.02] border border-white/5 rounded-[20px] text-center">
         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Service Hours</p>
         <p className="text-sm text-white font-bold">Mon–Sat: 10:00 AM — 07:00 PM IST</p>
         <p className="text-xs text-gray-500 mt-2">Closed on Sundays and National Holidays.</p>
      </div>
    </div>
  );
}
