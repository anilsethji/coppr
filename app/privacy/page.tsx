export const metadata = { title: 'Privacy Policy | Coppr' };

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Compliant with India&apos;s Digital Personal Data Protection Act 2023.</p>
      <div className="space-y-6 text-gray-300">
        <p><strong>1. Data collected</strong> — name, email, WhatsApp, payment via gateway (not stored by us), usage data.</p>
        <p><strong>2. How used</strong> — account management, reminders via WhatsApp and email, content notifications, support.</p>
        <p><strong>3. Never sell data</strong>, never share with advertisers.</p>
        <p><strong>4. Stored on servers in India</strong>, retained subscription period plus 12 months.</p>
        <p><strong>5. User rights</strong> — access, correct, erase, withdraw consent.</p>
        <p><strong>6. Cookies</strong> — essential only, no tracking cookies.</p>
        <p><strong>7. WhatsApp consent</strong> — user consents on registration, opt out by replying STOP.</p>
        <p><strong>8. Grievance officer</strong> — Anil Seth, anil@coppr.com</p>
        <p className="text-sm text-gray-500 mt-8">Last updated: Oct 2026.</p>
      </div>
    </div>
  );
}
