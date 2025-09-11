'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600 mb-6">
            <span className="font-bold text-slate-800 text-xl tracking-wide">Legal Agreement.</span> Please read these terms carefully before using Credora's services.
          </p>
          <p className="text-sm text-slate-500">
            Last updated: January 1, 2025 | Effective Date: January 1, 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            
            {/* 1. Agreement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                By accessing or using Credora Inc's services ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, then you may not access the Service.
              </p>
              <p className="text-slate-600 leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to 
                renters seeking cosigning services and landlords listing properties.
              </p>
            </div>

            {/* 2. Description of Service */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Credora Inc provides professional cosigning services for residential lease agreements. Our services include:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Professional cosigning for qualified rental applicants</li>
                <li>Employment verification and rental history review services</li>
                <li>Property listing platform for landlords</li>
                <li>Tenant-landlord matching services</li>
                <li>Lease agreement facilitation</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Credora acts as a professional cosigner and guarantor for lease agreements, subject to our approval criteria and risk assessment.
              </p>
            </div>

            {/* 3. Eligibility */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Eligibility Requirements</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                To use our Service, you must:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Be at least 18 years of age</li>
                <li>Be legally authorized to enter into binding contracts</li>
                <li>Provide accurate and truthful information</li>
                <li>Comply with all applicable local, state, and federal laws</li>
                <li>Meet our creditworthiness and income verification requirements</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Credora reserves the right to refuse service to any applicant who does not meet our eligibility criteria.
              </p>
            </div>

            {/* 4. Fees and Payment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Fees and Payment Terms</h2>
              <div className="bg-slate-50 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Renter Fees:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li><strong>Application Fee:</strong> $55 (non-refundable, covers employment verification, rental history review, and processing)</li>
                  <li><strong>Cosigning Fee:</strong> Percentage of first month's rent (75% for students, 85% for employed/self-employed individuals)</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Landlord Fees:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li><strong>Listing Fee:</strong> Free</li>
                  <li><strong>Success Fee:</strong> 5% of first month's rent (only charged upon successful rental)</li>
                </ul>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All fees are clearly disclosed before payment. Refund policies are outlined in Section 8.
              </p>
            </div>

            {/* 5. Cosigning Obligations */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Cosigning Obligations and Guarantees</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                When Credora acts as your cosigner, we guarantee:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Payment of monthly rent if tenant defaults</li>
                <li>Payment of reasonable damages beyond security deposit</li>
                <li>Coverage for lease violations and early termination fees</li>
                <li>Professional communication with landlords</li>
              </ul>
              <p className="text-slate-600 mb-4 leading-relaxed">
                <strong>Tenant Responsibilities:</strong> Tenants remain primarily responsible for all lease obligations. 
                Credora's cosigning does not release tenants from their contractual duties.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Recovery Rights:</strong> Credora reserves the right to pursue collection from tenants for any amounts 
                paid on their behalf, including legal fees and collection costs.
              </p>
            </div>

            {/* 6. Application Process */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Application and Approval Process</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Our application process includes:
              </p>
              <ol className="list-decimal list-inside text-slate-600 space-y-2 mb-4">
                <li>Online application submission with required documentation</li>
                <li>Payment of $55 application fee</li>
                <li>Agreement to pay cosigning fee upon lease approval (75% of first month's rent for students, 85% for employed/self-employed)</li>
                <li>Employment verification and rental history review (typically 24-48 hours)</li>
                <li>Employment and income verification</li>
                <li>Approval or denial notification</li>
                <li>Cosigning agreement execution (if approved)</li>
                <li>Payment of cosigning fee (75% for students, 85% for employed/self-employed)</li>
              </ol>
              <p className="text-slate-600 leading-relaxed">
                <strong>Approval Criteria:</strong> Decisions are based on rental history, income verification, employment status, 
                rental history, and other risk factors. Approval is not guaranteed.
              </p>
            </div>

            {/* 7. User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">7. User Responsibilities</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Users agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Comply with all lease terms and conditions</li>
                <li>Pay all fees promptly when due</li>
                <li>Communicate professionally with all parties</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                <strong>Prohibited Activities:</strong> Users may not use the Service for illegal activities, fraud, 
                misrepresentation, or any purpose that violates these Terms.
              </p>
            </div>

            {/* 8. Refund Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Refund and Cancellation Policy</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                <p className="text-slate-700 font-semibold mb-2">Important Refund Information:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li><strong>Application Fee ($55):</strong> Non-refundable in all circumstances</li>
                  <li><strong>Cosigning Fee:</strong> Refundable if lease is not approved or if Credora fails to provide cosigning services</li>
                  <li><strong>Cosigning Fee:</strong> Non-refundable once lease is signed</li>
                  <li><strong>Pre-signing Cancellation:</strong> Full refund of cosigning fee if cancelled before lease execution</li>
                </ul>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Refund requests must be submitted in writing to support@credora.com within the applicable timeframe.
              </p>
            </div>

            {/* 9. Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Credora's liability is limited to the amount of fees paid by the user. We are not liable for:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from landlord or tenant disputes</li>
                <li>Property damage beyond our cosigning obligations</li>
                <li>Third-party actions or omissions</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                <strong>Maximum Liability:</strong> Our total liability shall not exceed the fees paid by the user in the 12 months 
                preceding the claim.
              </p>
            </div>

            {/* 10. Privacy and Data */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Privacy and Data Protection</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                <Link href="/privacy" className="text-slate-700 underline hover:text-slate-900"> Privacy Policy</Link>, 
                which is incorporated into these Terms by reference.
              </p>
              <p className="text-slate-600 leading-relaxed">
                By using our Service, you consent to the collection, use, and sharing of your information as described 
                in our Privacy Policy, including for credit checks, background verification, and cosigning purposes.
              </p>
            </div>

            {/* 11. Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Termination</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Either party may terminate this agreement with 30 days written notice, subject to existing cosigning obligations. 
                Credora may terminate immediately for:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Breach of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Violation of lease terms we are cosigning</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                <strong>Effect of Termination:</strong> Existing cosigning obligations survive termination until lease expiration or 
                early termination according to lease terms.
              </p>
            </div>

            {/* 12. Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Governing Law and Jurisdiction</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                These Terms are governed by the laws of the State of California, without regard to conflict of law principles. 
                Any disputes shall be resolved in the state or federal courts located in California.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Arbitration:</strong> Both parties agree to binding arbitration for disputes under $25,000, 
                conducted under the rules of the American Arbitration Association.
              </p>
            </div>

            {/* 13. Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">13. Changes to Terms</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Credora reserves the right to modify these Terms at any time. We will notify users of material changes via:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>In-app notifications</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Continued use of the Service after changes constitutes acceptance of the new Terms. 
                If you disagree with changes, you must discontinue use of the Service.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-slate-600">
                <p><strong>Email:</strong> legal@credora.com</p>
                <p><strong>Phone:</strong> 1-800-CREDORA (1-800-273-3672)</p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM PST</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
