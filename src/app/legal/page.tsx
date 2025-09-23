import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal | Bredora Inc',
  description: 'Legal information, policies, and regulatory compliance for Bredora Inc apartment finder and lease cosigning services.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Legal Information
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Important legal information, policies, and regulatory compliance for Bredora Inc services
          </p>
        </div>

        {/* Legal Documents Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Privacy Policy */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Privacy Policy</h2>
            </div>
            <p className="text-slate-600 mb-4">
              How we collect, use, and protect your personal information and data privacy rights.
            </p>
            <Link 
              href="/privacy" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Read Privacy Policy
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Terms of Service */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Terms of Service</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Legal terms and conditions governing the use of our apartment finder and cosigning services.
            </p>
            <Link 
              href="/terms" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              Read Terms of Service
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Cookie Policy */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Cookie Policy</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Information about how we use cookies and similar technologies on our website.
            </p>
            <Link 
              href="/cookies" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              Read Cookie Policy
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Contact Legal */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Legal Contact</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Contact our legal team for questions about compliance, licensing, or legal matters.
            </p>
            <a 
              href="mailto:legal@bredora.com" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              legal@bredora.com
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Legal Information</h2>
          
          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Company Information</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 mb-2"><strong>Legal Name:</strong> Bredora Inc</p>
                <p className="text-slate-700 mb-2"><strong>Incorporation:</strong> State of Delaware</p>
                <p className="text-slate-700 mb-2"><strong>Business Address:</strong> San Francisco, California</p>
                <p className="text-slate-700 mb-2"><strong>Legal Email:</strong> legal@bredora.com</p>
                <p className="text-slate-700"><strong>Operating License:</strong> Licensed in all 50 states</p>
              </div>
            </div>

            {/* Service Disclaimers */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Service Disclaimers</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Lease Approval:</strong> Subject to landlord acceptance and meeting all application requirements</li>
                  <li>• <strong>Cosigner Service:</strong> Bredora Inc acts as a cosigner service and does not guarantee apartment availability</li>
                  <li>• <strong>Fee Policy:</strong> Fees are non-refundable except as outlined in our Terms of Service</li>
                  <li>• <strong>Employment Verification:</strong> All services subject to employment and income verification</li>
                </ul>
              </div>
            </div>

            {/* Regulatory Compliance */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Regulatory Compliance</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Fair Housing Act:</strong> We comply with federal fair housing laws</li>
                  <li>• <strong>State Licensing:</strong> Licensed to operate apartment finder and cosigning services in all 50 states</li>
                  <li>• <strong>Data Protection:</strong> CCPA and GDPR compliant data handling practices</li>
                  <li>• <strong>Financial Services:</strong> Regulated financial service provider for cosigning services</li>
                </ul>
              </div>
            </div>

            {/* California Residents */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">California Residents</h3>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-slate-700 mb-2">
                  <strong>Your Rights:</strong> You have the right to request information about our business practices.
                </p>
                <p className="text-slate-700">
                  For questions regarding our services, licensing, or to file a complaint, contact us at 
                  <a href="mailto:legal@bredora.com" className="text-blue-600 hover:text-blue-700 ml-1">legal@bredora.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Quick Legal Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/privacy" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Policy
            </Link>
            <Link href="/terms" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms of Service
            </Link>
            <Link href="/cookies" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
              </svg>
              Cookie Policy
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-slate-300">
              For legal questions or concerns, contact our legal team at 
              <a href="mailto:legal@bredora.com" className="text-white hover:text-slate-200 ml-1">legal@bredora.com</a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
