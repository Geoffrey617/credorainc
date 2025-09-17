'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, firebaseAuth } from '../../../../lib/firebase-auth';

export default function LandlordSignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    propertyCount: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    marketingEmails: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const router = useRouter();


  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const getPasswordStrength = () => {
    const requirements = Object.values(passwordStrength);
    const metCount = requirements.filter(Boolean).length;
    
    if (metCount === 0) return { level: 'none', color: 'bg-gray-200', text: '' };
    if (metCount <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (metCount <= 4) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'phone') {
      // Format phone number as 773-312-3687
      const phoneNumber = value.replace(/\D/g, '');
      let formattedPhone = phoneNumber;
      
      if (phoneNumber.length >= 6) {
        formattedPhone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      } else if (phoneNumber.length >= 3) {
        formattedPhone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Check password strength when password field changes
      if (name === 'password') {
        checkPasswordStrength(value);
      }
    }
  };

  const handleSocialSignUp = async (provider: 'google') => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use Firebase Google auth like the general sign-up page
      const result = await firebaseAuth.signInWithGoogle();
      
      if (result.error || !result.user) {
        setError(result.error || 'Google sign-up failed. Please try again.');
        return;
      }
      
      // Store landlord data in localStorage for consistency
      const landlordData = {
        ...result.user,
        userType: 'landlord',
        idVerificationStatus: 'not_submitted',
        subscriptionStatus: 'inactive',
        plan: 'none',
        company: '',
        phone: '',
        propertyCount: '1-5'
      };
      
      localStorage.setItem('credora_verified_landlord', JSON.stringify(landlordData));
      localStorage.setItem('credora_session', 'firebase_session');
      
      console.log('✅ Google sign-up successful for landlord:', result.user.email);
      
      // Redirect to landlord dashboard
      router.push('/landlords/dashboard');
    } catch (err: any) {
      console.error(`❌ Landlord ${provider} sign-up error:`, err);
      setError(`Failed to sign up with ${provider}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Send verification email
      const response = await fetch('/api/auth/landlords/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          propertyCount: formData.propertyCount,
          phone: formData.phone,
          marketingEmails: formData.marketingEmails
        }),
      });

      if (response.ok) {
        // Store unverified landlord data
        const landlordData = {
          ...formData,
          signedUpAt: new Date().toISOString(),
          emailVerified: false,
          userType: 'landlord'
        };
        
        localStorage.setItem('credora_unverified_landlord', JSON.stringify(landlordData));
        console.log('✅ Landlord verification email sent:', formData.email);
        setShowVerificationMessage(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification email');
      }
    } catch (err) {
      console.error('❌ Landlord sign-up error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/landlords/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          propertyCount: formData.propertyCount,
          phone: formData.phone,
          marketingEmails: formData.marketingEmails
        }),
      });

      if (response.ok) {
        console.log('✅ Landlord verification email resent:', formData.email);
      } else {
        throw new Error('Failed to resend verification email');
      }
    } catch (err) {
      console.error('❌ Resend verification error:', err);
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-slate-800 mb-8 inline-block">
            Credora
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Join Our Landlord Network
          </h2>
          <p className="text-lg text-slate-600">
            Start listing properties and connecting with guaranteed tenants
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {showVerificationMessage ? (
            /* Email Verification Message */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Check Your Email</h3>
              <p className="text-slate-600 mb-6">
                We've sent a verification link to <strong>{formData.email}</strong>. 
                Please check your inbox and click the link to activate your landlord account.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
                
                <Link
                  href="/auth/landlords/signin"
                  className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-50 transition-all inline-block text-center"
                >
                  Back to Sign In
                </Link>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Social Sign-Up Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignUp('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or create account with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Business Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                placeholder="your.email@company.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                placeholder="855-997-6615"
              />
            </div>

            {/* Business Information */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Business Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                    Company/Organization Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                    placeholder="Smith Properties LLC"
                  />
                </div>

                <div>
                  <label htmlFor="propertyCount" className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Properties *
                  </label>
                  <select
                    id="propertyCount"
                    name="propertyCount"
                    required
                    value={formData.propertyCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5 properties</option>
                    <option value="6-20">6-20 properties</option>
                    <option value="21-50">21-50 properties</option>
                    <option value="51-100">51-100 properties</option>
                    <option value="100+">100+ properties</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Security</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                      placeholder="Create strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Password Strength</span>
                        <span className={`text-sm font-medium ${
                          getPasswordStrength().level === 'weak' ? 'text-red-600' :
                          getPasswordStrength().level === 'medium' ? 'text-yellow-600' :
                          getPasswordStrength().level === 'strong' ? 'text-green-600' : 'text-slate-600'
                        }`}>
                          {getPasswordStrength().text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength().color}`}
                          style={{ width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="grid grid-cols-1 gap-1 text-sm">
                        <div className={`flex items-center ${passwordStrength.minLength ? 'text-green-600' : 'text-slate-400'}`}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-slate-400'}`}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-slate-400'}`}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          One number
                        </div>
                        <div className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-slate-400'}`}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      <div className={`flex items-center text-sm ${
                        formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {formData.password === formData.confirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-3 text-sm text-slate-700">
                  I agree to Credora's{' '}
                  <Link href="/terms" className="text-slate-700 font-semibold hover:text-slate-900 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-slate-700 font-semibold hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </Link>
                  *
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="marketingEmails"
                  name="marketingEmails"
                  type="checkbox"
                  checked={formData.marketingEmails}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="marketingEmails" className="ml-3 text-sm text-slate-700">
                  Send me updates about new features, tenant matching opportunities, and landlord resources
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Already have a landlord account?{' '}
              <Link href="/auth/landlords/signin" className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
            </>
          )}
        </div>


        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-slate-800 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
