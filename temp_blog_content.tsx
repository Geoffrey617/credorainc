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
      excerpt: 'Protect yourself from unfair lease terms. Our legal experts share the most common red flags to watch for when reviewing rental agreements.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      category: 'Legal Guide',
      date: 'August 29, 2025',
      readTime: '6 min read',
      views: '3,156'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-20">

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Rental Blog
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Expert insights, tips, and guides to help you navigate the rental market with confidence. 
              From apartment hunting to lease signing, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <article key={post.slug} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-slate-500 mb-2">{post.date}</div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        {post.views} views
                      </div>
                      <span className="text-sm font-medium text-slate-700">{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
