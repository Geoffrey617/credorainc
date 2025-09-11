import type { Metadata } from "next";
import { createMetadata, createBreadcrumbSchema } from '@/lib/seo-config';
import Link from 'next/link';

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Credora Inc privacy policy. Learn how we protect your personal information and data when using our apartment cosigner services. GDPR and CCPA compliant.",
  path: "/privacy",
  keywords: [
    "privacy policy",
    "data protection", 
    "personal information",
    "GDPR compliance",
    "data privacy",
    "information security",
    "privacy rights",
    "data collection"
  ]
});

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Privacy Policy", path: "/privacy" }
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gray-50 pt-20">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              When you use our cosigning services, we collect personal information including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Full name, address, and contact information</li>
              <li>Social Security number and date of birth</li>
              <li>Employment and income information</li>
              <li>Credit history and financial information</li>
              <li>Rental history and references</li>
              <li>Government-issued identification documents</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-700 mb-6">
              We automatically collect information about how you use our website and services, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h2>
            
            <p className="text-gray-700 mb-4">
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Cosigning Services:</strong> To evaluate your application and provide cosigning services</li>
              <li><strong>Credit Checks:</strong> To perform background and credit checks as part of our approval process</li>
              <li><strong>Communication:</strong> To contact you about your application and provide customer support</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Service Improvement:</strong> To analyze and improve our services and website functionality</li>
              <li><strong>Marketing:</strong> To send you relevant information about our services (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Information Sharing and Disclosure</h2>
            
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">With Your Consent</h3>
            <p className="text-gray-700 mb-4">
              We share information with landlords and property managers when you apply for an apartment with our cosigning service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We work with third-party service providers who help us operate our business, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Credit reporting agencies</li>
              <li>Background check companies</li>
              <li>Payment processors</li>
              <li>Document verification services</li>
              <li>Customer support platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
            <p className="text-gray-700 mb-6">
              We may disclose your information when required by law, legal process, or to protect our rights and the safety of others.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Data Security</h2>
            
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>SSL encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee training on data protection</li>
              <li>Multi-factor authentication for sensitive operations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Access and Correction</h3>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or correct your personal information. Contact us at privacy@credora.com to exercise these rights.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Communications</h3>
            <p className="text-gray-700 mb-4">
              You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Deletion</h3>
            <p className="text-gray-700 mb-6">
              You may request deletion of your personal information, subject to legal and business requirements. Some information may be retained for legal compliance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Cookies and Tracking</h2>
            
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Remember your preferences and login information</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve our website functionality</li>
            </ul>
            <p className="text-gray-700 mb-6">
              You can control cookies through your browser settings. For more details, see our <Link href="/cookies" className="text-slate-600 hover:text-slate-700">Cookie Policy</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Third-Party Links</h2>
            
            <p className="text-gray-700 mb-6">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Children's Privacy</h2>
            
            <p className="text-gray-700 mb-6">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Changes to This Policy</h2>
            
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Contact Information</h2>
            
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@credora.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> 1-800-CREDORA (1-800-273-3672)</p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                This Privacy Policy is effective as of January 15, 2025. Previous versions are available upon request.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Policy</h3>
            <p className="text-gray-600 mb-4">
              Learn about how we use cookies and similar technologies on our website.
            </p>
            <Link href="/cookies" className="text-slate-600 font-medium hover:text-slate-700 transition-colors">
              Read Cookie Policy →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms of Service</h3>
            <p className="text-gray-600 mb-4">
              Review the terms and conditions for using our cosigning services.
            </p>
            <Link href="/terms" className="text-slate-600 font-medium hover:text-slate-700 transition-colors">
              Read Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 