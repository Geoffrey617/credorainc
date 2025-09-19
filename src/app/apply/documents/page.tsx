'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';
import { uploadSecureDocument } from '../../../lib/filestack-config';
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
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const [formData, setFormData] = useState<FormData>({
    employmentStatus: '',
    citizenshipStatus: '',
    internationalStudentType: '',
    governmentIdFile: null,
    studentIdFile: null,
    incomeVerificationFile: null,
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});
  const [completedSteps] = useState<string[]>(['personal', 'employment', 'rental']);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Load form data from database and localStorage
  useEffect(() => {
    const loadData = async () => {
      // Load basic form data from localStorage
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
      
      // Load documents from database if user is authenticated and not loading
      if (!authLoading && isAuthenticated && authUser?.id) {
        try {
          const response = await fetch(`/api/applications?userId=${authUser.id}`);
          const result = await response.json();
          
          if (response.ok && result.applications && result.applications.length > 0) {
            const latestApp = result.applications[0];
            
            if (latestApp.documents) {
              const createFileObject = (docInfo: any) => {
                if (!docInfo) return null;
                return {
                  name: docInfo.name,
                  size: docInfo.size || 1024 * 1024,
                  type: docInfo.type || 'application/pdf'
                } as File;
              };
              
              setFormData(prev => ({
                ...prev,
                governmentIdFile: createFileObject(latestApp.documents.governmentId),
                incomeVerificationFile: createFileObject(latestApp.documents.incomeVerification),
                studentIdFile: createFileObject(latestApp.documents.studentId),
              }));
            }
          }
        } catch (error) {
          console.error('Error loading documents from database:', error);
        }
      }
    };
    
    loadData();
  }, [authUser?.id, isAuthenticated, authLoading]);

  const handleFileUpload = async (fileType: keyof FormData, file: File) => {
    // File size validation
    const maxSize = fileType === 'incomeVerificationFile' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for income, 10MB for others
    
    if (file.size > maxSize) {
      const maxSizeMB = fileType === 'incomeVerificationFile' ? '100MB' : '10MB';
      alert(`File size too large. Maximum allowed size is ${maxSizeMB}.`);
      return;
    }

    // File type validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    // Show uploading state
    setUploading(prev => ({ ...prev, [fileType]: true }));
    
    // Clear any existing error for this field
    setErrors(prev => ({ ...prev, [fileType]: '' }));

    try {
      // Check authentication with loading state
      console.log('🔐 Auth state check:', { authLoading, isAuthenticated, userId: authUser?.id });
      
      if (authLoading) {
        alert('Please wait for authentication to load');
        return;
      }
      
      if (!isAuthenticated || !authUser?.id) {
        console.log('🚫 Authentication failed - redirecting to sign in');
        alert('Please sign in to upload documents');
        router.push('/auth/signin');
        return;
      }
      
      console.log('✅ Authentication verified, proceeding with upload');

      console.log('🛡️ Starting secure upload with Filestack virus scanning');
      
      // Upload with Filestack (includes virus scanning and security checks)
      const result = await uploadSecureDocument(
        file,
        fileType.replace('File', ''),
        (percentage) => {
          console.log(`📤 Upload progress: ${percentage}%`);
        },
        (secureResult) => {
          console.log('✅ Secure upload completed:', secureResult.filename);
        },
        (error) => {
          console.error('🚨 Security error:', error.message);
        }
      );
      
      // Update form data with Filestack secure file info
      setFormData(prev => ({
        ...prev,
        [fileType]: {
          name: result.filename,
          handle: result.handle,
          url: result.url,
          size: result.size,
          type: result.mimetype,
          secure: true,
          virusScanned: true
        } as any
      }));

      // Save ONLY file IDs to database (isolated from file content)
      if (authUser?.id) {
        const documentData = {
          userId: authUser.id,
          document_file_ids: {
            [fileType.replace('File', '')]: result.handle // ONLY store Filestack handle
          },
          document_status: {
            [fileType.replace('File', '')]: 'uploaded' // Simple status tracking
          }
        };

        // Save to database via applications API
        try {
          // First try to update existing application
          const updateResponse = await fetch('/api/applications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(documentData)
          });
          
          // If no application exists, create one
          if (!updateResponse.ok) {
            console.log('No existing application, creating new one');
            await fetch('/api/applications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: authUser.id,
                firstName: authUser.firstName || authUser.name?.split(' ')[0] || '',
                lastName: authUser.lastName || authUser.name?.split(' ')[1] || '',
                email: authUser.email || '',
                document_file_ids: {
                  [fileType.replace('File', '')]: result.handle // Store Filestack handle
                },
                document_status: {
                  [fileType.replace('File', '')]: 'uploaded'
                }
              })
            });
          }
        } catch (apiError) {
          console.error('API error:', apiError);
        }
      }

      console.log(`✅ ${fileType} uploaded securely to Filestack with virus scanning:`, result.filename);
    } catch (error: any) {
      console.error(`🚨 Secure upload failed for ${fileType}:`, error);
      
      // Handle security-specific errors
      if (error.message?.includes('virus') || error.message?.includes('malware')) {
        alert('🦠 Security threat detected! This file cannot be uploaded. Please scan your device and try with a different file.');
      } else if (error.message?.includes('content')) {
        alert('🚫 File content not allowed. Please upload a valid document.');
      } else {
        alert('Upload failed. Please try again.');
      }
      
      setErrors(prev => ({ ...prev, [fileType]: error.message }));
    } finally {
      // Hide uploading state
      setUploading(prev => ({ ...prev, [fileType]: false }));
    }
  };

  const removeFile = async (fileType: keyof FormData) => {
    // Remove from form data
    setFormData(prev => ({
      ...prev,
      [fileType]: null
    }));
    
    // Remove from database
    if (authUser?.id) {
      try {
        const documentData = {
          userId: authUser.id,
          documents: {
            [fileType.replace('File', '')]: null // Set to null to remove
          }
        };

        await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documentData)
        });
      } catch (error) {
        console.error('Error removing document from database:', error);
      }
    }
    
    // Clear any errors
    setErrors(prev => ({ ...prev, [fileType]: '' }));
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

  const validateDocuments = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.governmentIdFile) newErrors.governmentIdFile = 'Government ID is required';
    if (!formData.incomeVerificationFile) newErrors.incomeVerificationFile = 'Income verification is required';
    
    // Student ID is required for students or international students
    if ((formData.employmentStatus === 'student' || formData.citizenshipStatus === 'international_student') && !formData.studentIdFile) {
      newErrors.studentIdFile = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateDocuments()) {
      // Save documents to localStorage
      const savedData = localStorage.getItem('credora_application_form');
      const existingData = savedData ? JSON.parse(savedData) : {};
      const updatedData = { 
        ...existingData, 
        documents: {
          governmentId: formData.governmentIdFile?.name || '',
          incomeVerification: formData.incomeVerificationFile?.name || '',
          studentId: formData.studentIdFile?.name || ''
        }
      };
      localStorage.setItem('credora_application_form', JSON.stringify(updatedData));
      
      router.push('/apply/review');
    }
  };

  const prevStep = () => {
    router.push('/apply/rental');
  };

  // Authentication guards
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!authLoading && !isAuthenticated) {
        console.log('🚫 Not authenticated after timeout, redirecting to sign in');
        router.push('/auth/signin');
      }
    }, 500); // 500ms delay to allow auth state to stabilize

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 pt-8">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Document Upload</h2>
            <p className="text-slate-600">Please upload the required documents for verification.</p>
          </div>
          <div className="space-y-6">

            <div className="space-y-8">
              {/* Government ID */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Government-Issued ID <span className="text-red-500">*</span></h3>
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
                  {uploading.governmentIdFile ? (
                    <div className="space-y-4">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-slate-600 font-medium text-center">Uploading...</p>
                    </div>
                  ) : formData.governmentIdFile ? (
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
                {errors.governmentIdFile && <p className="text-red-500 text-sm mt-2">{errors.governmentIdFile}</p>}
              </div>

              {/* Student ID - Required for Students Only */}
              {formData.employmentStatus === 'student' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Student ID <span className="text-red-500">*</span></h3>
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
                    {uploading.studentIdFile ? (
                      <div className="space-y-4">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-slate-600 font-medium text-center">Uploading...</p>
                      </div>
                    ) : formData.studentIdFile ? (
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
                  {errors.studentIdFile && <p className="text-red-500 text-sm mt-2">{errors.studentIdFile}</p>}
                </div>
              )}

              {/* Income Verification */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof of Income <span className="text-red-500">*</span></h3>
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
                  {uploading.incomeVerificationFile ? (
                    <div className="space-y-4">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-slate-600 font-medium text-center">Uploading...</p>
                    </div>
                  ) : formData.incomeVerificationFile ? (
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
                {errors.incomeVerificationFile && <p className="text-red-500 text-sm mt-2">{errors.incomeVerificationFile}</p>}
              </div>
            </div>

            {/* Modern Navigation Controls */}
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Rental Info
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
