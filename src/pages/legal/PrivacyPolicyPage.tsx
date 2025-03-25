
import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-700 mb-6">Last Updated: June 1, 2025</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                At NutriTrackPro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information that you provide directly to us, such as when you create an account, update your profile, use our services, participate in surveys, or communicate with us.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, promotions, and events.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Sharing Your Information</h2>
              <p className="text-gray-700">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described in this Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Choices</h2>
              <p className="text-gray-700">
                You can access, update, or delete your account information at any time by logging into your account settings. You can also opt out of receiving promotional emails by following the instructions in those emails.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:support@nutritrackpro.com" className="text-green-600 hover:underline">support@nutritrackpro.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
