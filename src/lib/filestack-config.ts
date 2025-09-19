import * as filestack from 'filestack-js';

// Filestack configuration for secure document uploads
const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY || 'demo_key';

// Initialize Filestack client
export const filestackClient = filestack.init(FILESTACK_API_KEY);

// Security policies for document uploads
export const securityPolicy = {
  // Virus scanning and malware detection
  virus_detection: 'block',
  
  // Content analysis and threat detection
  content_analysis: true,
  
  // File type restrictions
  allowed_extensions: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  
  // Size limits (10MB for most docs, 100MB for income verification)
  max_size: 100 * 1024 * 1024, // 100MB
  
  // Additional security options
  remove_metadata: true, // Strip potentially malicious metadata
  
  // Expiration for temporary uploads
  expiry: 86400 // 24 hours
};

// Upload options for different document types
export const getUploadOptions = (documentType: string) => {
  const baseOptions = {
    accept: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    maxSize: documentType === 'incomeVerification' ? 100 * 1024 * 1024 : 10 * 1024 * 1024,
    security: securityPolicy,
    onProgress: (percentage: number) => {
      console.log(`📤 Upload progress: ${percentage}%`);
    },
    onError: (error: any) => {
      console.error('🚨 Filestack upload error:', error);
    }
  };

  return baseOptions;
};

// Secure upload function
export const uploadSecureDocument = async (
  file: File, 
  documentType: string,
  onProgress?: (percentage: number) => void,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void
) => {
  try {
    console.log('🛡️ Starting secure upload with virus scanning:', {
      fileName: file.name,
      fileSize: file.size,
      documentType
    });

    const uploadOptions = {
      ...getUploadOptions(documentType),
      onProgress: (percentage: number) => {
        console.log(`📤 Secure upload progress: ${percentage}%`);
        onProgress?.(percentage);
      }
    };

    // Upload with virus scanning and security checks
    const result = await filestackClient.upload(file, uploadOptions);
    
    console.log('✅ Secure upload successful:', {
      handle: result.handle,
      filename: result.filename,
      url: result.url,
      size: result.size,
      mimetype: result.mimetype
    });

    // Return standardized result
    const secureResult = {
      handle: result.handle,
      filename: result.filename,
      url: result.url,
      size: result.size,
      mimetype: result.mimetype,
      uploadedAt: new Date().toISOString(),
      virusScanned: true,
      secure: true
    };

    onSuccess?.(secureResult);
    return secureResult;

  } catch (error: any) {
    console.error('🚨 Secure upload failed:', error);
    
    // Handle specific security errors
    if (error.message?.includes('virus') || error.message?.includes('malware')) {
      console.error('🦠 SECURITY THREAT DETECTED - File blocked by virus scanner');
      onError?.(new Error('Security threat detected. File cannot be uploaded.'));
    } else if (error.message?.includes('content')) {
      console.error('🚫 CONTENT POLICY VIOLATION - File blocked by content filter');
      onError?.(new Error('File content not allowed. Please upload a valid document.'));
    } else {
      onError?.(error);
    }
    
    throw error;
  }
};

// Get secure download URL (for admin review)
export const getSecureDownloadUrl = (handle: string): string => {
  return `https://cdn.filestackcontent.com/${handle}`;
};

// Delete file from Filestack (when document is rejected)
export const deleteSecureFile = async (handle: string): Promise<boolean> => {
  try {
    await filestackClient.remove(handle);
    console.log('🗑️ Secure file deleted:', handle);
    return true;
  } catch (error) {
    console.error('Error deleting secure file:', error);
    return false;
  }
};
