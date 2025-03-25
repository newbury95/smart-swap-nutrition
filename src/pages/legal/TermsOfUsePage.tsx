
import React from "react";

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
          <p className="text-gray-700 mb-6">Last Updated: June 1, 2025</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using NutriTrackPro, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
              <p className="text-gray-700">
                Permission is granted to temporarily download one copy of the materials on NutriTrackPro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-gray-700">
                Some features of our service require you to register for an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p className="text-gray-700">
                You retain all rights to any content you submit, post, or display on or through our services. By submitting, posting, or displaying content on or through our services, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-gray-700">
                NutriTrackPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions or concerns about our Terms of Use, please contact us at <a href="mailto:support@nutritrackpro.com" className="text-green-600 hover:underline">support@nutritrackpro.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
