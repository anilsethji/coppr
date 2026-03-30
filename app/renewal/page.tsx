import Link from 'next/link';

export const metadata = { title: 'Subscription Expired | Coppr' };

export default function RenewalPage() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="card p-8 max-w-md text-center border-red-500/30">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">!</div>
        <h1 className="text-2xl font-bold text-white mb-4">Subscription Expired</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Your access to the Coppr Algo Trading Kit has ended. To instantly regain access to all EA bots, live updates, and direct founder support, please renew your monthly subscription.
        </p>
        <Link href="/checkout" className="btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] mb-5 py-4">
          Renew Now — Rs.1999/mo
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">
          Go to My Account Settings
        </Link>
      </div>
    </div>
  );
}
