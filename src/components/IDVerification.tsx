'use client';

import { useState, useRef } from 'react';

export interface IDVerificationData {
  documentType: 'drivers_license' | 'passport' | 'state_id';
  frontImage: File | null;
  backImage: File | null;
  selfieImage: File | null;
  documentNumber: string;
  expirationDate: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface IDVerificationProps {
  onVerificationComplete: (data: IDVerificationData) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
  existingData?: Partial<IDVerificationData>;
}

export default function IDVerification({ 
  onVerificationComplete, 
  onSkip, 
  showSkipOption = false,
  existingData 
}: IDVerificationProps) {
  const [step, setStep] = useState<'document_type' | 'document_upload' | 'personal_info' | 'selfie' | 'review'>('document_type');
  const [verificationData, setVerificationData] = useState<IDVerificationData>({
    documentType: 'drivers_license',
    frontImage: null,
    backImage: null,
    selfieImage: null,
    documentNumber: '',
    expirationDate: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    verificationStatus: 'not_submitted',
    ...existingData
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const frontImageRef = useRef<HTMLInputElement>(null);
  const backImageRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (type: 'front' | 'back' | 'selfie', file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    
    if (type === 'front') {
      setVerificationData(prev => ({ ...prev, frontImage: file }));
    } else if (type === 'back') {
      setVerificationData(prev => ({ ...prev, backImage: file }));
    } else if (type === 'selfie') {
      setVerificationData(prev => ({ ...prev, selfieImage: file }));
    }
  };

  const handleInputChange = (field: keyof IDVerificationData, value: string) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: string): boolean => {
    switch (currentStep) {
      case 'document_type':
        return !!verificationData.documentType;
      case 'document_upload':
        if (verificationData.documentType === 'passport') {
          return !!verificationData.frontImage;
        }
        return !!verificationData.frontImage && !!verificationData.backImage;
      case 'personal_info':
        return !!(verificationData.documentNumber && 
                 verificationData.expirationDate && 
                 verificationData.fullName && 
                 verificationData.dateOfBirth && 
                 verificationData.address);
      case 'selfie':
        return !!verificationData.selfieImage;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      setError('Please complete all required fields before continuing');
      return;
    }
    
    setError('');
    
    const steps = ['document_type', 'document_upload', 'personal_info', 'selfie', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const prevStep = () => {
    const steps = ['document_type', 'document_upload', 'personal_info', 'selfie', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In a real implementation, you would upload images to cloud storage
      // and send verification data to your backend for review
      
      const finalData: IDVerificationData = {
        ...verificationData,
        verificationStatus: 'pending',
        submittedAt: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onVerificationComplete(finalData);
    } catch (err) {
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'document_type', label: 'Document Type' },
      { key: 'document_upload', label: 'Upload Documents' },
      { key: 'personal_info', label: 'Personal Info' },
      { key: 'selfie', label: 'Selfie Verification' },
      { key: 'review', label: 'Review & Submit' }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => {
            const isActive = stepItem.key === step;
            const isCompleted = steps.findIndex(s => s.key === step) > index;
            
            return (
              <div key={stepItem.key} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                  {stepItem.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ID Verification</h2>
        <p className="text-gray-600">
          To ensure the security of our platform and reduce fraud, we require all landlords to complete ID verification.
        </p>
      </div>

      {renderStepIndicator()}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Document Type Selection */}
      {step === 'document_type' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Document Type</h3>
          <p className="text-gray-600 text-sm">Choose the type of government-issued ID you'd like to use for verification.</p>
          
          <div className="space-y-3">
            {[
              { value: 'drivers_license', label: "Driver's License", desc: 'Most common form of ID' },
              { value: 'state_id', label: 'State ID Card', desc: 'Government-issued state identification' },
              { value: 'passport', label: 'Passport', desc: 'U.S. or international passport' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="documentType"
                  value={option.value}
                  checked={verificationData.documentType === option.value}
                  onChange={(e) => handleInputChange('documentType', e.target.value as any)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Document Upload */}
      {step === 'document_upload' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document Photos</h3>
          <p className="text-gray-600 text-sm">
            Take clear photos of your {verificationData.documentType.replace('_', ' ')}. 
            Make sure all text is readable and the images are well-lit.
          </p>

          {/* Front Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {verificationData.documentType === 'passport' ? 'Passport Photo Page' : 'Front of Document'} *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {verificationData.frontImage ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(verificationData.frontImage)} 
                    alt="Document front" 
                    className="max-w-full h-32 object-contain mx-auto"
                  />
                  <p className="text-sm text-gray-600">{verificationData.frontImage.name}</p>
                  <button
                    type="button"
                    onClick={() => frontImageRef.current?.click()}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => frontImageRef.current?.click()}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Upload Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP up to 10MB</p>
                </div>
              )}
              <input
                ref={frontImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('front', e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Back Image (not needed for passport) */}
          {verificationData.documentType !== 'passport' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Back of Document *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {verificationData.backImage ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(verificationData.backImage)} 
                      alt="Document back" 
                      className="max-w-full h-32 object-contain mx-auto"
                    />
                    <p className="text-sm text-gray-600">{verificationData.backImage.name}</p>
                    <button
                      type="button"
                      onClick={() => backImageRef.current?.click()}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => backImageRef.current?.click()}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP up to 10MB</p>
                  </div>
                )}
                <input
                  ref={backImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('back', e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Personal Information */}
      {step === 'personal_info' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Enter Document Information</h3>
          <p className="text-gray-600 text-sm">Please enter the information exactly as it appears on your document.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={verificationData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="As shown on document"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                value={verificationData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Number *</label>
              <input
                type="text"
                value={verificationData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                placeholder="License/ID/Passport number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date *</label>
              <input
                type="date"
                value={verificationData.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              value={verificationData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Address as shown on document"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Step 4: Selfie Verification */}
      {step === 'selfie' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Selfie Verification</h3>
          <p className="text-gray-600 text-sm">
            Take a clear selfie to verify your identity. Make sure your face is clearly visible and well-lit.
          </p>

          <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {verificationData.selfieImage ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(verificationData.selfieImage)} 
                    alt="Selfie" 
                    className="max-w-full h-32 object-contain mx-auto rounded"
                  />
                  <p className="text-sm text-gray-600">{verificationData.selfieImage.name}</p>
                  <button
                    type="button"
                    onClick={() => selfieRef.current?.click()}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Take New Photo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => selfieRef.current?.click()}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Take Selfie
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP up to 10MB</p>
                </div>
              )}
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('selfie', e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Tips for a good selfie:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Face the camera directly</li>
              <li>• Ensure good lighting on your face</li>
              <li>• Remove sunglasses or hats</li>
              <li>• Keep a neutral expression</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 'review' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
          <p className="text-gray-600 text-sm">Please review all information before submitting for verification.</p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Document Type</h4>
              <p className="text-gray-700 capitalize">{verificationData.documentType.replace('_', ' ')}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Name:</span> {verificationData.fullName}</div>
                <div><span className="font-medium">DOB:</span> {verificationData.dateOfBirth}</div>
                <div><span className="font-medium">Document #:</span> {verificationData.documentNumber}</div>
                <div><span className="font-medium">Expires:</span> {verificationData.expirationDate}</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium">Address:</span> {verificationData.address}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents</h4>
              <div className="grid grid-cols-3 gap-4">
                {verificationData.frontImage && (
                  <div className="text-center">
                    <img src={URL.createObjectURL(verificationData.frontImage)} alt="Document front" className="w-full h-20 object-cover rounded" />
                    <p className="text-xs text-gray-600 mt-1">Document Front</p>
                  </div>
                )}
                {verificationData.backImage && (
                  <div className="text-center">
                    <img src={URL.createObjectURL(verificationData.backImage)} alt="Document back" className="w-full h-20 object-cover rounded" />
                    <p className="text-xs text-gray-600 mt-1">Document Back</p>
                  </div>
                )}
                {verificationData.selfieImage && (
                  <div className="text-center">
                    <img src={URL.createObjectURL(verificationData.selfieImage)} alt="Selfie" className="w-full h-20 object-cover rounded" />
                    <p className="text-xs text-gray-600 mt-1">Selfie</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Notice</h4>
            <p className="text-sm text-yellow-700">
              By submitting this verification, you confirm that all information is accurate and the documents are authentic. 
              False information may result in account suspension.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div>
          {step !== 'document_type' && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          {showSkipOption && step === 'document_type' && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Skip for Now
            </button>
          )}
          
          {step !== 'review' ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={!validateStep(step)}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit for Verification'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
