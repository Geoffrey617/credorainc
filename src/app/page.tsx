'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedHero from '@/components/AnimatedHero';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // IMMEDIATE redirect for logged-in users - they should never see marketing pages
    if (typeof window !== 'undefined') {
      const tempSession = sessionStorage.getItem('credora_session_temp');
      const persistentSession = localStorage.getItem('credora_persistent_session');
      
      if (tempSession || persistentSession) {
        console.log('🔄 Logged-in user blocked from marketing page - redirecting to dashboard');
        router.replace('/dashboard'); // Use replace to prevent back navigation
        return;
      }
    }
  }, [router]);
  // Mock statistics - in real app these would come from your API
  const stats = {
    totalApplications: 12547,
    approvedApplications: 10891,
    leasesApproved: 9834,
    successRate: 94.2
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graduate Student",
      initial: "S",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      review: "Bredora made my apartment hunt so much easier! As a graduate student with limited credit history, I was worried about getting approved. Their cosigning service got me into my dream apartment in just 3 days."
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      initial: "M", 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      review: "The process was incredibly smooth and professional. I needed to relocate quickly for work, and Bredora's team handled everything efficiently. Highly recommend their service!"
    },
    {
      name: "Emily Rodriguez",
      role: "Nursing Student",
      initial: "E",
      color: "bg-gradient-to-br from-purple-500 to-purple-600", 
      review: "As an international student, finding housing was my biggest concern. Bredora's cosigning service gave me the confidence I needed. The team was supportive throughout the entire process."
    },
    {
      name: "David Park",
      role: "Recent Graduate",
      initial: "D",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      review: "I was amazed by how quickly everything was processed. Within 48 hours, I had approval and was matched with a cosigner. The transparency and communication were excellent."
    },
    {
      name: "Jessica Williams",
      role: "Marketing Professional", 
      initial: "J",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      review: "Moving to a new city for work was stressful, but Bredora made the apartment search effortless. Their professional cosigners have excellent credit, which gave landlords confidence in my application."
    },
    {
      name: "Alex Thompson",
      role: "PhD Candidate",
      initial: "A",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      review: "The service exceeded my expectations. Not only did I get approved quickly, but the team also provided valuable advice about lease terms. Worth every penny!"
    }
  ];

  // Your updated apartment/property images for the animated hero (20 images)
  const heroAnimatedImages = [
    '/hero-images/WhatsApp Image 2025-09-05 at 10.22.48.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.23.50.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.24.33.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.24.45.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.24.56.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.25.10.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.25.22.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.25.38.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.25.47.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.25.57.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.26.06.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.26.25.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.26.48.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.05.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.14.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.23.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.33.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.43.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.27.53.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 10.28.08.jpeg',
  ];





  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({
    'blog-views-1': 2847,
    'blog-views-2': 1923,
    'blog-views-3': 3156
  });

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000); // Move every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto-scroll hero images
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroAnimatedImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(heroInterval);
  }, [heroAnimatedImages.length]);

  // Load view counts from localStorage on component mount
  useEffect(() => {
    const savedCounts = localStorage.getItem('blogViewCounts');
    if (savedCounts) {
      setViewCounts(JSON.parse(savedCounts));
    }
  }, []);

  // Function to increment view count
  const incrementViews = (blogId: string) => {
    setViewCounts(prev => {
      const newCounts = {
        ...prev,
        [blogId]: prev[blogId] + 1
      };
      localStorage.setItem('blogViewCounts', JSON.stringify(newCounts));
      
      // Update the DOM immediately
      const element = document.getElementById(blogId);
      if (element) {
        element.textContent = newCounts[blogId].toString();
      }
      
      return newCounts;
    });
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-600 to-slate-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-900/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              {/* Trust Badge - Glassmorphism */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Helping 12,000+ renters find & secure apartments nationwide
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Your Dream
                <span className="text-slate-100 block">Apartment</span>
                <span className="text-slate-200 block">Awaits</span>
              </h1>
              
              <p className="text-lg text-slate-100 mb-8 leading-relaxed">
                <span className="font-bold text-white text-xl tracking-wide">Apartment Finder and Lease Cosigner Service.</span> We understand how hard it is when your income looks great on paper but landlords still want a cosigner. Our lease cosigner service provides you with the professional cosigner you need to secure your dream apartment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/signin" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 hover:border-white/40 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center">
                  Apply Now
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  No Credit Check Required
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  24-48 hours approval
                </div>
            <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All 50 States
                </div>
              </div>
            </div>
            
            {/* Animated Hero Images */}
            <div className="relative h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {heroAnimatedImages.map((image, index) => {
                  // Calculate relative position to current image
                  let position = index - currentHeroImage;
                  if (position < 0) position += heroAnimatedImages.length;
                  
                  return (
                    <div
                      key={index}
                      className="absolute w-80 h-96 md:w-[32rem] md:h-[36rem] lg:w-[36rem] lg:h-[36rem] transition-all duration-1000 ease-in-out"
                      style={{
                        transform: position === 0 
                          ? 'translateY(0) scale(1)' 
                          : position === 1 
                          ? 'translateY(-60px) scale(0.9)' 
                          : position === 2 
                          ? 'translateY(-120px) scale(0.8)' 
                          : 'translateY(-200px) scale(0.6)',
                        opacity: position === 0 
                          ? 1 
                          : position <= 2 
                          ? 0.8 - (position * 0.2) 
                          : 0,
                        zIndex: position === 0 ? 10 : 10 - position,
                      }}
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Image
                          src={image}
                          alt={`Apartment ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 320px, (max-width: 1024px) 512px, 576px"
                          priority={position <= 2}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroAnimatedImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentHeroImage 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartment listings section removed - focusing on core services */}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Why Choose Bredora?
          </h2>
            <p className="text-lg text-slate-600">
              We make apartment hunting easier by helping you find properties and providing professional cosigning services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">Find & Secure Apartments</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                We help you discover available apartments that match your criteria and get approved in 24-48 hours with our cosigning service.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">Professional Cosigner</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Get matched with a professional cosigner with excellent credit to help you secure your dream apartment.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">24-48 Hour Approval</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Fast approval process with our streamlined application and professional cosigner network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
            How It Works
          </h2>
            <p className="text-lg text-slate-600">
              Get approved for your dream apartment in 7 simple steps
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {/* Step 1: Apply */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                1
              </div>
            </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Apply</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Complete our online application with your employment and income details in 10 minutes.</p>
            </div>
            
            {/* Step 2: Background Check */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                2
              </div>
            </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Background Check</h3>
              <p className="text-slate-600 leading-relaxed text-sm">We verify your employment, income stability, and assess your ability to pay rent.</p>
            </div>
            
            {/* Step 3: Get Approved */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-slate-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                3
              </div>
            </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Get Approved</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Receive approval within 24-48 hours and get matched with your assigned cosigner.</p>
            </div>
            
            {/* Step 4: Sign Service Agreement */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                4
              </div>
            </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Sign Service Agreement</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Complete our cosigning service agreement</p>
            </div>
            
            {/* Step 5: We Cosign Your Lease */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-slate-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                  5
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">We Cosign Your Lease</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Your assigned cosigner backs your lease application</p>
            </div>
            
            {/* Step 6: Lease Approved */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-slate-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                  6
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Lease Approved</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Your lease application gets approved</p>
            </div>
            
            {/* Step 7: Move In */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-slate-700 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                  7
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Move In</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Complete your lease signing and move into your new apartment!</p>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-gray-100 rounded-full px-6 py-3">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Complete process typically takes 3-7 days from application to move-in</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Rental Blog Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Recent Rental Blog
          </h2>
            <p className="text-lg text-slate-600">
              Stay updated with the latest rental market trends, tips, and insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <Link href="/blog/apartment-hunting-checklist" className="block">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                    alt="Young professional looking at apartment listings on laptop"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Rental Tips
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-slate-500 mb-2">June 25, 2025</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                    The Ultimate Apartment Hunting Checklist for 2025
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    Navigate the competitive rental market with our comprehensive checklist. From budgeting to viewing appointments, we cover everything you need to secure your perfect apartment.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>2,847</span> views
                    </div>
                    <span className="text-sm font-medium text-slate-700">5 min read</span>
                  </div>
                </div>
              </Link>
            </article>

            {/* Blog Post 2 */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <Link href="/blog/credit-score-rental-approval" className="block">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                    alt="Person reviewing credit report and financial documents"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Credit Guide
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-slate-500 mb-2">July 5, 2025</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                    How Your Credit Score Affects Rental Approval
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    Understanding the relationship between credit scores and rental approvals. Learn what landlords look for and how to improve your chances of getting approved.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>1,923</span> views
                    </div>
                    <span className="text-sm font-medium text-slate-700">7 min read</span>
                  </div>
                </div>
              </Link>
            </article>

            {/* Blog Post 3 */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <Link href="/blog/lease-agreement-red-flags" className="block">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                    alt="Professional woman reading lease agreement carefully"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Legal Guide
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-slate-500 mb-2">August 29, 2025</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                    Red Flags to Watch for in Lease Agreements
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    Protect yourself from unfair lease terms. Our legal experts share the most common red flags to watch for when reviewing rental agreements.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>3,156</span> views
                    </div>
                    <span className="text-sm font-medium text-slate-700">6 min read</span>
                  </div>
                </div>
              </Link>
            </article>
          </div>

          {/* View All Blog Posts Button */}
          <div className="text-center mt-12">
            <Link 
              href="/blog" 
              className="inline-flex items-center bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              View All Blog Posts
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Stories from renters who found their perfect home with our professional cosigning service
            </p>
          </div>
          
          {/* Continuous Sliding Testimonials */}
          <div className="relative overflow-hidden">
            {/* Single Row - Continuous Movement */}
            <div className="flex space-x-8 animate-slide-left">
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={`testimonial-${index}`} 
                  className="group cursor-pointer preserve-3d flex-shrink-0 w-96"
                  style={{
                    transform: `rotateY(${index % 2 === 0 ? '5deg' : '-5deg'}) rotateX(2deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-0 group-hover:shadow-white/25">
                    {/* 3D Card Back Shadow */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transform translate-z-[-20px] translate-x-4 translate-y-4 opacity-60"></div>
                    
                    {/* Quote Icon */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="flex items-center mb-6 relative z-10">
                      <div className={`w-16 h-16 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.initial}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                        <p className="text-slate-200 font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <div className="relative z-10 mb-6">
                      <p className="text-slate-100 leading-relaxed italic text-lg">
                        "{testimonial.review}"
                      </p>
                    </div>
                    
                    {/* 5 Star Rating */}
                    <div className="flex justify-center space-x-1 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute bottom-8 left-6 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Bredora Inc</h3>
              <p className="text-gray-400 mb-4">
                Apartment Finder and lease cosigning service for renters nationwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Renters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/auth/signin" className="hover:text-white transition-colors">Apply Now</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-400 space-y-4">
              <div className="text-sm">
                <p className="mb-2">&copy; 2025 Bredora Inc. All rights reserved.</p>
                <p className="mb-2">A Delaware Corporation | Licensed in all 50 states</p>
                <p className="mb-2">Apartment Finder | Lease Cosigner Service</p>
              </div>
              
              <div className="text-xs text-gray-500 max-w-4xl mx-auto">
                <p className="mb-2">
                  <strong>Legal Notice:</strong> Bredora Inc is incorporated in the State of Delaware and operates as an apartment finder and lease cosigner service with mailing address in San Francisco, California. 
                  Our services are subject to employment verification and rental history review processes. Fees are non-refundable except as outlined in our Terms of Service.
                </p>
                <p className="mb-2">
                  <strong>California Residents:</strong> You have the right to request information about our business practices. 
                  For questions regarding our services, licensing, or to file a complaint, contact us at legal@bredora.com.
                </p>
                <p>
                  <strong>Disclaimer:</strong> Lease approval is subject to landlord acceptance and meeting all application requirements. 
                  Bredora Inc acts as a cosigner service and does not guarantee apartment availability or landlord approval decisions.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
                <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
