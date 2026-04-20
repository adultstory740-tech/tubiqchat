"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link href="/" className="text-pink-400 text-sm hover:underline">
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-6 mb-6">
          Terms & Conditions
        </h1>

        <p className="text-pink-200/80 mb-8">
          Welcome to Tubiq Chat. By accessing or using this platform, you agree to comply with and be bound by the following terms.
        </p>

        <div className="space-y-6 text-pink-100/90 text-sm sm:text-base leading-relaxed">

          {/* 1 */}
          <div>
            <h2 className="font-semibold text-white mb-1">1. Service Overview</h2>
            <p>
              Tubiq Chat provides virtual conversation services intended for entertainment purposes only.
              All profiles are virtual chat assistants and all interactions are automated.
              No real human interaction is involved.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-semibold text-white mb-1">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to access or use this platform.
              By using the service, you confirm that you meet this requirement.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-semibold text-white mb-1">3. Acceptable Use</h2>
            <p>
              You agree not to misuse the platform, attempt unauthorized access,
              exploit the system, or engage in any unlawful or harmful activity.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-semibold text-white mb-1">4. Coins & Access</h2>
            <p>
              Coins are digital units used to access conversations and features on the platform.
              Once coins are successfully credited and utilized, the transaction is considered complete.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-semibold text-white mb-1">5. No Real-World Interaction</h2>
            <p>
              This platform does not facilitate dating, personal relationships, or offline meetings.
              Any such expectations are strictly outside the scope of this service.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-semibold text-white mb-1">6. Service Modifications</h2>
            <p>
              We may update, modify, or discontinue features at any time to improve functionality,
              performance, or user experience without prior notice.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-semibold text-white mb-1">7. Limitation of Liability</h2>
            <p>
              The platform is provided on an "as is" basis. We are not responsible for
              user expectations, interpretations, or outcomes resulting from use of the service.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-semibold text-white mb-1">8. Contact</h2>
            <p>
              For any questions or support, you can contact us at:
              <br />
              <span className="text-pink-300">tubiqlabs@gmail.com</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}