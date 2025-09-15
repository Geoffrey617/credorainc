'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
  HomeIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { getSortedUSStates } from '@/utils/us-states';
import AddressAutocomplete from '@/components/AddressAutocomplete';

// Application steps
const steps = [
  { 
    id: 1, 
    name: 'Personal Info', 
    description: 'Tell us about yourself', 
    icon: UserIcon,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '2-3 min'
  },
  { 
    id: 2, 
    name: 'Employment', 
    description: 'Your work & income details', 
    icon: BriefcaseIcon,
    color: 'from-emerald-500 to-emerald-600',
    estimatedTime: '3-4 min'
  },
  { 
    id: 3, 
    name: 'Rental Info', 
    description: 'Your desired property', 
    icon: HomeIcon,
    color: 'from-gray-600 to-gray-800',
    estimatedTime: '2-3 min'
  },
  { 
    id: 4, 
    name: 'Documents', 
    description: 'Upload required files', 
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '3-4 min'
  },
  { 
    id: 5, 
    name: 'Review', 
    description: 'Verify your application', 
    icon: ShieldCheckIcon,
    color: 'from-gray-600 to-gray-800',
    estimatedTime: '1-2 min'
  },
  { 
    id: 6, 
    name: 'Submit', 
    description: 'Pay application fee', 
    icon: CreditCardIcon,
    color: 'from-pink-500 to-pink-600',
    estimatedTime: '2-3 min'
  }
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  citizenshipStatus: string;
  internationalStudentType: string;
  ssn: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
}

export default function PersonalInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    citizenshipStatus: '',
    internationalStudentType: '',
    ssn: '',
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentZip: ''
  });
  const [showSSN, setShowSSN] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        dateOfBirth: parsedData.dateOfBirth || '',
        citizenshipStatus: parsedData.citizenshipStatus || '',
        internationalStudentType: parsedData.internationalStudentType || '',
        ssn: parsedData.ssn || '',
        currentAddress: parsedData.currentAddress || '',
        currentCity: parsedData.currentCity || '',
        currentState: parsedData.currentState || '',
        currentZip: parsedData.currentZip || ''
      }));
    }
  }, []);

  // Helper function to clear errors
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    clearError(name);
    
    // Clear related errors for citizenship status
    if (name === 'citizenshipStatus' && value !== 'international_student') {
      clearError('internationalStudentType');
    }
  };

  // Handle address autocomplete selection
  const handleAddressSelect = (addressData: any) => {
    setFormData(prev => ({
      ...prev,
      currentAddress: addressData.street, // Use street only, not fullAddress
      currentCity: addressData.city,
      currentState: addressData.state,
      currentZip: addressData.zipCode
    }));
    
    // Clear related errors
    clearError('currentAddress');
    clearError('currentCity');
    clearError('currentState');
    clearError('currentZip');
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.citizenshipStatus) newErrors.citizenshipStatus = 'Citizenship status is required';
    
    // International Student validation
    if (formData.citizenshipStatus === 'international_student' && !formData.internationalStudentType) {
      newErrors.internationalStudentType = 'International student type is required';
    }
    
    // SSN is only required if not "International Student Without SSN"
    const isInternationalStudentWithoutSSN = formData.citizenshipStatus === 'international_student' && formData.internationalStudentType === 'without_ssn';
    if (!isInternationalStudentWithoutSSN && !formData.ssn.trim()) {
      newErrors.ssn = 'SSN is required';
    }
    if (!formData.currentAddress.trim()) newErrors.currentAddress = 'Current address is required';
    if (!formData.currentCity.trim()) newErrors.currentCity = 'City is required';
    if (!formData.currentState) newErrors.currentState = 'State is required';
    if (!formData.currentZip.trim()) newErrors.currentZip = 'ZIP code is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // SSN validation (only for those who need SSN)
    if (!isInternationalStudentWithoutSSN && formData.ssn && !/^\d{9}$/.test(formData.ssn.replace(/\D/g, ''))) {
      newErrors.ssn = 'Please enter a valid 9-digit SSN';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save to localStorage
      const savedData = localStorage.getItem('credora_application_form');
      const existingData = savedData ? JSON.parse(savedData) : {};
      const updatedData = { ...existingData, ...formData };
      localStorage.setItem('credora_application_form', JSON.stringify(updatedData));
      
      // Navigate to employment page
      router.push('/apply/employment');
    }
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const getCurrentStepNumber = (): number => {
    return 1;
  };
  
  const getTotalSteps = (): number => {
    return 6;
  };
  
  const getProgressPercentage = (): number => {
    return (getCurrentStepNumber() / getTotalSteps()) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 pt-8">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Personal Information</h1>
              <p className="text-slate-600 mt-1">Step {getCurrentStepNumber()} of {getTotalSteps()}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Progress</div>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Personal Information</h2>
            <p className="text-slate-600">Please provide your basic personal information for verification.</p>
          </div>

          <form className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.firstName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.lastName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formatPhone(formData.phone)}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }));
                    clearError('phone');
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Date of Birth and Citizenship */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Citizenship Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="citizenshipStatus"
                  value={formData.citizenshipStatus}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.citizenshipStatus ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select citizenship status</option>
                  <option value="us_citizen">U.S. Citizen</option>
                  <option value="permanent_resident">Permanent Resident</option>
                  <option value="work_visa_h1b">Work Visa Holder (H-1B)</option>
                  <option value="international_student">International Student</option>
                </select>
                {errors.citizenshipStatus && <p className="text-red-500 text-sm mt-1">{errors.citizenshipStatus}</p>}
              </div>
            </div>

            {/* International Student Type (conditional) */}
            {formData.citizenshipStatus === 'international_student' && (
              <div className="grid md:grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    International Student Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="internationalStudentType"
                    value={formData.internationalStudentType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                      errors.internationalStudentType ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select student type</option>
                    <option value="with_ssn">International Student With SSN</option>
                    <option value="without_ssn">International Student Without SSN</option>
                  </select>
                  {errors.internationalStudentType && <p className="text-red-500 text-sm mt-1">{errors.internationalStudentType}</p>}
                </div>
              </div>
            )}


            {/* SSN (conditional - hidden for International Student Without SSN) */}
            {!(formData.citizenshipStatus === 'international_student' && formData.internationalStudentType === 'without_ssn') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Social Security Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSSN ? "text" : "password"}
                  name="ssn"
                  value={showSSN ? formatSSN(formData.ssn) : formData.ssn.replace(/./g, '•')}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, ssn: e.target.value.replace(/\D/g, '') }));
                    clearError('ssn');
                  }}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.ssn ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="123-45-6789"
                  maxLength={11}
                />
                <button
                  type="button"
                  onClick={() => setShowSSN(!showSSN)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showSSN ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878m4.242 4.242L8.464 8.464m5.656 5.656l1.415 1.415" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>}
              <p className="text-slate-500 text-sm mt-1">Your SSN is encrypted and secure. Required for background check.</p>
            </div>
            )}

            {/* Current Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Address <span className="text-red-500">*</span>
              </label>
              <AddressAutocomplete
                value={formData.currentAddress}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, currentAddress: value }));
                  clearError('currentAddress');
                }}
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing your address..."
                error={errors.currentAddress}
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.currentCity ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="New York"
                />
                {errors.currentCity && <p className="text-red-500 text-sm mt-1">{errors.currentCity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="currentState"
                  value={formData.currentState}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.currentState ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {getSortedUSStates().map(state => (
                    <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                  ))}
                </select>
                {errors.currentState && <p className="text-red-500 text-sm mt-1">{errors.currentState}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="currentZip"
                  value={formData.currentZip}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white ${
                    errors.currentZip ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="10001"
                  maxLength={5}
                />
                {errors.currentZip && <p className="text-red-500 text-sm mt-1">{errors.currentZip}</p>}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
