'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BlogPageClient() {
  const blogPosts = [
    {
      slug: 'apartment-hunting-checklist',
      title: 'The Ultimate Apartment Hunting Checklist for 2025',
      excerpt: 'Navigate the competitive rental market with our comprehensive checklist. From budgeting to viewing appointments, we cover everything you need to secure your perfect apartment.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      category: 'Rental Tips',
      date: 'June 25, 2025',
      readTime: '5 min read',
      views: '2,847'
    },
    {
      slug: 'credit-score-rental-approval',
      title: 'How Your Credit Score Affects Rental Approval',
      excerpt: 'Understanding the relationship between credit scores and rental approvals. Learn what landlords look for and how to improve your chances of getting approved.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      category: 'Credit Guide',
      date: 'July 5, 2025',
      readTime: '7 min read',
      views: '1,923'
    },
    {
      slug: 'lease-agreement-red-flags',
      title: 'Red Flags to Watch for in Lease Agreements',
      excerpt: 'Protect yourself from problematic lease terms. Our guide highlights common red flags and predatory practices to avoid when signing your rental agreement.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      category: 'Legal Guide',
      date: 'July 12, 2025',
      readTime: '6 min read',
      views: '3,421'
    }
  ];

  const categories = ['All', 'Rental Tips', 'Credit Guide', 'Legal Guide', 'Market Insights'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Credora Inc Blog
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Expert advice and insights to help you navigate the apartment rental process with confidence.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border-2 border-slate-300 text-slate-700 hover:border-slate-700 hover:text-slate-900 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-slate-200">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{post.views} views</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 hover:text-slate-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-slate-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-slate-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Get the latest apartment hunting tips, market insights, and rental advice delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-700"
            />
            <button className="bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
