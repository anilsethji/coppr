export const metadata = { title: 'Terms and Conditions | Coppr' };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="space-y-6 text-gray-300">
        <p><strong>1. About the service</strong> — digital subscription to EA bots, indicators, and educational videos for MT5.</p>
        <p><strong>2. Subscription</strong> — monthly Rs.[PRICE], auto-renews, access tied to active subscription.</p>
        <p><strong>3. No financial advice</strong> — educational only, past performance not indicative of future results, user responsible for all decisions.</p>
        <p><strong>4. Refund and cancellation</strong> — 7-day refund on first payment only, cancel anytime from dashboard.</p>
        <p><strong>5. Intellectual property</strong> — all content owned by Coppr, redistribution or resale prohibited.</p>
        <p><strong>6. Limitation of liability</strong> — not liable for trading losses.</p>
        <p><strong>7. Grievance officer</strong> — Anil Seth, anil@coppr.com, +91 9876543210, 48-hour response.</p>
        <p><strong>8. Governing law</strong> — India, jurisdiction New Delhi.</p>
        <p className="text-sm text-gray-500 mt-8">Last updated: Oct 2026.</p>
      </div>
    </div>
  );
}
