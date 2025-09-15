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
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Modern application steps with enhanced descriptions
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
  // Personal Information
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
  
  // Employment
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  lengthOfEmployment: string;
  annualIncome: string;
  schoolName: string;
  studentType: string;
  academicYear: string;
  
  // Rental Info
  desiredAddress: string;
  desiredCity: string;
  desiredState: string;
  zipCode: string;
  monthlyRent: string;
  moveInDate: string;
  landlordName: string;
  landlordPhone: string;
  propertyWebsite: string;
  
  // Employment - Additional fields
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  selfEmployedIncome: string;
  retirementIncome: string;
  pensionSource: string;
  socialSecurityIncome: string;
  disabilityDuration: string;
  disabilityType: string;
  disabilityBenefits: string;
  
  // Documents
  documents?: {
    governmentId: string;
    incomeVerification: string;
    studentId: string;
  };
}

export default function ReviewPage() {
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
    currentZip: '',
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    lengthOfEmployment: '',
    annualIncome: '',
    schoolName: '',
    studentType: '',
    academicYear: '',
    desiredAddress: '',
    desiredCity: '',
    desiredState: '',
    zipCode: '',
    monthlyRent: '',
    moveInDate: '',
    landlordName: '',
    landlordPhone: '',
    propertyWebsite: '',
    
    // Employment - Additional fields
    businessName: '',
    businessType: '',
    yearsInBusiness: '',
    selfEmployedIncome: '',
    retirementIncome: '',
    pensionSource: '',
    socialSecurityIncome: '',
    disabilityDuration: '',
    disabilityType: '',
    disabilityBenefits: ''
  });
  const [completedSteps] = useState<string[]>(['personal', 'employment', 'rental', 'documents']);
  const [showSSN, setShowSSN] = useState(false);

  // Load form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, []);

  const formatSSN = (ssn: string) => {
    if (!ssn) return '';
    const cleaned = ssn.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : ssn;
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : phone;
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    const number = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const getCurrentStepNumber = (): number => {
    return 5;
  };
  
  const getTotalSteps = (): number => {
    return 6;
  };
  
  const getProgressPercentage = (): number => {
    return (completedSteps.length / getTotalSteps()) * 100;
  };

  const nextStep = () => {
    router.push('/apply/submit');
  };

  const prevStep = () => {
    router.push('/apply/documents');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 pt-8">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Review Application</h1>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Review Your Application</h2>
            <p className="text-slate-600">Please review all information before submitting.</p>
          </div>
          <div className="space-y-6">

            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <p className="text-gray-900">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <p className="text-gray-900">{formatPhone(formData.phone)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <p className="text-gray-900">{formData.dateOfBirth}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Citizenship Status</label>
                    <p className="text-gray-900">{formData.citizenshipStatus}</p>
                  </div>
                  {formData.citizenshipStatus === 'international student' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Student Type</label>
                      <p className="text-gray-900">{formData.internationalStudentType}</p>
                    </div>
                  )}
                  {formData.citizenshipStatus !== 'international student' || formData.internationalStudentType === 'International student with SSN' ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        SSN
                        <button
                          onClick={() => setShowSSN(!showSSN)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          {showSSN ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </label>
                      <p className="text-gray-900">
                        {showSSN ? formatSSN(formData.ssn) : '•••-••-••••'}
                      </p>
                    </div>
                  ) : null}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Address</label>
                  <p className="text-gray-900">
                    {formData.currentAddress}, {formData.currentCity}, {formData.currentState} {formData.currentZip}
                  </p>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Employment Status</label>
                    <p className="text-gray-900">{formData.employmentStatus}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Annual Income</label>
                    <p className="text-gray-900">{formatCurrency(formData.annualIncome)}</p>
                  </div>
                  
                  {formData.employmentStatus === 'student' ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">School/University</label>
                        <p className="text-gray-900">{formData.schoolName}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Student Type</label>
                        <p className="text-gray-900">{formData.studentType}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Academic Year</label>
                        <p className="text-gray-900">{formData.academicYear}</p>
                      </div>
                    </>
                  ) : formData.employmentStatus !== 'retired' && formData.employmentStatus !== 'unemployed' ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Employer Name</label>
                        <p className="text-gray-900">{formData.employerName}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Job Title</label>
                        <p className="text-gray-900">{formData.jobTitle}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Length of Employment</label>
                        <p className="text-gray-900">{formData.lengthOfEmployment}</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Rental Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Rental Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">Property Address</label>
                    <p className="text-gray-900">{formData.desiredAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">City</label>
                    <p className="text-gray-900">{formData.desiredCity}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">State</label>
                    <p className="text-gray-900">{formData.desiredState}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                    <p className="text-gray-900">{formData.zipCode}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Monthly Rent</label>
                    <p className="text-gray-900">{formatCurrency(formData.monthlyRent)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Desired Move-in Date</label>
                    <p className="text-gray-900">{formData.moveInDate}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Landlord/Property Management</label>
                    <p className="text-gray-900">{formData.landlordName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Landlord Phone</label>
                    <p className="text-gray-900">{formatPhone(formData.landlordPhone)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Property Website</label>
                    <p className="text-gray-900">{formData.propertyWebsite}</p>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Document Status</h3>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${
                    formData.documents?.governmentId 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div>
                      <span className="text-gray-700 font-medium">Government-Issued ID</span>
                      {formData.documents?.governmentId && (
                        <p className="text-sm text-gray-500">{formData.documents.governmentId}</p>
                      )}
                    </div>
                    <span className={`flex items-center ${
                      formData.documents?.governmentId ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      {formData.documents?.governmentId ? 'Uploaded' : 'Required'}
                    </span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${
                    formData.documents?.incomeVerification 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div>
                      <span className="text-gray-700 font-medium">Proof of Income</span>
                      {formData.documents?.incomeVerification && (
                        <p className="text-sm text-gray-500">{formData.documents.incomeVerification}</p>
                      )}
                    </div>
                    <span className={`flex items-center ${
                      formData.documents?.incomeVerification ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      {formData.documents?.incomeVerification ? 'Uploaded' : 'Required'}
                    </span>
                  </div>
                  
                  {(formData.employmentStatus === 'student' || formData.citizenshipStatus === 'international_student') && (
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${
                      formData.documents?.studentId 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div>
                        <span className="text-gray-700 font-medium">Student ID</span>
                        {formData.documents?.studentId && (
                          <p className="text-sm text-gray-500">{formData.documents.studentId}</p>
                        )}
                      </div>
                      <span className={`flex items-center ${
                        formData.documents?.studentId ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        {formData.documents?.studentId ? 'Uploaded' : 'Required'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Documents
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
