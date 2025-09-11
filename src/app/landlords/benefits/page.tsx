'use client';

import Link from 'next/link';

export default function LandlordBenefitsPage() {
  const benefits = [
    {
      title: "Guaranteed Professional Cosigners",
      description: "Every tenant comes with Credora as their professional cosigner, ensuring you have financial backing for the entire lease term.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stats: "99.8% rent collection rate"
    },
    {
      title: "Pre-Screened Quality Tenants",
      description: "All applicants undergo comprehensive employment verification, income validation, and rental history review.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      stats: "Average credit score: 720+"
    },
    {
      title: "Faster Vacancy Filling",
      description: "Our network of qualified renters means your properties get filled 60% faster than traditional rental methods.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      stats: "Average 14 days to lease"
    },
    {
      title: "No Upfront Costs",
      description: "List unlimited properties for free. Only pay our 5% success fee when you successfully rent to a Credora-backed tenant.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      stats: "Zero listing fees"
    },
    {
      title: "Professional Support Team",
      description: "Dedicated landlord success managers help you optimize listings, handle applications, and resolve any issues quickly.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
        </svg>
      ),
      stats: "24/7 support available"
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Track property performance, view application metrics, and get insights to optimize your rental strategy.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      stats: "Real-time insights"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Owner",
      location: "Austin, TX",
      quote: "Credora has completely transformed how I rent my properties. I used to wait months to find qualified tenants, now it takes just weeks with guaranteed cosigners.",
      rating: 5,
      properties: "12 properties"
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      location: "Los Angeles, CA",
      quote: "The peace of mind knowing every tenant has a professional cosigner is invaluable. My vacancy rates dropped by 70% since joining Credora.",
      rating: 5,
      properties: "8 properties"
    },
    {
      name: "Jennifer Martinez",
      role: "Landlord",
      location: "Miami, FL",
      quote: "Professional service, quality tenants, and guaranteed payments. What more could you ask for? Best decision I made for my rental business.",
      rating: 5,
      properties: "5 properties"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Why Landlords Choose <span className="text-slate-700">Credora</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            <span className="font-bold text-slate-800 text-2xl tracking-wide">Guaranteed Success.</span> Join thousands of landlords who have revolutionized their rental business with professional cosigners and pre-qualified tenants.
          </p>
          
          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="text-3xl font-bold text-slate-800 mb-2">15,000+</div>
              <div className="text-slate-600">Properties Listed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="text-3xl font-bold text-slate-800 mb-2">99.8%</div>
              <div className="text-slate-600">Rent Collection Rate</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="text-3xl font-bold text-slate-800 mb-2">14 Days</div>
              <div className="text-slate-600">Average Time to Lease</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="text-3xl font-bold text-slate-800 mb-2">$2.5M+</div>
              <div className="text-slate-600">Guaranteed by Cosigners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete Landlord Benefits</h2>
            <p className="text-xl text-slate-600">Everything you need to maximize your rental income and minimize risks</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                <div className="bg-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{benefit.description}</p>
                <div className="bg-slate-100 rounded-lg px-4 py-2 inline-block">
                  <span className="text-sm font-semibold text-slate-700">{benefit.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Credora vs Traditional Rentals</h2>
            <p className="text-xl text-slate-600">See why landlords are switching to guaranteed cosigner services</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800 bg-slate-100">Credora</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Traditional Rentals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-800">Professional Cosigner</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">✓ Guaranteed</td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">✗ Not Available</td>
                  </tr>
                  <tr className="bg-slate-25">
                    <td className="px-6 py-4 font-medium text-slate-800">Tenant Screening</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">✓ Professional</td>
                    <td className="px-6 py-4 text-center text-yellow-600 font-semibold">~ DIY Required</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-800">Average Days to Lease</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">14 Days</td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">45+ Days</td>
                  </tr>
                  <tr className="bg-slate-25">
                    <td className="px-6 py-4 font-medium text-slate-800">Rent Collection Rate</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">99.8%</td>
                    <td className="px-6 py-4 text-center text-yellow-600 font-semibold">85-90%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-800">Listing Fees</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Free</td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">$100-300+</td>
                  </tr>
                  <tr className="bg-slate-25">
                    <td className="px-6 py-4 font-medium text-slate-800">24/7 Support</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">✓ Included</td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">✗ Not Available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Landlords Say</h2>
            <p className="text-xl text-slate-600">Real success stories from property owners across the nation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                    <p className="text-slate-600 text-sm">{testimonial.role} • {testimonial.location}</p>
                    <p className="text-slate-500 text-sm">{testimonial.properties}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Rental Business?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of successful landlords who have reduced vacancy time, increased rent collection rates, and eliminated cosigner risks with Credora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/landlords/signup" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all">
              List Your Property Free
            </Link>
            <Link href="/landlords" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
