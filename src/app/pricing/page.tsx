import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Pricing - Bredora Inc | Transparent Lease Cosigner Service Rates",
  description: "Simple, transparent pricing for Bredora Inc lease cosigner service. Student rates from 75% of rent, standard rates from first month's rent. No hidden fees.",
  keywords: [
    "lease cosigner pricing",
    "apartment cosigner cost", 
    "rental guarantee pricing",
    "student cosigner discount",
    "lease cosigner rates",
    "apartment approval cost",
    "cosigning service fees",
    "rental cosigner pricing"
  ],
  openGraph: {
    title: "Pricing - Bredora Inc | Transparent Lease Cosigner Service Rates",
    description: "Simple, transparent pricing for lease cosigner service. Student rates from 75% of rent, standard rates from first month's rent.",
    url: "https://bredora.com/pricing",
    siteName: "Bredora Inc",
    images: [
      {
        url: "https://bredora.com/og-pricing.jpg",
        width: 1200,
        height: 630,
        alt: "Bredora Inc - Transparent Pricing for Lease Cosigner Services"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Bredora Inc | Transparent Lease Cosigner Service Rates",
    description: "Simple, transparent pricing for lease cosigner service. Student rates from 75% of rent.",
    images: ["https://bredora.com/og-pricing.jpg"]
  },
  alternates: {
    canonical: "https://bredora.com/pricing"
  }
};

export default function PricingPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bredora.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pricing",
        "item": "https://bredora.com/pricing"
      }
    ]
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, upfront pricing for our lease cosigner service. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Pricing Cards */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Student Pricing */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-700 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-slate-700 text-white px-4 py-1 rounded-full text-sm font-semibold">Student Special</span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Rate</h3>
                <p className="text-gray-600 mb-6">Special pricing for students</p>
                <div className="text-4xl font-bold text-slate-700 mb-2">75%</div>
                <p className="text-gray-500">of first month's rent</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Eligibility Requirements:</h4>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Must be a domestic or international student
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valid student ID from accredited institution
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Government-issued photo ID required
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Income verification (Financial aid letter, scholarship award letter, Pay stub, W-2, or bank statements)
                </div>
              </div>
              
              <Link href="/auth/signin" className="w-full bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-center block">
                Apply as Student
              </Link>
            </div>

            {/* General Pricing */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard Rate</h3>
                <p className="text-gray-600 mb-6">For employed, self-employed, and retirees</p>
                <div className="text-4xl font-bold text-slate-700 mb-2">85%</div>
                <p className="text-gray-500">of first month's rent</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Eligibility Requirements:</h4>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Must be employed, self-employed, retired or unemployed receiving disability benefit
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-slate-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Government-issued photo ID required
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Proof of income (Pay stub, W-2, Tax return or benefit award letter)
                </div>
              </div>
              
              <Link href="/auth/signin" className="w-full bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-center block">
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Pricing Examples */}
          <div className="mt-12 bg-slate-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">How Much Will You Pay?</h3>
            <p className="text-center text-gray-600 mb-8">One-time payment based on your monthly rent - See exactly what our service costs</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-700 mb-4">Monthly Rent: $1,500</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Student Rate (75%):</span>
                      <span className="font-bold text-blue-600 text-lg">$1,125</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Standard Rate (85%):</span>
                      <span className="font-bold text-slate-600 text-lg">$1,275</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-700 mb-4">Monthly Rent: $2,500</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Student Rate (75%):</span>
                      <span className="font-bold text-blue-600 text-lg">$1,875</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Standard Rate (85%):</span>
                      <span className="font-bold text-slate-600 text-lg">$2,125</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-700 mb-4">Monthly Rent: $3,500</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Student Rate (75%):</span>
                      <span className="font-bold text-blue-600 text-lg">$2,625</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Standard Rate (85%):</span>
                      <span className="font-bold text-slate-600 text-lg">$2,975</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-blue-50 rounded-lg p-4 inline-block">
                <p className="text-sm text-blue-800 font-medium">
                  💡 <strong>How it works:</strong> You pay a one-time fee equal to a percentage of your first month's rent
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pricing FAQ</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">When do I pay the fee?</h3>
              <p className="text-gray-600">
                You only pay after your application is approved and you're ready to sign your lease. No upfront costs.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Are there any hidden fees?</h3>
              <p className="text-gray-600">
                No hidden fees ever. The price you see is exactly what you pay - one simple, transparent fee.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if my application is rejected?</h3>
              <p className="text-gray-600">
                If your application is rejected, you don't pay anything. We only charge when you successfully secure your apartment.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I qualify for student pricing?</h3>
              <p className="text-gray-600">
                You'll need to provide a valid student ID or enrollment verification to qualify for our special 75% student rate.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Approved?</h2>
          <p className="text-xl text-slate-200 mb-8">
            Join thousands of renters who have secured their dream apartments with our lease cosigner service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" className="bg-white text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </Link>
            <Link href="/faq" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-700 transition-colors">
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
