export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 mb-20">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4 text-sm text-gray-500">
        Effective Date: {new Date().toDateString()}
      </p>

      <p className="mb-6">
        Welcome to <strong>Groome</strong> (thegroome.com). By accessing or using
        our platform, you agree to comply with and be bound by the following
        Terms & Conditions. If you do not agree, please do not use our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. About Groome</h2>
      <p className="mb-4">
        Groome is a quick commerce platform that enables users to order groceries,
        daily essentials, and local products with fast doorstep delivery.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old to place orders on Groome. By using the
        platform, you represent that you meet this requirement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Orders & Payments</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>All orders are subject to availability.</li>
        <li>Orders are confirmed only after successful payment.</li>
        <li>
          Payments are processed securely through PhonePe or authorized payment
          partners.
        </li>
        <li>Prices include applicable taxes unless stated otherwise.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Delivery Policy
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Delivery times are estimates and may vary.</li>
        <li>
          Delays may occur due to traffic, weather, or operational constraints.
        </li>
        <li>
          Users are responsible for providing accurate delivery addresses.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Cancellation & Refunds
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Orders once packed or dispatched may not be cancelled.</li>
        <li>
          Eligible refunds will be processed to the original payment method via
          PhonePe.
        </li>
        <li>Refunds typically take 5–7 working days.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. User Responsibilities
      </h2>
      <p className="mb-4">
        Users must not misuse the platform, provide false information, attempt
        fraud, or abuse delivery personnel. Violations may result in suspension
        or termination of accounts.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Product Responsibility
      </h2>
      <p className="mb-4">
        Groome acts as a platform and delivery facilitator. Product quality,
        labeling, and compliance remain the responsibility of the respective
        sellers or vendors.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Account Termination
      </h2>
      <p className="mb-4">
        Groome reserves the right to suspend or terminate accounts that violate
        these terms or applicable laws.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        9. Governing Law
      </h2>
      <p className="mb-4">
        These Terms & Conditions are governed by the laws of India. All disputes
        shall be subject to the jurisdiction of Indian courts.
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
