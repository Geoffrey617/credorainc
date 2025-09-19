import * as filestack from 'filestack-js';

// Filestack configuration for secure document uploads
const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY || 'AZrsx26mpSbuxKl4IvpVwz';

// Initialize Filestack client
export const filestackClient = filestack.init(FILESTACK_API_KEY);

// Security and upload configuration
export const uploadConfig = {
  // Security policies
  security: {
    policy: {
      // Virus scanning and malware detection
      virus_detection: 'block',
      
      // File type restrictions for security
      allowed_extensions: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
      
      // Size limits
      max_size: 100 * 1024 * 1024, // 100MB max
      
      // Additional security
      remove_metadata: true, // Strip potentially malicious metadata
    }
  },
  
  // Upload options
  uploadOptions: {
    onProgress: (percentage: number) => {
      console.log(`📤 Upload progress: ${percentage}%`);
    },
    onError: (error: any) => {
      console.error('🚨 Filestack upload error:', error);
    }
  }
};

// Secure document upload function
export const uploadSecureDocument = async (
  file: File,
  documentType: string,
  onProgress?: (percentage: number) => void,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void
): Promise<{handle: string, filename: string, url: string, size: number, mimetype: string}> => {
  try {
    console.log('🛡️ Starting secure Filestack upload with virus scanning:', {
      fileName: file.name,
      fileSize: file.size,
      documentType
    });

    // Configure upload with security policies
    const uploadOptions = {
      ...uploadConfig.uploadOptions,
      accept: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
      maxSize: documentType === 'incomeVerification' ? 100 * 1024 * 1024 : 10 * 1024 * 1024,
      onProgress: (percentage: number) => {
        console.log(`📤 Secure upload progress: ${percentage}%`);
        onProgress?.(percentage);
      },
      onError: (error: any) => {
        console.error('🚨 Upload error:', error);
        onError?.(error);
      }
    };

    // Upload with virus scanning and security checks
    const result = await filestackClient.upload(file, uploadOptions);
    
    console.log('✅ Filestack upload successful with virus scanning:', {
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
      mimetype: result.mimetype
    };

    onSuccess?.(secureResult);
    return secureResult;

  } catch (error: any) {
    console.error('🚨 Secure Filestack upload failed:', error);
    
    // Handle specific security errors
    if (error.message?.includes('virus') || error.message?.includes('malware')) {
      console.error('🦠 SECURITY THREAT DETECTED - File blocked by virus scanner');
      const securityError = new Error('🦠 Security threat detected! This file cannot be uploaded. Please scan your device and try with a different file.');
      onError?.(securityError);
      throw securityError;
    } else if (error.message?.includes('content') || error.message?.includes('policy')) {
      console.error('🚫 CONTENT POLICY VIOLATION - File blocked by security policy');
      const policyError = new Error('🚫 File content not allowed. Please upload a valid document.');
      onError?.(policyError);
      throw policyError;
    } else {
      onError?.(error);
      throw error;
    }
  }
};

// Get secure file URL for viewing/downloading
export const getSecureFileUrl = (handle: string): string => {
  return `https://cdn.filestackcontent.com/${handle}`;
};

// Delete file from Filestack (when document is rejected)
export const deleteSecureFile = async (handle: string): Promise<boolean> => {
  try {
    await filestackClient.remove(handle);
    console.log('🗑️ Secure file deleted from Filestack:', handle);
    return true;
  } catch (error) {
    console.error('Error deleting secure file:', error);
    return false;
  }
};
