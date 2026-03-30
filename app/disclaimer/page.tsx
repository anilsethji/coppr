export const metadata = { title: 'General Disclaimer | Coppr' };

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">General Disclaimer</h1>
      <div className="space-y-6 text-gray-300">
        <p><strong>1. Trading risk</strong> — high risk, not suitable for all, high leverage works both ways.</p>
        <p><strong>2. Educational only</strong> — nothing constitutes financial advice.</p>
        <p><strong>3. No SEBI registration</strong> — Coppr and Anil Seth are NOT registered with SEBI.</p>
        <p><strong>4. Past performance</strong> — not indicative of future results.</p>
        <p><strong>5. Third party brokers</strong> — no endorsement, users choose their own regulated broker.</p>
        <p><strong>6. Responsibility</strong> — users solely responsible for all trading decisions, Coppr accepts no liability.</p>
        <p><strong>7. Regulatory</strong> — users responsible for compliance with their local laws.</p>
        <p><strong>Contact</strong>: anil@coppr.com</p>
        <p className="text-sm text-gray-500 mt-8">Last updated: Oct 2026.</p>
      </div>
    </div>
  );
}
