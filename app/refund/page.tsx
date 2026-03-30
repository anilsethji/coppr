export const metadata = { title: 'Refund and Cancellation Policy | Coppr' };

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
      <div className="space-y-6 text-gray-300">
        <p><strong>Cancellation</strong> — anytime from My Account, no fees, access until end of billing period.</p>
        <p><strong>Refund</strong> — 7-day refund on first payment only, email anil@coppr.com with &quot;Refund Request&quot;, processed 5–7 business days, no refunds after 7 days or on renewals.</p>
        <p><strong>Failed payments</strong> — 5-day grace period, reminders on day 1, 3, 5.</p>
        <p><strong>Contact</strong>: anil@coppr.com, +91 9876543210, 24–48 hour response.</p>
        <p className="text-sm text-gray-500 mt-8">Last updated: Oct 2026.</p>
      </div>
    </div>
  );
}
