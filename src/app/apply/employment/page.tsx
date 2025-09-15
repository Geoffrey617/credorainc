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
  employmentStatus: string;
  // Employed fields
  employerName: string;
  jobTitle: string;
  lengthOfEmployment: string;
  annualIncome: string;
  // Self-employed fields
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  selfEmployedIncome: string;
  // Retired fields
  retirementIncome: string;
  pensionSource: string;
  socialSecurityIncome: string;
  // Disability fields
  disabilityDuration: string;
  disabilityType: string;
  disabilityBenefits: string;
  // Student fields
  schoolName: string;
  studentType: string;
  academicYear: string;
}

export default function EmploymentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    employmentStatus: '',
    // Employed fields
    employerName: '',
    jobTitle: '',
    lengthOfEmployment: '',
    annualIncome: '',
    // Self-employed fields
    businessName: '',
    businessType: '',
    yearsInBusiness: '',
    selfEmployedIncome: '',
    // Retired fields
    retirementIncome: '',
    pensionSource: '',
    socialSecurityIncome: '',
    // Disability fields
    disabilityDuration: '',
    disabilityType: '',
    disabilityBenefits: '',
    // Student fields
    schoolName: '',
    studentType: '',
    academicYear: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        employmentStatus: parsedData.employmentStatus || '',
        employerName: parsedData.employerName || '',
        jobTitle: parsedData.jobTitle || '',
        lengthOfEmployment: parsedData.lengthOfEmployment || '',
        annualIncome: parsedData.annualIncome || '',
        schoolName: parsedData.schoolName || '',
        studentType: parsedData.studentType || '',
        academicYear: parsedData.academicYear || ''
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
    
    if (formData.employmentStatus === 'employed' || formData.employmentStatus === 'employed_part_time') {
      if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
      if (!formData.lengthOfEmployment) newErrors.lengthOfEmployment = 'Length of employment is required';
      if (!formData.annualIncome.trim()) newErrors.annualIncome = 'Annual income is required';
    }
    
    if (formData.employmentStatus === 'self_employed') {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
      if (!formData.yearsInBusiness) newErrors.yearsInBusiness = 'Years in business is required';
      if (!formData.selfEmployedIncome.trim()) newErrors.selfEmployedIncome = 'Annual income is required';
    }
    
    if (formData.employmentStatus === 'retired') {
      if (!formData.retirementIncome.trim()) newErrors.retirementIncome = 'Retirement income is required';
      if (!formData.pensionSource.trim()) newErrors.pensionSource = 'Pension source is required';
    }
    
    if (formData.employmentStatus === 'disability') {
      if (!formData.disabilityDuration) newErrors.disabilityDuration = 'Disability duration is required';
      if (!formData.disabilityType.trim()) newErrors.disabilityType = 'Disability type is required';
      if (!formData.disabilityBenefits.trim()) newErrors.disabilityBenefits = 'Disability benefits amount is required';
    }
    
    if (formData.employmentStatus === 'student') {
      if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
      if (!formData.studentType) newErrors.studentType = 'Student type is required';
      if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';
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
      
      // Navigate to rental info page
      router.push('/apply/rental');
    }
  };

  const handleBack = () => {
    // Save current data before going back
    const savedData = localStorage.getItem('credora_application_form');
    const existingData = savedData ? JSON.parse(savedData) : {};
    const updatedData = { ...existingData, ...formData };
    localStorage.setItem('credora_application_form', JSON.stringify(updatedData));
    
    router.push('/apply/personal');
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers || numbers === '0') return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numbers));
  };

  // Get academic year options based on student type
  const getAcademicYearOptions = () => {
    switch (formData.studentType) {
      case 'undergraduate':
        return [
          { value: 'freshman', label: 'Freshman (1st year)' },
          { value: 'sophomore', label: 'Sophomore (2nd year)' },
          { value: 'junior', label: 'Junior (3rd year)' },
          { value: 'senior', label: 'Senior (4th year)' }
        ];
      case 'graduate':
        return [
          { value: 'graduate_1', label: 'Graduate 1st year' },
          { value: 'graduate_2', label: 'Graduate 2nd year' },
          { value: 'graduate_3_plus', label: 'Graduate 3+ years' }
        ];
      case 'doctoral':
        return [
          { value: 'phd_1', label: 'PhD 1st year' },
          { value: 'phd_2', label: 'PhD 2nd year' },
          { value: 'phd_3', label: 'PhD 3rd year' },
          { value: 'phd_4', label: 'PhD 4th year' },
          { value: 'phd_5_plus', label: 'PhD 5+ years' },
          { value: 'dissertation', label: 'Dissertation phase' }
        ];
      default:
        return [];
    }
  };

  const getCurrentStepNumber = (): number => {
    return 2;
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
              <h1 className="text-2xl font-bold text-slate-900">Employment Information</h1>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Employment Information</h2>
            <p className="text-slate-600">Please provide your employment details for income verification.</p>
          </div>

          <form className="space-y-6">
            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                  errors.employmentStatus ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Select employment status</option>
                <option value="employed">Employed (Full-time)</option>
                <option value="employed_part_time">Employed (Part-time)</option>
                <option value="self_employed">Self-Employed</option>
                <option value="student">Student</option>
                <option value="disability">Disability (Disability Benefit)</option>
                <option value="retired">Retired</option>
              </select>
              {errors.employmentStatus && <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>}
            </div>

            {/* Employment Details (conditional) */}
            {(formData.employmentStatus === 'employed' || formData.employmentStatus === 'employed_part_time') && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Employer/Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                        errors.employerName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Company Name"
                    />
                    {errors.employerName && <p className="text-red-500 text-sm mt-1">{errors.employerName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                        errors.jobTitle ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Software Engineer"
                    />
                    {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Length of Employment <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="lengthOfEmployment"
                      value={formData.lengthOfEmployment}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                        errors.lengthOfEmployment ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select length of employment</option>
                      <option value="less_than_3_months">Less than 3 months</option>
                      <option value="3_to_6_months">3-6 months</option>
                      <option value="6_months_to_1_year">6 months - 1 year</option>
                      <option value="1_to_2_years">1-2 years</option>
                      <option value="2_to_5_years">2-5 years</option>
                      <option value="more_than_5_years">More than 5 years</option>
                    </select>
                    {errors.lengthOfEmployment && <p className="text-red-500 text-sm mt-1">{errors.lengthOfEmployment}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Annual Income <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="text"
                        name="annualIncome"
                        value={formatCurrency(formData.annualIncome)}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, annualIncome: e.target.value.replace(/[^0-9]/g, '') }));
                          clearError('annualIncome');
                        }}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                          errors.annualIncome ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="65,000"
                      />
                    </div>
                    {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Self-Employed Information (conditional) */}
            {formData.employmentStatus === 'self_employed' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.businessName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Your Business LLC"
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Industry <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.businessType ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Consulting, Retail, etc."
                    />
                    {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Years in Business <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.yearsInBusiness ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select years</option>
                      <option value="less_than_1">Less than 1 year</option>
                      <option value="1_2">1-2 years</option>
                      <option value="3_5">3-5 years</option>
                      <option value="6_10">6-10 years</option>
                      <option value="more_than_10">More than 10 years</option>
                    </select>
                    {errors.yearsInBusiness && <p className="text-red-500 text-sm mt-1">{errors.yearsInBusiness}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Annual Income <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="text"
                        name="selfEmployedIncome"
                        value={formatCurrency(formData.selfEmployedIncome)}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, selfEmployedIncome: e.target.value.replace(/[^0-9]/g, '') }));
                          clearError('selfEmployedIncome');
                        }}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                          errors.selfEmployedIncome ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="75,000"
                      />
                    </div>
                    {errors.selfEmployedIncome && <p className="text-red-500 text-sm mt-1">{errors.selfEmployedIncome}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Retired Information (conditional) */}
            {formData.employmentStatus === 'retired' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Retirement Income <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="text"
                        name="retirementIncome"
                        value={formatCurrency(formData.retirementIncome)}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, retirementIncome: e.target.value.replace(/[^0-9]/g, '') }));
                          clearError('retirementIncome');
                        }}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                          errors.retirementIncome ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="3,500"
                      />
                    </div>
                    {errors.retirementIncome && <p className="text-red-500 text-sm mt-1">{errors.retirementIncome}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pension/Retirement Source <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pensionSource"
                      value={formData.pensionSource}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.pensionSource ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="401k, Pension Fund, IRA, etc."
                    />
                    {errors.pensionSource && <p className="text-red-500 text-sm mt-1">{errors.pensionSource}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Social Security Income (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="text"
                        name="socialSecurityIncome"
                        value={formatCurrency(formData.socialSecurityIncome)}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, socialSecurityIncome: e.target.value.replace(/[^0-9]/g, '') }));
                          clearError('socialSecurityIncome');
                        }}
                        className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        placeholder="1,200"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Disability Information (conditional) */}
            {formData.employmentStatus === 'disability' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      How long have you been receiving disability benefits? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="disabilityDuration"
                      value={formData.disabilityDuration}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.disabilityDuration ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select duration</option>
                      <option value="less_than_1_year">Less than 1 year</option>
                      <option value="1_2_years">1-2 years</option>
                      <option value="3_5_years">3-5 years</option>
                      <option value="6_10_years">6-10 years</option>
                      <option value="more_than_10_years">More than 10 years</option>
                    </select>
                    {errors.disabilityDuration && <p className="text-red-500 text-sm mt-1">{errors.disabilityDuration}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type of Disability <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="disabilityType"
                      value={formData.disabilityType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.disabilityType ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select disability type</option>
                      <option value="ssdi">Social Security Disability Insurance (SSDI)</option>
                      <option value="ssi">Supplemental Security Income (SSI)</option>
                      <option value="veterans">Veterans Disability Benefits</option>
                      <option value="workers_comp">Workers' Compensation</option>
                      <option value="other">Other Disability Benefits</option>
                    </select>
                    {errors.disabilityType && <p className="text-red-500 text-sm mt-1">{errors.disabilityType}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Disability Benefits <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="text"
                        name="disabilityBenefits"
                        value={formatCurrency(formData.disabilityBenefits)}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, disabilityBenefits: e.target.value.replace(/[^0-9]/g, '') }));
                          clearError('disabilityBenefits');
                        }}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                          errors.disabilityBenefits ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="1,200"
                      />
                    </div>
                    {errors.disabilityBenefits && <p className="text-red-500 text-sm mt-1">{errors.disabilityBenefits}</p>}
                    <p className="text-slate-500 text-sm mt-1">Monthly disability benefit amount</p>
                  </div>
                </div>
              </>
            )}

            {/* Student Information (conditional) */}
            {formData.employmentStatus === 'student' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white ${
                        errors.schoolName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="University Name"
                    />
                    {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Student Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="studentType"
                      value={formData.studentType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                        errors.studentType ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select student type</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="doctoral">Doctoral</option>
                    </select>
                    {errors.studentType && <p className="text-red-500 text-sm mt-1">{errors.studentType}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white ${
                      errors.academicYear ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select academic year</option>
                    {getAcademicYearOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.academicYear && <p className="text-red-500 text-sm mt-1">{errors.academicYear}</p>}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Personal Info
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
