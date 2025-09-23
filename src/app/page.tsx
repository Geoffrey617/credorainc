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




  // Extended testimonials array with 30 reviews
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer, NYC",
      initial: "S",
      color: "bg-blue-500",
      review: "As a recent graduate with limited rental history, I was struggling to get approved for apartments in NYC. Bredora made it possible for me to secure my dream apartment in Manhattan within 48 hours!"
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Manager, Chicago",
      initial: "M",
      color: "bg-green-500",
      review: "The process was incredibly smooth and transparent. No hidden fees, fast approval, and excellent customer service. I highly recommend Bredora to anyone who needs a cosigner."
    },
    {
      name: "Amanda Rodriguez",
      role: "Nurse, Los Angeles",
      initial: "A",
      color: "bg-purple-500",
      review: "Moving to a new city for work was stressful, but Bredora made finding an apartment so much easier. The digital process was perfect for my busy schedule."
    },
    {
      name: "David Kim",
      role: "Graduate Student, Boston",
      initial: "D",
      color: "bg-red-500",
      review: "As an international student, finding a cosigner was nearly impossible. Bredora saved my academic year by helping me secure housing near campus."
    },
    {
      name: "Jessica Taylor",
      role: "Freelance Designer, Austin",
      initial: "J",
      color: "bg-yellow-500",
      review: "Being self-employed made it hard to prove steady income. Bredora understood my situation and got me approved for a beautiful loft in downtown Austin."
    },
    {
      name: "Michael Brown",
      role: "Teacher, Denver",
      initial: "M",
      color: "bg-indigo-500",
      review: "After a divorce, my credit took a hit. Bredora gave me a second chance and helped me find a safe place for me and my kids."
    },
    {
      name: "Lisa Wang",
      role: "Data Analyst, Seattle",
      initial: "L",
      color: "bg-pink-500",
      review: "The traditional rental process was taking forever. Bredora's speed and efficiency helped me move to Seattle for my new job on time."
    },
    {
      name: "Robert Martinez",
      role: "Sales Rep, Miami",
      initial: "R",
      color: "bg-teal-500",
      review: "I needed to relocate quickly for work. Bredora's 24-hour approval process was exactly what I needed to secure housing fast."
    },
    {
      name: "Emily Davis",
      role: "Physical Therapist, Portland",
      initial: "E",
      color: "bg-orange-500",
      review: "As a first-time renter, I was overwhelmed by the process. Bredora's team guided me through everything and made it stress-free."
    },
    {
      name: "James Wilson",
      role: "Chef, Nashville",
      initial: "J",
      color: "bg-cyan-500",
      review: "Working multiple part-time jobs made my income look unstable on paper. Bredora saw the bigger picture and got me approved."
    },
    {
      name: "Ashley Thompson",
      role: "Photographer, San Francisco",
      initial: "A",
      color: "bg-lime-500",
      review: "San Francisco's rental market is brutal. Bredora gave me the edge I needed to compete with other applicants and land my dream apartment."
    },
    {
      name: "Kevin Lee",
      role: "Engineer, San Diego",
      initial: "K",
      color: "bg-emerald-500",
      review: "Excellent service from start to finish. The team was responsive, professional, and delivered exactly what they promised."
    },
    {
      name: "Rachel Green",
      role: "Lawyer, Washington DC",
      initial: "R",
      color: "bg-violet-500",
      review: "Even with a good job, DC's competitive market was tough. Bredora's cosigning service made all the difference in securing my apartment."
    },
    {
      name: "Tyler Anderson",
      role: "Startup Founder, Phoenix",
      initial: "T",
      color: "bg-rose-500",
      review: "As a startup founder with fluctuating income, traditional landlords were hesitant. Bredora understood my situation and made it work."
    },
    {
      name: "Samantha Moore",
      role: "Consultant, Atlanta",
      initial: "S",
      color: "bg-sky-500",
      review: "The customer service was outstanding. They kept me informed throughout the entire process and answered all my questions promptly."
    },
    {
      name: "Brian Clark",
      role: "Musician, New Orleans",
      initial: "B",
      color: "bg-amber-500",
      review: "As a freelance musician, proving steady income was challenging. Bredora's flexible approach helped me get approved for a great place in the French Quarter."
    },
    {
      name: "Nicole Adams",
      role: "Veterinarian, Minneapolis",
      initial: "N",
      color: "bg-slate-500",
      review: "Moving for my residency program, I needed housing fast. Bredora's quick turnaround time was perfect for my tight timeline."
    },
    {
      name: "Christopher Hall",
      role: "IT Specialist, Tampa",
      initial: "C",
      color: "bg-zinc-500",
      review: "The entire process was digital and efficient. I could handle everything remotely while managing my current job responsibilities."
    },
    {
      name: "Megan White",
      role: "Social Worker, Columbus",
      initial: "M",
      color: "bg-stone-500",
      review: "Bredora's transparent pricing was refreshing. No hidden fees or surprises - exactly what they quoted upfront."
    },
    {
      name: "Daniel Garcia",
      role: "Architect, Las Vegas",
      initial: "D",
      color: "bg-red-600",
      review: "The team was incredibly professional and made the whole cosigning process feel secure and legitimate. Highly recommended!"
    },
    {
      name: "Stephanie Lewis",
      role: "Pharmacist, Salt Lake City",
      initial: "S",
      color: "bg-blue-600",
      review: "After being turned down by several landlords, Bredora gave me the confidence and backing I needed to secure my ideal apartment."
    },
    {
      name: "Anthony Young",
      role: "Personal Trainer, Orlando",
      initial: "A",
      color: "bg-green-600",
      review: "Working multiple part-time jobs made my income look unstable on paper. Bredora saw the bigger picture and got me approved."
    },
    {
      name: "Jennifer King",
      role: "Journalist, Pittsburgh",
      initial: "J",
      color: "bg-purple-600",
      review: "The peace of mind knowing I had an assigned cosigner made apartment hunting so much less stressful. Thank you, Bredora!"
    },
    {
      name: "Matthew Wright",
      role: "Research Scientist, Raleigh",
      initial: "M",
      color: "bg-yellow-600",
      review: "Moving for a postdoc position, I needed housing before starting work. Bredora's service made the transition seamless."
    },
    {
      name: "Lauren Hill",
      role: "Marketing Director, Kansas City",
      initial: "L",
      color: "bg-indigo-600",
      review: "I was impressed by how quickly they processed my application. Within 24 hours, I had the approval I needed."
    },
    {
      name: "Ryan Scott",
      role: "Financial Advisor, Richmond",
      initial: "R",
      color: "bg-pink-600",
      review: "Even working in finance, I needed a cosigner due to recent job change. Bredora understood and delivered professional service."
    },
    {
      name: "Hannah Turner",
      role: "Graphic Designer, Milwaukee",
      initial: "H",
      color: "bg-teal-600",
      review: "The digital signature process was so convenient. I could complete everything from my current city before relocating."
    },
    {
      name: "Jordan Phillips",
      role: "Physical Therapist, Tucson",
      initial: "J",
      color: "bg-orange-600",
      review: "Bredora's team was patient with all my questions and made sure I understood every step of the process."
    },
    {
      name: "Alexis Campbell",
      role: "HR Manager, Oklahoma City",
      initial: "A",
      color: "bg-cyan-600",
      review: "The reliability and professionalism of Bredora made my landlord comfortable accepting their cosigning service immediately."
    },
    {
      name: "Trevor Mitchell",
      role: "Software Developer, Boise",
      initial: "T",
      color: "bg-lime-600",
      review: "Great experience from application to approval. Bredora made relocating to a new state for work much easier than expected."
    }
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
          
          <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Apply</h3>
              <p className="text-sm text-slate-600">Submit your application</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload</h3>
              <p className="text-sm text-slate-600">Secure document upload</p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Review</h3>
              <p className="text-sm text-slate-600">Application review</p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Pay</h3>
              <p className="text-sm text-slate-600">Secure payment</p>
            </div>
            
            {/* Step 5 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Match</h3>
              <p className="text-sm text-slate-600">Cosigner matching</p>
            </div>
            
            {/* Step 6 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">6</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Approve</h3>
              <p className="text-sm text-slate-600">Get approved</p>
            </div>
            
            {/* Step 7 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">7</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Move In</h3>
              <p className="text-sm text-slate-600">Secure your apartment</p>
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
              Tips and insights for renters
            </p>
          </div>
              </div>
            </Link>

            {/* Apartment 4 - The Point at Ridgeline */}
            <Link href="/apartments/4" className="group perspective-1000 block">
              <div className="relative h-80 transform-gpu transition-all duration-500 group-hover:rotate-y-6 group-hover:-translate-y-4 preserve-3d">
                <div className="absolute inset-0 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 transform translate-z-4 group-hover:shadow-white/25 transition-shadow duration-500">
                  <div className="relative h-full overflow-hidden rounded-3xl">
                    <Image
                      src="/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.27.34.jpeg"
                      alt="The Point at Ridgeline - Luxury Living in Northern Virginia"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      $2,600/mo
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="font-bold text-xl mb-1">The Point at Ridgeline</h3>
                      <p className="text-sm font-medium mb-1">Herndon, VA</p>
                      <div className="flex items-center gap-4 text-xs mb-2">
                        <span>2 bed • 2 bath</span>
                        <span>1,100 sq ft</span>
                      </div>
                      <div className="flex items-center mt-2 text-xs">
                        <span className="bg-emerald-500/80 backdrop-blur-sm px-2 py-1 rounded-full">Resort Style</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-slate-900/20 transform translate-z-2 -translate-y-2 translate-x-2 transition-all duration-500 group-hover:translate-x-4 group-hover:-translate-y-6"></div>
              </div>
            </Link>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-slate-100 mb-6">
              Browse our full selection of available apartments. Apply with our cosigning service and get approved fast!
            </p>
            <Link 
              href="/apartments" 
              className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 hover:border-white/40 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Apartments
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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
          
          <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">Guaranteed Acceptance</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                All our professional cosigners are thoroughly vetted with excellent credit scores. We also verify each renter's employment and income stability to ensure rent payment capability.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">Transparent Pricing</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Clear, upfront fees with no hidden costs. Know exactly what you'll pay before you apply - no surprises.
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
              <Link href="/blog/apartment-hunting-checklist" className="block" onClick={() => incrementViews('blog-views-1')}>                <div className="relative h-48">
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
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span id="blog-views-1">2,847</span> views
                    </div>
                    <span className="text-sm font-medium text-slate-700">5 min read</span>
                  </div>
                </div>
              </Link>
            </article>

            {/* Blog Post 2 */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <Link href="/blog/credit-score-rental-approval" className="block" onClick={() => incrementViews('blog-views-2')}>                <div className="relative h-48">
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
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span id="blog-views-2">1,923</span> views
                    </div>
                    <span className="text-sm font-medium text-slate-700">7 min read</span>
                  </div>
                </div>
              </Link>
            </article>

            {/* Blog Post 3 */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <Link href="/blog/lease-agreement-red-flags" className="block" onClick={() => incrementViews('blog-views-3')}>                <div className="relative h-48">
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
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span id="blog-views-3">3,156</span> views
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

              {/* State Listings Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Find Apartments in All 50 States
          </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Browse apartment listing
              </p>
            </div>
            
            {/* State Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
              <Link href="/apartments?state=AL" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Alabama</div>
                <div className="text-sm text-slate-600">AL</div>
              </Link>
              <Link href="/apartments?state=AK" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Alaska</div>
                <div className="text-sm text-slate-600">AK</div>
              </Link>
              <Link href="/apartments?state=AZ" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Arizona</div>
                <div className="text-sm text-slate-600">AZ</div>
              </Link>
              <Link href="/apartments?state=AR" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Arkansas</div>
                <div className="text-sm text-slate-600">AR</div>
              </Link>
              <Link href="/apartments?state=CA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">California</div>
                <div className="text-sm text-slate-600">CA</div>
              </Link>
              <Link href="/apartments?state=CO" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Colorado</div>
                <div className="text-sm text-slate-600">CO</div>
              </Link>
              <Link href="/apartments?state=CT" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Connecticut</div>
                <div className="text-sm text-slate-600">CT</div>
              </Link>
              <Link href="/apartments?state=DE" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Delaware</div>
                <div className="text-sm text-slate-600">DE</div>
              </Link>
              <Link href="/apartments?state=FL" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Florida</div>
                <div className="text-sm text-slate-600">FL</div>
              </Link>
              <Link href="/apartments?state=GA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Georgia</div>
                <div className="text-sm text-slate-600">GA</div>
              </Link>
              <Link href="/apartments?state=HI" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Hawaii</div>
                <div className="text-sm text-slate-600">HI</div>
              </Link>
              <Link href="/apartments?state=ID" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Idaho</div>
                <div className="text-sm text-slate-600">ID</div>
              </Link>
              <Link href="/apartments?state=IL" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Illinois</div>
                <div className="text-sm text-slate-600">IL</div>
              </Link>
              <Link href="/apartments?state=IN" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Indiana</div>
                <div className="text-sm text-slate-600">IN</div>
              </Link>
              <Link href="/apartments?state=IA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Iowa</div>
                <div className="text-sm text-slate-600">IA</div>
              </Link>
              <Link href="/apartments?state=KS" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Kansas</div>
                <div className="text-sm text-slate-600">KS</div>
              </Link>
              <Link href="/apartments?state=KY" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Kentucky</div>
                <div className="text-sm text-slate-600">KY</div>
              </Link>
              <Link href="/apartments?state=LA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Louisiana</div>
                <div className="text-sm text-slate-600">LA</div>
              </Link>
              <Link href="/apartments?state=ME" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Maine</div>
                <div className="text-sm text-slate-600">ME</div>
              </Link>
              <Link href="/apartments?state=MD" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Maryland</div>
                <div className="text-sm text-slate-600">MD</div>
              </Link>
              <Link href="/apartments?state=MA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Massachusetts</div>
                <div className="text-sm text-slate-600">MA</div>
              </Link>
              <Link href="/apartments?state=MI" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Michigan</div>
                <div className="text-sm text-slate-600">MI</div>
              </Link>
              <Link href="/apartments?state=MN" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Minnesota</div>
                <div className="text-sm text-slate-600">MN</div>
              </Link>
              <Link href="/apartments?state=MS" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Mississippi</div>
                <div className="text-sm text-slate-600">MS</div>
              </Link>
              <Link href="/apartments?state=MO" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Missouri</div>
                <div className="text-sm text-slate-600">MO</div>
              </Link>
              <Link href="/apartments?state=MT" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Montana</div>
                <div className="text-sm text-slate-600">MT</div>
              </Link>
              <Link href="/apartments?state=NE" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Nebraska</div>
                <div className="text-sm text-slate-600">NE</div>
              </Link>
              <Link href="/apartments?state=NV" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Nevada</div>
                <div className="text-sm text-slate-600">NV</div>
              </Link>
              <Link href="/apartments?state=NH" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">New Hampshire</div>
                <div className="text-sm text-slate-600">NH</div>
              </Link>
              <Link href="/apartments?state=NJ" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">New Jersey</div>
                <div className="text-sm text-slate-600">NJ</div>
              </Link>
              <Link href="/apartments?state=NM" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">New Mexico</div>
                <div className="text-sm text-slate-600">NM</div>
              </Link>
              <Link href="/apartments?state=NY" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">New York</div>
                <div className="text-sm text-slate-600">NY</div>
              </Link>
              <Link href="/apartments?state=NC" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">North Carolina</div>
                <div className="text-sm text-slate-600">NC</div>
              </Link>
              <Link href="/apartments?state=ND" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">North Dakota</div>
                <div className="text-sm text-slate-600">ND</div>
              </Link>
              <Link href="/apartments?state=OH" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Ohio</div>
                <div className="text-sm text-slate-600">OH</div>
              </Link>
              <Link href="/apartments?state=OK" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Oklahoma</div>
                <div className="text-sm text-slate-600">OK</div>
              </Link>
              <Link href="/apartments?state=OR" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Oregon</div>
                <div className="text-sm text-slate-600">OR</div>
              </Link>
              <Link href="/apartments?state=PA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Pennsylvania</div>
                <div className="text-sm text-slate-600">PA</div>
              </Link>
              <Link href="/apartments?state=RI" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Rhode Island</div>
                <div className="text-sm text-slate-600">RI</div>
              </Link>
              <Link href="/apartments?state=SC" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">South Carolina</div>
                <div className="text-sm text-slate-600">SC</div>
              </Link>
              <Link href="/apartments?state=SD" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">South Dakota</div>
                <div className="text-sm text-slate-600">SD</div>
              </Link>
              <Link href="/apartments?state=TN" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Tennessee</div>
                <div className="text-sm text-slate-600">TN</div>
              </Link>
              <Link href="/apartments?state=TX" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Texas</div>
                <div className="text-sm text-slate-600">TX</div>
              </Link>
              <Link href="/apartments?state=UT" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Utah</div>
                <div className="text-sm text-slate-600">UT</div>
              </Link>
              <Link href="/apartments?state=VT" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Vermont</div>
                <div className="text-sm text-slate-600">VT</div>
              </Link>
              <Link href="/apartments?state=VA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Virginia</div>
                <div className="text-sm text-slate-600">VA</div>
              </Link>
              <Link href="/apartments?state=WA" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Washington</div>
                <div className="text-sm text-slate-600">WA</div>
              </Link>
              <Link href="/apartments?state=WV" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">West Virginia</div>
                <div className="text-sm text-slate-600">WV</div>
              </Link>
              <Link href="/apartments?state=WI" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Wisconsin</div>
                <div className="text-sm text-slate-600">WI</div>
              </Link>
              <Link href="/apartments?state=WY" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors">
                <div className="font-semibold text-slate-800">Wyoming</div>
                <div className="text-sm text-slate-600">WY</div>
          </Link>
            </div>
            
            <div className="text-center">
              <Link href="/apartments" className="bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-colors inline-block">
                View All Apartments
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
              stories from renters who found their perfect home with our professional cosigning service
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
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Bredora Inc</h3>
              <p className="text-gray-400 mb-4">
                Apartment Finder and lease cosigning service for renters nationwide.
              </p>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a href="https://facebook.com/BredoraInc" className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Follow Bredora Inc on Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                {/* Threads */}
                <a href="https://threads.net/@credorainc" className="text-gray-400 hover:text-slate-300 transition-colors" aria-label="Follow Bredora Inc on Threads">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 4.405-.031 7.201-2.055 8.305-6.015l2.04.569c-.652 2.337-1.833 4.177-3.51 5.467C17.234 23.275 14.937 23.98 12.186 24zM12.183 2.25c-2.498.018-4.354.764-5.518 2.218-1.074 1.343-1.674 3.277-1.785 5.748v.008c.111 2.471.711 4.405 1.785 5.748 1.164 1.454 3.02 2.2 5.518 2.218 2.498-.018 4.354-.764 5.518-2.218 1.074-1.343 1.674-3.277 1.785-5.748v-.008c-.111-2.471-.711-4.405-1.785-5.748C16.537 3.014 14.681 2.268 12.183 2.25z"/>
                    <path d="M15.5 12c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5z"/>
                  </svg>
                </a>
                
                {/* Instagram */}
                <a href="https://instagram.com/credorainc" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Follow Bredora Inc on Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* TikTok */}
                <a href="https://tiktok.com/@credorainc" className="text-gray-400 hover:text-slate-300 transition-colors" aria-label="Follow Bredora Inc on TikTok">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-400 space-y-4">
              <div className="text-sm">
                <p className="mb-2">&copy; 2025 Bredora Inc. All rights reserved.</p>
                <p className="mb-2">A Delaware Corporation | Licensed in all 50 states</p>
                <p className="mb-2">Apartment Finder | lease cosigner service</p>
              </div>
              
              <div className="text-xs text-gray-500 max-w-4xl mx-auto">
                <p className="mb-2">
                  <strong>Legal Notice:</strong> Bredora Inc is incorporated in the State of Delaware and operates as an apartment finder and lease cosigner service with mailing address in San Francisco, California. 
                  Our services are subject to employment verification and rental history review processes. Fees are non-refundable except as outlined in our Terms of Service.
                </p>
                <p className="mb-2">
                  <strong>California Residents:</strong> You have the right to request information about our business practices. 
                  For questions regarding our services, licensing, or to file a complaint, contact us at legal@credora.com.
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
