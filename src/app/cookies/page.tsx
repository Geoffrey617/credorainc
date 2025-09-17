import type { Metadata } from "next";
import { generatePageSEO, generateMetaTags } from '../../lib/seo-config';
import Link from 'next/link';

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "Credora Inc cookie policy. Information about how we use cookies on our website to improve your experience with our cosigner services. Cookie preferences and settings.",
  path: "/cookies",
  keywords: [
    "cookie policy",
    "website cookies",
    "privacy",
    "cookie preferences",
    "tracking cookies",
    "analytics cookies",
    "cookie consent",
    "web tracking"
  ]
});

export default function CookiePolicyPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Cookie Policy", path: "/cookies" }
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
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600">
              Learn about how we use cookies and similar technologies to improve your experience.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            
            <p className="text-gray-700 mb-6">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and improving our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for our website to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>User authentication and login sessions</li>
              <li>Security features and fraud prevention</li>
              <li>Form submission and data processing</li>
              <li>Load balancing and website performance</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-slate-800 text-sm">
                <strong>Note:</strong> Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
            <p className="text-gray-700 mb-4">
              We use analytics cookies to understand how visitors interact with our website. These help us:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Track page views and user journeys</li>
              <li>Identify popular content and features</li>
              <li>Measure website performance and loading times</li>
              <li>Understand user demographics and interests</li>
            </ul>
            <p className="text-gray-700 mb-6">
              We use Google Analytics and similar services for this purpose. These cookies are anonymized and do not contain personally identifiable information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Functional Cookies</h3>
            <p className="text-gray-700 mb-4">
              Functional cookies enhance your experience by remembering your choices and preferences:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Language and region preferences</li>
              <li>Font size and accessibility settings</li>
              <li>Previous search queries and filters</li>
              <li>Items in your application or favorites</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Cookies</h3>
            <p className="text-gray-700 mb-4">
              With your consent, we use marketing cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Show you relevant advertisements</li>
              <li>Track the effectiveness of our marketing campaigns</li>
              <li>Personalize content based on your interests</li>
              <li>Prevent you from seeing the same ads repeatedly</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Third-Party Cookies</h2>
            
            <p className="text-gray-700 mb-4">
              We work with trusted third-party services that may set their own cookies:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Google Analytics</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Website analytics and performance tracking</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">View Policy</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stripe</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Payment processing and fraud prevention</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">View Policy</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DocuSign</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Digital document signing and verification</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <a href="https://www.docusign.com/company/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">View Policy</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Intercom</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Customer support and live chat</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <a href="https://www.intercom.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">View Policy</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
            </p>
            
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> Disabling all cookies may affect website functionality and your user experience.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Consent</h3>
            <p className="text-gray-700 mb-6">
              When you first visit our website, you'll see a cookie banner asking for your consent. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Accept all cookies for the full website experience</li>
              <li>Choose which types of cookies to allow</li>
              <li>Reject non-essential cookies</li>
              <li>Change your preferences at any time through the cookie settings</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cookie Retention</h2>
            
            <p className="text-gray-700 mb-4">
              Different cookies have different lifespans:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 1-2 years)</li>
              <li><strong>Authentication Cookies:</strong> Expire after 30 days of inactivity</li>
              <li><strong>Analytics Cookies:</strong> Typically expire after 2 years</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Changes to This Policy</h2>
            
            <p className="text-gray-700 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any significant changes by updating the "Last updated" date at the top of this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contact Us</h2>
            
            <p className="text-gray-700 mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@credora.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> 1-800-CREDORA (1-800-273-3672)</p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                This Cookie Policy is effective as of January 15, 2025 and applies to all visitors and users of our website.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Policy</h3>
            <p className="text-gray-600 mb-4">
              Learn about how we collect, use, and protect your personal information.
            </p>
            <Link href="/privacy" className="text-slate-600 font-medium hover:text-slate-700 transition-colors">
              Read Privacy Policy →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Settings</h3>
            <p className="text-gray-600 mb-4">
              Manage your cookie preferences and control what data we collect.
            </p>
            <button className="text-slate-600 font-medium hover:text-slate-700 transition-colors">
              Manage Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 