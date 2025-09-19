import { google } from 'googleapis';

// Google Drive configuration for secure document uploads
const GOOGLE_DRIVE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const GOOGLE_DRIVE_CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const GOOGLE_DRIVE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:3000/auth/google-drive/callback';

// Initialize Google Drive client
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_DRIVE_CLIENT_ID,
  GOOGLE_DRIVE_CLIENT_SECRET,
  GOOGLE_DRIVE_REDIRECT_URI
);

// Initialize Google Drive API
const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Document upload configuration
export const documentConfig = {
  // Allowed file types for security
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  // File size limits
  maxSizes: {
    governmentId: 10 * 1024 * 1024, // 10MB
    incomeVerification: 100 * 1024 * 1024, // 100MB
    studentId: 10 * 1024 * 1024 // 10MB
  },
  
  // Folder structure in Google Drive
  folderNames: {
    root: 'Credora-Documents',
    pending: 'Pending-Review',
    approved: 'Approved-Documents',
    rejected: 'Rejected-Documents'
  }
};

// Create folder structure in Google Drive
export const createFolderStructure = async (): Promise<{[key: string]: string}> => {
  try {
    const folders: {[key: string]: string} = {};
    
    // Create root folder
    const rootFolder = await drive.files.create({
      requestBody: {
        name: documentConfig.folderNames.root,
        mimeType: 'application/vnd.google-apps.folder'
      }
    });
    folders.root = rootFolder.data.id!;
    
    // Create subfolders
    for (const [key, name] of Object.entries(documentConfig.folderNames)) {
      if (key === 'root') continue;
      
      const folder = await drive.files.create({
        requestBody: {
          name: name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folders.root]
        }
      });
      folders[key] = folder.data.id!;
    }
    
    return folders;
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw error;
  }
};

// Upload document to Google Drive
export const uploadToGoogleDrive = async (
  file: File, 
  documentType: string, 
  userId: string,
  folderId?: string
): Promise<{id: string, name: string, webViewLink: string}> => {
  try {
    console.log('📤 Uploading to Google Drive:', {
      fileName: file.name,
      fileSize: file.size,
      documentType,
      userId
    });

    // Create unique filename with user context
    const timestamp = Date.now();
    const fileName = `${userId}_${documentType}_${timestamp}_${file.name}`;
    
    // Convert File to buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
        description: `Document type: ${documentType}, User ID: ${userId}, Uploaded: ${new Date().toISOString()}`
      },
      media: {
        mimeType: file.type,
        body: buffer
      },
      fields: 'id,name,webViewLink,size,mimeType'
    });

    console.log('✅ Google Drive upload successful:', {
      fileId: response.data.id,
      fileName: response.data.name
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      webViewLink: response.data.webViewLink!
    };

  } catch (error) {
    console.error('🚨 Google Drive upload error:', error);
    throw new Error(`Google Drive upload failed: ${error}`);
  }
};

// Get file information from Google Drive
export const getFileInfo = async (fileId: string) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id,name,size,mimeType,webViewLink,createdTime'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

// Delete file from Google Drive
export const deleteFromGoogleDrive = async (fileId: string): Promise<boolean> => {
  try {
    await drive.files.delete({ fileId });
    console.log('🗑️ File deleted from Google Drive:', fileId);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Virus scanning with ClamAV (server-side)
export const scanFileForViruses = async (fileId: string, fileName: string): Promise<{clean: boolean, threat?: string}> => {
  try {
    console.log('🔍 Starting virus scan for:', fileName);
    
    // Call your ClamAV API endpoint
    const response = await fetch('/api/scan-virus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, fileName })
    });
    
    const result = await response.json();
    
    if (result.infected) {
      console.log('🦠 VIRUS DETECTED:', result.threat);
      return { clean: false, threat: result.threat };
    } else {
      console.log('✅ File is clean');
      return { clean: true };
    }
  } catch (error) {
    console.error('Error scanning file:', error);
    throw error;
  }
};

// Complete secure upload workflow
export const secureDocumentUpload = async (
  file: File,
  documentType: string,
  userId: string,
  onProgress?: (stage: string) => void
): Promise<{id: string, name: string, url: string, clean: boolean}> => {
  try {
    // Stage 1: Upload to Google Drive
    onProgress?.('Uploading to secure storage...');
    const uploadResult = await uploadToGoogleDrive(file, documentType, userId);
    
    // Stage 2: Virus scan with ClamAV
    onProgress?.('Scanning for security threats...');
    const scanResult = await scanFileForViruses(uploadResult.id, uploadResult.name);
    
    // Stage 3: Handle scan results
    if (!scanResult.clean) {
      // Delete infected file immediately
      await deleteFromGoogleDrive(uploadResult.id);
      throw new Error(`🦠 Security threat detected: ${scanResult.threat}`);
    }
    
    onProgress?.('Upload complete and secure!');
    
    return {
      id: uploadResult.id,
      name: uploadResult.name,
      url: uploadResult.webViewLink,
      clean: true
    };
    
  } catch (error) {
    console.error('🚨 Secure upload failed:', error);
    throw error;
  }
};
