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
import { getSortedUSStates } from '../../utils/us-states';
import AddressAutocomplete from '../../components/AddressAutocomplete';

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
  desiredAddress: string;
  desiredCity: string;
  desiredState: string;
  zipCode: string;
  monthlyRent: string;
  moveInDate: string;
  landlordName: string;
  landlordPhone: string;
  propertyWebsite: string;
}

export default function RentalInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    desiredAddress: '',
    desiredCity: '',
    desiredState: '',
    zipCode: '',
    monthlyRent: '',
    moveInDate: '',
    landlordName: '',
    landlordPhone: '',
    propertyWebsite: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        desiredAddress: parsedData.desiredAddress || '',
        desiredCity: parsedData.desiredCity || '',
        desiredState: parsedData.desiredState || '',
        zipCode: parsedData.zipCode || '',
        monthlyRent: parsedData.monthlyRent || '',
        moveInDate: parsedData.moveInDate || '',
        landlordName: parsedData.landlordName || '',
        landlordPhone: parsedData.landlordPhone || '',
        propertyWebsite: parsedData.propertyWebsite || ''
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
  };

  // Handle address autocomplete selection
  const handleAddressSelect = (addressData: any) => {
    setFormData(prev => ({
      ...prev,
      desiredAddress: addressData.street, // Use street only, not fullAddress
      desiredCity: addressData.city,
      desiredState: addressData.state,
      zipCode: addressData.zipCode
    }));
    
    // Clear related errors
    clearError('desiredAddress');
    clearError('desiredCity');
    clearError('desiredState');
    clearError('zipCode');
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.desiredAddress.trim()) newErrors.desiredAddress = 'Property address is required';
    if (!formData.desiredCity.trim()) newErrors.desiredCity = 'City is required';
    if (!formData.desiredState) newErrors.desiredState = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.monthlyRent.trim()) newErrors.monthlyRent = 'Monthly rent is required';
    if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
    if (!formData.landlordName.trim()) newErrors.landlordName = 'Landlord name is required';
    if (!formData.landlordPhone.trim()) newErrors.landlordPhone = 'Landlord phone is required';
    if (!formData.propertyWebsite.trim()) newErrors.propertyWebsite = 'Property website is required';
    
    // Phone validation
    if (formData.landlordPhone && !/^\d{10}$/.test(formData.landlordPhone.replace(/\D/g, ''))) {
      newErrors.landlordPhone = 'Please enter a valid 10-digit phone number';
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
      
      // Navigate to documents page
      router.push('/apply/documents');
    }
  };

  const handleBack = () => {
    // Save current data before going back
    const savedData = localStorage.getItem('credora_application_form');
    const existingData = savedData ? JSON.parse(savedData) : {};
    const updatedData = { ...existingData, ...formData };
    localStorage.setItem('credora_application_form', JSON.stringify(updatedData));
    
    router.push('/apply/employment');
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers || numbers === '0') return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numbers));
  };


  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const getCurrentStepNumber = (): number => {
    return 3;
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
              <h1 className="text-2xl font-bold text-slate-900">Rental Information</h1>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Rental Property Information</h2>
            <p className="text-slate-600">Tell us about the property you want to rent.</p>
          </div>

          <form className="space-y-6">
            {/* Property Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Property Address <span className="text-red-500">*</span>
              </label>
              <AddressAutocomplete
                value={formData.desiredAddress}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, desiredAddress: value }));
                  clearError('desiredAddress');
                }}
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing the property address..."
                error={errors.desiredAddress}
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
                  name="desiredCity"
                  value={formData.desiredCity}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                    errors.desiredCity ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="New York"
                />
                {errors.desiredCity && <p className="text-red-500 text-sm mt-1">{errors.desiredCity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="desiredState"
                  value={formData.desiredState}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                    errors.desiredState ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {getSortedUSStates().map(state => (
                    <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                  ))}
                </select>
                {errors.desiredState && <p className="text-red-500 text-sm mt-1">{errors.desiredState}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                    errors.zipCode ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="10001"
                  maxLength={5}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            {/* Rent and Move-in Date */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Rent <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="text"
                    name="monthlyRent"
                    value={formatCurrency(formData.monthlyRent)}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, monthlyRent: e.target.value.replace(/[^0-9]/g, '') }));
                      clearError('monthlyRent');
                    }}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                      errors.monthlyRent ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="2,500"
                  />
                </div>
                {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Desired Move-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                    errors.moveInDate ? 'border-red-500' : 'border-slate-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.moveInDate && <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>}
              </div>
            </div>

            {/* Landlord Information */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Landlord/Property Management Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Landlord/Property Management Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="landlordName"
                    value={formData.landlordName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                      errors.landlordName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="John Smith or ABC Property Management"
                  />
                  {errors.landlordName && <p className="text-red-500 text-sm mt-1">{errors.landlordName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="landlordPhone"
                    value={formatPhone(formData.landlordPhone)}
                    onChange={(e) => setFormData(prev => ({ ...prev, landlordPhone: e.target.value.replace(/\D/g, '') }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-slate-900 bg-white ${
                      errors.landlordPhone ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                  />
                  {errors.landlordPhone && <p className="text-red-500 text-sm mt-1">{errors.landlordPhone}</p>}
                </div>
              </div>
              
              {/* Property Website */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="propertyWebsite"
                  value={formData.propertyWebsite}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                    errors.propertyWebsite ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="https://example.com/property"
                />
                {errors.propertyWebsite && <p className="text-red-500 text-sm mt-1">{errors.propertyWebsite}</p>}
                <p className="text-slate-500 text-sm mt-1">
                  Link to property listing or management website
                </p>
              </div>
              
              <p className="text-slate-500 text-sm mt-3">
                We may contact your landlord/Property Management to verify rental details.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Employment
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
