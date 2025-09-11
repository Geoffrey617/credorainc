'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'application' | 'process' | 'landlord';
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-credora',
    question: 'What is Credora and how does it work?',
    answer: 'Credora Inc is a professional cosigning service that helps renters secure apartments when they need an assigned cosigner or guarantor. We run comprehensive background checks and employment verification to assess each renter\'s ability to pay rent, then connect approved applicants with vetted, financially assigned cosigners who meet landlord requirements.',
    category: 'general'
  },
  {
    id: 'who-needs-cosigner',
    question: 'Who needs a cosigner service?',
    answer: 'Our service is perfect for young professionals, recent graduates, international students, self-employed individuals, people with limited rental history, those relocating to new cities, or anyone who doesn\'t meet traditional income requirements (typically 3x monthly rent) but has steady employment and income.',
    category: 'general'
  },
  {
    id: 'cosigner-vs-guarantor',
    question: 'What\'s the difference between a cosigner and guarantor?',
    answer: 'The terms are often used interchangeably, but technically a cosigner signs the lease alongside you and shares equal responsibility, while a guarantor provides a separate guarantee to pay if you default. At Credora Inc, our professional cosigners function as guarantors - they don\'t live in the apartment but guarantee your rent payments to the landlord.',
    category: 'general'
  },
  {
    id: 'how-long-process',
    question: 'How long does the approval process take?',
    answer: 'Most applications are processed within 24-48 hours. Once you submit your application with required documents (ID, employment verification, income proof), our team reviews everything and matches you with an appropriate cosigner. Emergency applications can sometimes be expedited for same-day approval.',
    category: 'process'
  },
  {
    id: 'what-documents-needed',
    question: 'What documents do I need to apply?',
    answer: 'You\'ll need: Valid government-issued ID, proof of employment (pay stubs, employment letter, or tax returns), bank statements from the last 2-3 months, and sometimes additional documents depending on your situation (student enrollment, visa status, etc.).',
    category: 'application'
  },

  // Pricing Questions
  {
    id: 'how-much-cost',
    question: 'How much does Credora cost?',
    answer: 'Our pricing varies based on your situation. Students typically pay 75% of the first month\'s rent, while working professionals pay the equivalent of the first month\'s rent. There are no hidden fees - just one upfront payment for the cosigning service.',
    category: 'pricing'
  },
  {
    id: 'when-do-i-pay',
    question: 'When do I pay for the service?',
    answer: 'Payment is due once you\'re approved and matched with a cosigner, but before we provide the cosigner information to your landlord. We accept all major credit cards, bank transfers, and digital payment methods.',
    category: 'pricing'
  },
  {
    id: 'refund-policy',
    question: 'What if I don\'t get approved for the apartment?',
    answer: 'If you\'re approved by Credora Inc but then rejected by the landlord for reasons unrelated to the cosigner (such as too many applicants), we offer a full refund. However, if you\'re approved by both Credora Inc and the landlord but choose not to proceed, the fee is non-refundable.',
    category: 'pricing'
  },
  {
    id: 'additional-fees',
    question: 'Are there any additional fees?',
    answer: 'No hidden fees! The one-time cosigning fee covers everything: background checks, cosigner matching, documentation, and ongoing support throughout your lease term. You won\'t pay monthly fees or renewal charges.',
    category: 'pricing'
  },

  // Application Process
  {
    id: 'application-requirements',
    question: 'What are the minimum requirements to apply?',
    answer: 'You must be 18+, have verifiable income (employment, student aid, family support), no recent evictions, and no major criminal background issues. Income requirements vary but typically you need to show ability to afford the rent even if it\'s less than 3x the monthly amount.',
    category: 'application'
  },
  {
    id: 'credit-score-requirement',
    question: 'What credit score do I need?',
    answer: 'We don\'t have a strict minimum credit score requirement. We evaluate applications holistically, considering income, employment stability, rental history, and overall financial picture. Even applicants with limited or poor credit history can often be approved.',
    category: 'application'
  },
  {
    id: 'international-students',
    question: 'Do you work with international students?',
    answer: 'Yes! We specialize in helping international students who often struggle with traditional rental applications. We understand F-1, J-1, and other visa situations. You\'ll need your I-20, visa documents, and proof of funding (bank statements, scholarship letters, or sponsor information).',
    category: 'application'
  },
  {
    id: 'self-employed-freelancers',
    question: 'What about self-employed or freelance applicants?',
    answer: 'Absolutely! Self-employed individuals can apply using tax returns, bank statements, client contracts, or other proof of income. We understand that freelance income can be variable and evaluate applications based on overall financial stability and earning potential.',
    category: 'application'
  },

  // Process Questions
  {
    id: 'how-cosigner-selected',
    question: 'How is my cosigner selected?',
    answer: 'We maintain a network of pre-screened, financially qualified cosigners in major metropolitan areas. Cosigners are matched based on location, apartment price range, and landlord requirements. All our cosigners have excellent credit scores (typically 750+) and verifiable income.',
    category: 'process'
  },
  {
    id: 'meet-cosigner',
    question: 'Will I meet my cosigner in person?',
    answer: 'Not necessarily. Our cosigners are professional service providers, not personal contacts. Communication typically happens through Credora Inc as an intermediary. However, if the landlord requires an in-person meeting or phone call, we can facilitate that.',
    category: 'process'
  },
  {
    id: 'cosigner-responsibilities',
    question: 'What are the cosigner\'s responsibilities?',
    answer: 'The cosigner guarantees rent payments if you default, provides their financial information to landlords, and may need to sign lease documents. They don\'t have any rights to the apartment and aren\'t involved in day-to-day rental matters.',
    category: 'process'
  },
  {
    id: 'lease-renewal',
    question: 'What happens when I want to renew my lease?',
    answer: 'Great question! Lease renewals with the same cosigner are typically included in your original service fee. If you move to a new apartment, you\'ll need to apply for a new cosigning service, though existing customers often receive discounted rates.',
    category: 'process'
  },

  // Landlord Questions
  {
    id: 'landlord-acceptance',
    question: 'Do all landlords accept cosigners?',
    answer: 'Most landlords accept cosigners, especially when they meet or exceed the typical requirements (high credit score, income 3-4x the rent). However, some landlords or management companies have specific policies. We can help communicate with landlords about our service.',
    category: 'landlord'
  },
  {
    id: 'landlord-verification',
    question: 'How do landlords verify the cosigner?',
    answer: 'Landlords can verify cosigners through the same process they use for any applicant: credit checks, income verification, and reference checks. We provide all necessary documentation and are available to speak with landlords directly about our service.',
    category: 'landlord'
  },
  {
    id: 'cosigner-local-requirement',
    question: 'What if the landlord requires a local cosigner?',
    answer: 'Many of our cosigners are local to major metropolitan areas. If a landlord specifically requires a local cosigner, we\'ll work to match you with someone in the appropriate geographic area. This requirement is becoming less common as remote work normalizes.',
    category: 'landlord'
  },

  // Additional Questions
  {
    id: 'states-covered',
    question: 'Which states do you operate in?',
    answer: 'Credora Inc operates in all 50 states, with the highest concentration of cosigners in major metropolitan areas like New York, Los Angeles, Chicago, Boston, San Francisco, Washington DC, and other major cities.',
    category: 'general'
  },
  {
    id: 'apartment-types',
    question: 'What types of apartments do you work with?',
    answer: 'We work with all types of rental properties: studio apartments, one-bedrooms, multi-bedroom units, condos, townhouses, and even some single-family homes. Both individual landlords and large management companies accept our cosigning services.',
    category: 'general'
  },
  {
    id: 'emergency-applications',
    question: 'Do you handle emergency or rush applications?',
    answer: 'Yes! We understand that great apartments move fast. Rush applications can often be processed within a few hours during business hours. Contact us directly if you need expedited service - additional fees may apply for same-day processing.',
    category: 'process'
  },
  {
    id: 'customer-support',
    question: 'What kind of customer support do you provide?',
    answer: 'We provide ongoing support throughout your application process and lease term. Our team can communicate with landlords, help with documentation, answer questions, and resolve any issues that arise. Support is available via phone, email, and chat.',
    category: 'general'
  }
];

const categories = [
  { id: 'all', name: 'All Questions', count: faqData.length },
  { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length },
  { id: 'pricing', name: 'Pricing', count: faqData.filter(item => item.category === 'pricing').length },
  { id: 'application', name: 'Application', count: faqData.filter(item => item.category === 'application').length },
  { id: 'process', name: 'Process', count: faqData.filter(item => item.category === 'process').length },
  { id: 'landlord', name: 'Landlords', count: faqData.filter(item => item.category === 'landlord').length },
];

export default function FAQPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenItems(filteredFAQs.map(item => item.id));
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Everything you need to know about Credora Inc's apartment cosigning service. Can't find what you're looking for? <Link href="/contact" className="text-slate-700 hover:text-slate-900 underline">Contact us</Link>.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto mb-8">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-slate-700 text-white'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="space-y-2">
                  <button
                    onClick={expandAll}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">
                Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No questions found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-slate-700 hover:text-slate-900 underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-inset"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 pr-4">{item.question}</h3>
                        <div className={`transform transition-transform ${openItems.includes(item.id) ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {openItems.includes(item.id) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-slate-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-slate-200 mb-8">
            Our team is here to help you navigate the apartment application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
              Contact Support
            </Link>
            <Link href="/apply" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-slate-700 transition-colors">
              Start Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
