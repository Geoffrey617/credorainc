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
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How Your Credit Score Affects Rental Approval
              </h3>
              <p className="text-slate-600 mb-4">
                Understanding the relationship between credit scores and rental approvals. Learn what landlords look for and how to improve your chances.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <span>5 min read</span>
                </div>
                <a href="/blog/credit-score-rental-approval" className="text-slate-700 hover:text-slate-900 font-medium">
                  Read More →
                </a>
              </div>
            </div>
            
            {/* Blog Post 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Apartment Hunting Checklist
              </h3>
              <p className="text-slate-600 mb-4">
                Essential tips for apartment hunting success. What to look for, questions to ask, and red flags to avoid.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <span>7 min read</span>
                </div>
                <a href="/blog/apartment-hunting-checklist" className="text-slate-700 hover:text-slate-900 font-medium">
                  Read More →
                </a>
              </div>
            </div>
            
            {/* Blog Post 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Lease Agreement Red Flags
              </h3>
              <p className="text-slate-600 mb-4">
                Important warning signs in lease agreements. Protect yourself from unfair terms and hidden fees.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <span>6 min read</span>
                </div>
                <a href="/blog/lease-agreement-red-flags" className="text-slate-700 hover:text-slate-900 font-medium">
                  Read More →
                </a>
              </div>
            </div>
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
            <div className="flex space-x-8 animate-slide-left">
              {/* Add testimonials content here */}
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
              <h4 className="font-semibold mb-4">For Renters</h4>
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
