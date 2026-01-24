export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 mb-20">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-sm text-gray-500">
        Effective Date: {new Date().toDateString()}
      </p>

      <p className="mb-6">
        Groome ("we", "our", "us") values your privacy. This Privacy Policy
        explains how we collect, use, store, and protect your personal
        information when you use our website or services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Name, phone number, and email address</li>
        <li>Delivery address and order details</li>
        <li>Payment transaction references (no UPI PIN or card details)</li>
        <li>Device and usage data such as IP address and browser type</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>To process orders and deliveries</li>
        <li>To facilitate payments via PhonePe</li>
        <li>To provide customer support</li>
        <li>To prevent fraud and misuse</li>
        <li>To improve our services and platform</li>
      </ul>

      <p className="mb-4">
        We do <strong>not</strong> sell or rent your personal data to third
        parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Payments & Security
      </h2>
      <p className="mb-4">
        All payments are processed securely through PhonePe or authorized payment
        gateways. Groome does not store your card details, UPI PIN, or banking
        credentials.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Data Sharing
      </h2>
      <p className="mb-4">
        We may share necessary information with delivery partners, payment
        providers, or legal authorities when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Data Protection
      </h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures including
        encryption and access controls to protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Cookies
      </h2>
      <p className="mb-4">
        Groome uses cookies to improve user experience, maintain sessions, and
        analyze usage. You can disable cookies through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Your Rights
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Access or update your personal information</li>
        <li>Request deletion of your data</li>
        <li>Opt out of non-essential communications</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Policy Updates
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        reflected on this page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact Us</h2>

<p className="mb-2">
  📧 Email:{" "}
  <a
    href="mailto:support@thegroome.com"
    className="text-blue-600 underline"
  >
    support@thegroome.com
  </a>
</p>

<p>
  📞 Phone:{" "}
  <a
    href="tel:+919876543210"
    className="text-blue-600 underline"
  >
    +91 63528 82241
  </a>
</p>
    </div>
  );
}
