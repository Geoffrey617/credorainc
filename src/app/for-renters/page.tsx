import type { Metadata } from "next";
import { createMetadata, createBreadcrumbSchema } from '@/lib/seo-config';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = createMetadata({
  title: "For Renters",
  description: "Credora Inc helps renters get approved for apartments with professional cosigner services. Get the apartment you want with guaranteed approval and expert rental assistance.",
  path: "/for-renters",
  keywords: [
    "renter services",
    "apartment approval help",
    "rental assistance",
    "cosigner help",
    "lease guarantee",
    "rental approval service",
    "apartment application help",
    "tenant services"
  ]
});

export default function ForRentersPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "For Renters", path: "/for-renters" }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need as a Renter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From finding the perfect apartment to getting approved with our lease guarantor service - we've got you covered every step of the way.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services for Renters</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Apartment Search */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg"
                  alt="Modern apartment search"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Find Your Perfect Apartment</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Search through thousands of apartments across all 50 states. Filter by location, price, amenities, and more to find exactly what you're looking for.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All 50 states covered
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced filtering options
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Updated daily
                  </div>
                </div>
                <Link href="/apartments" className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-block">
                  Search Apartments
                </Link>
              </div>
            </div>

            {/* Cosigning Service */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                  alt="Lease guarantor service"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-green-600/20"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lease Guarantor Service</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get approved for apartments with our professional cosigners. Perfect for those with limited credit and rental history.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    24-48 hour approval
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    94.2% success rate
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Transparent pricing
                  </div>
                </div>
                <Link href="/auth/signin" className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-block">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Helpful Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparent Pricing</h3>
              <p className="text-gray-600 mb-6">
                Simple, upfront pricing with no hidden fees. Know exactly what you'll pay before you apply.
              </p>
              <Link href="/pricing" className="text-slate-600 font-semibold hover:text-slate-700 transition-colors">
                View Pricing →
              </Link>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-600 mb-6">
                Get instant answers to common questions about our lease guarantor service and rental process.
              </p>
              <Link href="/faq" className="text-slate-600 font-semibold hover:text-slate-700 transition-colors">
                View FAQ →
              </Link>
            </div>

            {/* Blog */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rental Blog & Tips</h3>
              <p className="text-gray-600 mb-6">
                Stay informed with the latest rental market trends, apartment hunting tips, and industry insights.
              </p>
              <Link href="/blog" className="text-slate-600 font-semibold hover:text-slate-700 transition-colors">
                Read Blog →
              </Link>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Apartment?</h2>
          <p className="text-xl text-slate-200">
            Join over 10,000 renters who have successfully secured apartments with our help.
          </p>
        </section>
      </div>
    </div>
    </>
  );
} 