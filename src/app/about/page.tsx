'use client';

import Link from 'next/link';

export default function AboutPage() {


  const milestones = [
    {
      year: "Phase 1", 
      title: "First 1,000 Cosigns",
      description: "Reached our first major milestone, helping 1,000 renters secure apartments with professional cosigners."
    },
    {
      year: "Phase 2",
      title: "Nationwide Expansion",
      description: "Expanded operations to all 50 states, partnering with landlords and property managers nationwide."
    },
    {
      year: "Phase 3",
      title: "10,000+ Properties",
      description: "Surpassed 10,000 properties listed on our platform with over 5,000 successful lease approvals."
    },
    {
      year: "Phase 4",
      title: "Technology Enhancement",
      description: "Enhanced our technology platform to provide faster approvals and better user experience."
    },
    {
      year: "Today",
      title: "Market Leader",
      description: "Leading professional cosigning service with 99.8% rent collection rate and 15,000+ properties."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            About <span className="text-slate-700">Bredora Inc</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            <span className="font-bold text-slate-800 text-2xl tracking-wide">Revolutionizing Rental Approvals.</span> We're the leading professional cosigning service helping renters secure apartments and landlords find quality tenants with guaranteed backing.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                To eliminate the barriers that prevent qualified renters from securing their dream apartments. We bridge the gap between renters who need cosigners and landlords who want guaranteed rent payments, creating a win-win solution for everyone.
              </p>
              <div className="bg-slate-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Why We Started Bredora</h3>
                <p className="text-slate-600 leading-relaxed">
                  After seeing countless qualified young professionals struggle to find apartments due to lack of cosigners, our founders created Bredora to provide professional, reliable cosigning services that landlords trust and renters can afford.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-slate-100 mb-6 leading-relaxed">
                To become the most trusted name in rental approvals, making quality housing accessible to everyone while providing landlords with the security they need.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Nationwide coverage in all 50 states</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>99.8% rent collection guarantee</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional service excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-xl text-slate-600">Growth milestones and achievements - the Bredora story</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:px-8">
                    <div className={`bg-white rounded-xl p-6 shadow-lg border border-slate-200 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="text-2xl font-bold text-slate-700 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{milestone.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-4 h-4 bg-slate-700 rounded-full border-4 border-white shadow-lg flex-shrink-0 relative z-10"></div>
                  
                  <div className="flex-1 md:px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Company Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Bredora by the Numbers</h2>
            <p className="text-xl text-slate-600">Our impact on the rental market</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">15,000+</div>
              <div className="text-slate-600 font-semibold">Properties Listed</div>
              <div className="text-sm text-slate-500 mt-2">Across all 50 states</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">25,000+</div>
              <div className="text-slate-600 font-semibold">Successful Approvals</div>
              <div className="text-sm text-slate-500 mt-2">And counting</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">99.8%</div>
              <div className="text-slate-600 font-semibold">Rent Collection Rate</div>
              <div className="text-sm text-slate-500 mt-2">Industry leading</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">$50M+</div>
              <div className="text-slate-600 font-semibold">Guaranteed Rent</div>
              <div className="text-sm text-slate-500 mt-2">Protected for landlords</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Integrity</h3>
              <p className="text-slate-600 leading-relaxed">
                We operate with complete transparency and honesty in all our dealings with renters, landlords, and partners.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Innovation</h3>
              <p className="text-slate-600 leading-relaxed">
                We continuously improve our technology and processes to make rental approvals faster and more efficient.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Service</h3>
              <p className="text-slate-600 leading-relaxed">
                We're committed to providing exceptional customer service and support to all our clients, 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Join the Bredora Family</h2>
          <p className="text-xl text-slate-300 mb-8">
            Whether you're a renter looking for guaranteed approval or a landlord seeking quality tenants, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all">
              Get Started as Renter
            </Link>
            <Link href="/landlords/signup" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
