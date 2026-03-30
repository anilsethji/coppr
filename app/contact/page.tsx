export const metadata = { title: 'Contact Us | Coppr' };

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
      
      {/* Contact Details */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
          <p className="text-gray-400">We aim to respond to all inquiries within 24 working hours.</p>
        </div>
        
        <div className="card p-6 border-white/10">
          <h3 className="font-bold text-white mb-4">Business Contact</h3>
          <div className="text-sm text-gray-400 space-y-4">
            <p className="flex flex-col"><strong>Business details:</strong> <span className="text-gray-300">Coppr (owned by Anil Seth)</span></p>
            <p className="flex flex-col"><strong>Full Address:</strong> <span className="text-gray-300 leading-relaxed">Connaught Place, New Delhi 110001, India</span></p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <p className="flex flex-col"><strong>Email:</strong> <span className="text-white mt-1">anil@coppr.com</span></p>
              <p className="flex flex-col"><strong>WhatsApp:</strong> <span className="text-white mt-1">+91 9876543210</span></p>
            </div>
            <p className="flex flex-col pt-2 border-t border-white/5"><strong>Support Hours:</strong> <span className="text-green-electric mt-1 font-semibold">Mon–Sat 10AM–7PM IST</span></p>
          </div>
        </div>

        <div className="card p-6 border-gold-badge/50 bg-[#F5A623]/5">
          <h3 className="font-bold text-gold-badge mb-2">Grievance Officer</h3>
          <p className="text-xs text-gray-400 mb-6">Nominated under Indian RBI and DPDP regulations.</p>
          <div className="text-sm text-gray-300 space-y-3">
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Name:</strong> <span className="font-semibold text-white">Anil Seth</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>Email:</strong> <span>anil@coppr.com</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><strong>WhatsApp:</strong> <span>+91 9876543210</span></p>
            <p className="flex justify-between pt-1"><strong>Response Time:</strong> <span className="text-green-electric font-semibold">within 48 hrs</span></p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="card p-8 border-white/10 bg-[#0A0F1E] shadow-2xl">
          <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" className="w-full bg-navy-card border border-white/10 rounded-card px-4 py-3 text-white focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none transition-colors" placeholder="Enter your name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                <input type="tel" className="w-full bg-navy-card border border-white/10 rounded-card px-4 py-3 text-white focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none transition-colors" placeholder="+91" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input type="email" className="w-full bg-navy-card border border-white/10 rounded-card px-4 py-3 text-white focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none transition-colors" placeholder="you@domain.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <select className="w-full bg-navy-card border border-white/10 rounded-card px-4 py-3 text-white focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none transition-colors appearance-none">
                <option>Subscription Query</option>
                <option>Technical Support</option>
                <option>Refund Request</option>
                <option>Bot Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea rows={5} className="w-full bg-navy-card border border-white/10 rounded-card px-4 py-3 text-white focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] pt-4 pb-4 mt-2">
              Submit Request
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Required fields are monitored continuously.</p>
          </form>
        </div>
      </div>

    </div>
  );
}
