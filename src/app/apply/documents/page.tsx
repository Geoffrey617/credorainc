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
  CloudArrowUpIcon,
  XMarkIcon
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
  employmentStatus: string;
  citizenshipStatus: string;
  internationalStudentType: string;
  governmentIdFile: File | null;
  studentIdFile: File | null;
  incomeVerificationFile: File | null;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    employmentStatus: '',
    citizenshipStatus: '',
    internationalStudentType: '',
    governmentIdFile: null,
    studentIdFile: null,
    incomeVerificationFile: null,
  });
  const [completedSteps] = useState<string[]>(['personal', 'employment', 'rental']);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Load form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        employmentStatus: parsed.employmentStatus || '',
        citizenshipStatus: parsed.citizenshipStatus || '',
        internationalStudentType: parsed.internationalStudentType || '',
      }));
    }
  }, []);

  const handleFileUpload = (fileType: keyof FormData, file: File) => {
    // File size validation
    const maxSize = fileType === 'incomeVerificationFile' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for income, 10MB for others
    
    if (file.size > maxSize) {
      const maxSizeMB = fileType === 'incomeVerificationFile' ? '100MB' : '10MB';
      alert(`File size too large. Maximum allowed size is ${maxSizeMB}.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleDrop = (e: React.DragEvent, fileType: keyof FormData) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(fileType, files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent, fileType: string) => {
    e.preventDefault();
    setDragOver(fileType);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removeFile = (fileType: keyof FormData) => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
  };

  const getGovernmentIdDescription = () => {
    if (formData.citizenshipStatus === 'international student') {
      return "Driver's license (front & back), state ID (front & back), or passport for international students";
    }
    return "Driver's license (front & back), state ID (front & back), or passport";
  };

  const getIncomeVerificationDescription = () => {
    if (formData.employmentStatus === 'student') {
      return 'Financial aid letter, scholarship award letter, Pay stub, W-2, or bank statements';
    }
    return 'Pay stub, W-2, Tax return or benefit award letter';
  };

  const getCurrentStepNumber = (): number => {
    return 4;
  };
  
  const getTotalSteps = (): number => {
    return 6;
  };
  
  const getProgressPercentage = (): number => {
    return (completedSteps.length / getTotalSteps()) * 100;
  };

  const nextStep = () => {
    router.push('/apply/review');
  };

  const prevStep = () => {
    router.push('/apply');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Progress Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Lease Guarantor Application
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Step {getCurrentStepNumber()} of {getTotalSteps()} • {steps.find(s => s.name.toLowerCase().includes('documents'))?.estimatedTime} remaining
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const stepKey = ['personal', 'employment', 'rental', 'documents', 'review', 'submit'][index];
              const isCompleted = completedSteps.includes(stepKey);
              const isCurrent = stepKey === 'documents';
              const StepIcon = step.icon;
              
              return (
                <div key={step.name} className="flex flex-col items-center min-w-0 flex-shrink-0">
                  <div className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-2
                    ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-200' 
                        : isCurrent 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg shadow-gray-300 scale-110' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircleIcon className={`w-6 h-6 text-white`} />
                    ) : (
                      <StepIcon className={`w-6 h-6 ${
                        isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className={`text-xs ${
                      isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.estimatedTime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern Application Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 transition-all duration-500">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Required Documents</h2>
              <p className="text-gray-600">Please upload clear, legible copies of the required documents. All files are encrypted and stored securely.</p>
            </div>

            <div className="space-y-8">
              {/* Government ID */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Government-Issued ID *</h3>
                  <p className="text-sm text-gray-600 mb-4">{getGovernmentIdDescription()}</p>
                </div>
                
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                    ${dragOver === 'governmentId' 
                      ? 'border-gray-400 bg-gray-100' 
                      : formData.governmentIdFile 
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  onDrop={(e) => handleDrop(e, 'governmentIdFile')}
                  onDragOver={(e) => handleDragOver(e, 'governmentId')}
                  onDragLeave={handleDragLeave}
                >
                  {formData.governmentIdFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{formData.governmentIdFile.name}</p>
                          <p className="text-sm text-gray-500">{(formData.governmentIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile('governmentIdFile')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB each</p>
                      <label className="inline-block">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('governmentIdFile', file);
                          }}
                        />
                        <span className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 cursor-pointer transition-all duration-200 shadow-lg shadow-gray-200">
                          Choose File
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Student ID - Required for Students Only */}
              {formData.employmentStatus === 'student' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Student ID *</h3>
                    <p className="text-sm text-gray-600 mb-4">Current, unexpired student identification card (required for all students)</p>
                  </div>
                  
                  <div
                    className={`
                      border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                      ${dragOver === 'studentId' 
                        ? 'border-gray-400 bg-gray-100' 
                        : formData.studentIdFile 
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    onDrop={(e) => handleDrop(e, 'studentIdFile')}
                    onDragOver={(e) => handleDragOver(e, 'studentId')}
                    onDragLeave={handleDragLeave}
                  >
                    {formData.studentIdFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{formData.studentIdFile.name}</p>
                            <p className="text-sm text-gray-500">{(formData.studentIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile('studentIdFile')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                        <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB each</p>
                        <label className="inline-block">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('studentIdFile', file);
                            }}
                          />
                          <span className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 cursor-pointer transition-all duration-200 shadow-lg shadow-gray-200">
                            Choose File
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Income Verification */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof of Income *</h3>
                  <p className="text-sm text-gray-600 mb-4">{getIncomeVerificationDescription()}</p>
                </div>
                
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                    ${dragOver === 'incomeVerification' 
                      ? 'border-gray-400 bg-gray-100' 
                      : formData.incomeVerificationFile 
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  onDrop={(e) => handleDrop(e, 'incomeVerificationFile')}
                  onDragOver={(e) => handleDragOver(e, 'incomeVerification')}
                  onDragLeave={handleDragLeave}
                >
                  {formData.incomeVerificationFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{formData.incomeVerificationFile.name}</p>
                          <p className="text-sm text-gray-500">{(formData.incomeVerificationFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile('incomeVerificationFile')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 100MB each</p>
                      <label className="inline-block">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('incomeVerificationFile', file);
                          }}
                        />
                        <span className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 cursor-pointer transition-all duration-200 shadow-lg shadow-gray-200">
                          Choose File
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modern Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span>Previous</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg shadow-gray-200 hover:shadow-gray-300"
                >
                  <span>Continue</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
