'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';
import { createClient } from '@supabase/supabase-js';
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

// Initialize Supabase client for Storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Session ID management utilities
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('credora_application_session');
  if (!sessionId) {
    sessionId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('credora_application_session', sessionId);
    console.log('🆔 Created new application session:', sessionId);
  } else {
    console.log('🆔 Using existing application session:', sessionId);
  }
  return sessionId;
};

// Storage path utilities
const getStoragePath = (userId: string, sessionId: string, documentType: string, fileName: string): string => {
  // Simplified path structure to avoid deep nesting issues
  return `${sessionId}_${documentType}_${fileName}`;
};

const getStorageFolder = (userId: string, sessionId: string): string => {
  return `${sessionId}`;
};

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
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: any}>({});

  // Load documents from database (since API uploads save to database)
  const loadDocumentsFromDatabase = async () => {
    // Get user ID from multiple sources
    let userId = authUser?.id;
    
    if (!userId) {
      // Try sessionStorage first (Google login)
      const sessionData = sessionStorage.getItem('credora_session_temp');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        userId = session.user?.id || session.user?.uid;
      }
      
      // Try localStorage as fallback (email login)
      if (!userId) {
        const localUser = localStorage.getItem('credora_user');
        if (localUser) {
          const user = JSON.parse(localUser);
          userId = user.id || user.uid;
        }
      }
    }
    
    if (!userId) {
      console.log('📄 No user ID available for document loading');
      return;
    }
    
    // Get session ID for context
    const sessionId = getOrCreateSessionId();
    
    try {
      console.log('📂 Loading documents from database for user:', userId, 'session:', sessionId);
      
      // Load from database where API uploads are saved
      const response = await fetch(`/api/applications?userId=${userId}&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (response.ok && result.applications && result.applications.length > 0) {
        const latestApp = result.applications[0];
        
        if (latestApp.documents) {
          console.log('📄 Documents found in database:', Object.keys(latestApp.documents));
          console.log('📄 Document details:', latestApp.documents);
          
          // Store uploaded document info
          setUploadedDocuments({
            governmentId: latestApp.documents.governmentId,
            incomeVerification: latestApp.documents.incomeVerification,
            studentId: latestApp.documents.studentId
          });
        } else {
          console.log('📄 No documents found in database application');
        }
      } else {
        console.log('📄 No applications found for user:', userId);
      }
      
    } catch (error) {
      console.error('Error loading documents from database:', error);
    }
  };

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
      
      // Load documents from database using session ID
      await loadDocumentsFromDatabase();
    };
    
    loadData();
  }, [authUser?.id]); // Re-run when authUser becomes available

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
      // Get user ID directly from storage if authUser is not ready
      let userId = authUser?.id;
      
      if (!userId) {
        // Try sessionStorage first (Google login)
        const sessionData = sessionStorage.getItem('credora_session_temp');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          userId = session.user?.id || session.user?.uid;
        }
        
        // Try localStorage as fallback (email login)
        if (!userId) {
          const localUser = localStorage.getItem('credora_user');
          if (localUser) {
            const user = JSON.parse(localUser);
            userId = user.id || user.uid;
          }
        }
      }
      
      if (!userId) {
        alert('Please sign in to upload documents');
        router.push('/auth/signin');
        return;
      }
      
      // Get user data for API calls
      let userData = authUser;
      if (!userData) {
        const sessionData = sessionStorage.getItem('credora_session_temp');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          userData = session.user;
        } else {
          const localUser = localStorage.getItem('credora_user');
          if (localUser) {
            userData = JSON.parse(localUser);
          }
        }
      }

      // Get session ID for consistent pathing
      const sessionId = getOrCreateSessionId();
      const documentType = fileType.replace('File', '');
      const storagePath = getStoragePath(userId, sessionId, documentType, file.name);
      
      console.log('📤 Uploading document:', {
        userId,
        sessionId,
        documentType,
        fileName: file.name,
        storagePath
      });

      // Upload via API (primary method - bypasses RLS issues)
      console.log('📤 Uploading via API with session context');
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('userId', userId);
      uploadFormData.append('sessionId', sessionId);
      uploadFormData.append('documentType', documentType);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: uploadFormData
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('🚨 API upload failed:', result);
        throw new Error(result.error || 'Upload failed');
      }

      console.log('✅ API upload successful:', result.fileName);
      
      // Update form data with uploaded file info
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));

      console.log(`✅ Successfully uploaded ${fileType}:`, file.name);
      
      // Refresh documents from database to show the uploaded file
      await loadDocumentsFromDatabase();
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      alert('Upload failed. Please try again.');
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
    
    // Remove from Supabase Storage using session-based path
    // Get user ID from multiple sources
    let userId = authUser?.id;
    
    if (!userId) {
      // Try sessionStorage first (Google login)
      const sessionData = sessionStorage.getItem('credora_session_temp');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        userId = session.user?.id || session.user?.uid;
      }
      
      // Try localStorage as fallback (email login)  
      if (!userId) {
        const localUser = localStorage.getItem('credora_user');
        if (localUser) {
          const user = JSON.parse(localUser);
          userId = user.id || user.uid;
        }
      }
    }
    
    if (userId) {
      const sessionId = getOrCreateSessionId();
      const documentType = fileType.replace('File', '');
      
      try {
        // Find and remove the file from storage
        const storageFolder = getStorageFolder(userId, sessionId);
        const { data: files } = await supabase.storage
          .from('application-documents')
          .list(storageFolder);
        
        // Find the file that matches this document type
        const fileToRemove = files?.find(f => 
          f.name.includes(documentType) || 
          f.name.includes(documentType.toLowerCase())
        );
        
        if (fileToRemove) {
          const fullPath = `${storageFolder}/${fileToRemove.name}`;
          const { error } = await supabase.storage
            .from('application-documents')
            .remove([fullPath]);
          
          if (error) {
            console.error('Error removing file from storage:', error);
          } else {
            console.log('✅ File removed from storage:', fullPath);
          }
        }
        
        // Refresh documents from database
        await loadDocumentsFromDatabase();
      } catch (error) {
        console.error('Error removing document from storage:', error);
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
    
    if (!formData.governmentIdFile && !uploadedDocuments.governmentId) {
      newErrors.governmentIdFile = 'Government ID is required';
    }
    if (!formData.incomeVerificationFile && !uploadedDocuments.incomeVerification) {
      newErrors.incomeVerificationFile = 'Income verification is required';
    }
    
    // Student ID is required for students or international students
    if ((formData.employmentStatus === 'student' || formData.citizenshipStatus === 'international_student') && 
        !formData.studentIdFile && !uploadedDocuments.studentId) {
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
          governmentId: formData.governmentIdFile?.name || uploadedDocuments.governmentId?.name || '',
          incomeVerification: formData.incomeVerificationFile?.name || uploadedDocuments.incomeVerification?.name || '',
          studentId: formData.studentIdFile?.name || uploadedDocuments.studentId?.name || ''
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
                      : (formData.governmentIdFile || uploadedDocuments.governmentId)
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
                  ) : formData.governmentIdFile || uploadedDocuments.governmentId ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {formData.governmentIdFile?.name || uploadedDocuments.governmentId?.name || 'Uploaded Document'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formData.governmentIdFile 
                              ? `${(formData.governmentIdFile.size / 1024 / 1024).toFixed(2)} MB`
                              : uploadedDocuments.governmentId?.size 
                                ? `${(uploadedDocuments.governmentId.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Uploaded'
                            }
                          </p>
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
                        : (formData.studentIdFile || uploadedDocuments.studentId)
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
                    ) : formData.studentIdFile || uploadedDocuments.studentId ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              {formData.studentIdFile?.name || uploadedDocuments.studentId?.name || 'Uploaded Document'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formData.studentIdFile 
                                ? `${(formData.studentIdFile.size / 1024 / 1024).toFixed(2)} MB`
                                : uploadedDocuments.studentId?.size 
                                  ? `${(uploadedDocuments.studentId.size / 1024 / 1024).toFixed(2)} MB`
                                  : 'Uploaded'
                              }
                            </p>
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
                      : (formData.incomeVerificationFile || uploadedDocuments.incomeVerification)
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
                  ) : formData.incomeVerificationFile || uploadedDocuments.incomeVerification ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {formData.incomeVerificationFile?.name || uploadedDocuments.incomeVerification?.name || 'Uploaded Document'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formData.incomeVerificationFile 
                              ? `${(formData.incomeVerificationFile.size / 1024 / 1024).toFixed(2)} MB`
                              : uploadedDocuments.incomeVerification?.size 
                                ? `${(uploadedDocuments.incomeVerification.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Uploaded'
                            }
                          </p>
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
