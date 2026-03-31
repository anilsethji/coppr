export const metadata = { title: 'Admin Console | Coppr' };

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-navy-card p-6 rounded-card border border-white/10 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Coppr Executive Admin</h1>
            <p className="text-sm text-gray-400">Founder Dashboard — Welcome, Anil</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-green-electric text-black font-bold rounded-badge text-sm transition-opacity hover:opacity-90">Post Live Update</button>
            <button className="px-4 py-2 bg-white/10 text-white font-bold rounded-badge text-sm transition-colors hover:bg-white/20">Export CSV</button>
          </div>
        </header>

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{t: "Active Subscribers", v: "842", c: "+12 this week"}, {t: "Monthly Revenue", v: "Rs. 16.8L", c: "Stable"}, {t: "Pending Renewals", v: "145", c: "Requires attention"}, {t: "Failed Payments", v: "12", c: "Win-back active"}].map((stat, i) => (
            <div key={i} className="card p-6 shadow-lg">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">{stat.t}</p>
              <p className="text-3xl font-black text-white mb-1">{stat.v}</p>
              <p className="text-xs text-green-electric font-semibold">{stat.c}</p>
            </div>
          ))}
        </div>

        {/* MAIN PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SUBSCRIBERS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 h-[400px] overflow-y-auto w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recent Subscribers</h2>
                <input type="text" placeholder="Search user..." className="bg-[#0A0F1E] border border-white/10 rounded-badge px-3 py-1.5 text-sm outline-none focus:border-green-electric transition-colors" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500">
                      <th className="pb-3 font-semibold w-1/4">Name</th>
                      <th className="pb-3 font-semibold w-1/4">WhatsApp</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[1,2,3,4,5].map(i => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-3">Trader {i}</td>
                        <td className="py-3">+91 98765 0000{i}</td>
                        <td className="py-3"><span className="px-2 py-0.5 bg-green-electric/20 text-green-electric text-[10px] uppercase font-bold rounded border border-green-electric/20">Active</span></td>
                        <td className="py-3 text-right">
                          <button className="text-xs font-semibold text-gold-badge hover:underline mr-4">Message</button>
                          <button className="text-xs font-semibold text-red-500 hover:underline">Expire</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CONTENT MANAGER */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Content Manager</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="p-4 border border-dashed border-white/20 rounded-card text-gray-400 hover:text-white hover:border-white transition-colors text-sm font-semibold h-24 flex flex-col items-center justify-center gap-2 group">
                  <span className="text-xl group-hover:scale-125 transition-transform">+</span> Upload New EA Bot
                </button>
                <button className="p-4 border border-dashed border-white/20 rounded-card text-gray-400 hover:text-white hover:border-white transition-colors text-sm font-semibold h-24 flex flex-col items-center justify-center gap-2 group">
                  <span className="text-xl group-hover:scale-125 transition-transform">+</span> Upload Video Tutorial
                </button>
              </div>
            </div>
          </div>

          {/* SIDE PANELS */}
          <div className="space-y-8">
            
            {/* NOTIFICATIONS & PAYMENTS QUICK ACTIONS */}
            <div className="card p-6 text-sm">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-badge bg-[#0A0F1E] border border-white/5 hover:border-green-electric transition-colors group">
                  <strong className="text-white block group-hover:text-green-electric transition-colors">Send Push Notification</strong>
                  <span className="text-gray-500 text-xs">Broadcast to all active members</span>
                </button>
                <button className="w-full text-left p-3 rounded-badge bg-[#0A0F1E] border border-white/5 hover:border-gold-badge transition-colors group">
                  <strong className="text-white block group-hover:text-gold-badge transition-colors">Process Refunds</strong>
                  <span className="text-gray-500 text-xs">2 pending requests</span>
                </button>
                <button className="w-full text-left p-3 rounded-badge bg-[#0A0F1E] border border-white/5 hover:border-white/50 transition-colors group">
                  <strong className="text-white block">API & Gateway Settings</strong>
                  <span className="text-gray-500 text-xs">Webhook, AiSensy, Price config</span>
                </button>
              </div>
            </div>

            {/* FAILED PAYMENTS */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                Failed Renewals<span className="px-2 py-0.5 bg-red-500/20 text-[10px] uppercase rounded-badge border border-red-500/20">Win-back</span>
              </h2>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <div>
                      <p className="text-white font-medium">User {i}</p>
                      <p className="text-xs text-gray-500">Day {i*2} Warning Sent</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/5 font-semibold rounded-badge text-xs hover:bg-white/10 transition-colors">Remind</button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
