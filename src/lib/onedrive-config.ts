import { PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';

// OneDrive configuration for secure document uploads
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID || 'your_client_id_here',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/onedrive/callback' : 'http://localhost:3000'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

// Initialize MSAL instance
let msalInstance: PublicClientApplication | null = null;

if (typeof window !== 'undefined') {
  msalInstance = new PublicClientApplication(msalConfig);
}

// OneDrive scopes needed
const scopes = ['Files.ReadWrite', 'Files.ReadWrite.All'];

// Get authenticated Graph client
export const getGraphClient = async (): Promise<Client> => {
  if (!msalInstance) {
    throw new Error('MSAL not initialized - client-side only');
  }

  try {
    // Try to get token silently first
    const accounts = msalInstance.getAllAccounts();
    let tokenResponse;

    if (accounts.length > 0) {
      // Silent token acquisition
      tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: scopes,
        account: accounts[0]
      });
    } else {
      // Interactive token acquisition
      tokenResponse = await msalInstance.acquireTokenPopup({
        scopes: scopes
      });
    }

    // Create Graph client with access token
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, tokenResponse.accessToken);
      }
    });

    return graphClient;
  } catch (error) {
    console.error('Error getting Graph client:', error);
    throw error;
  }
};

// Upload file to OneDrive
export const uploadToOneDrive = async (
  file: File,
  documentType: string,
  userId: string
): Promise<{id: string, name: string, webUrl: string, downloadUrl: string}> => {
  try {
    console.log('📤 Uploading to OneDrive:', {
      fileName: file.name,
      fileSize: file.size,
      documentType,
      userId
    });

    const graphClient = await getGraphClient();
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${userId}_${documentType}_${timestamp}_${file.name}`;
    
    // Create folder path for organization
    const folderPath = `/Credora-Documents/${userId}`;
    
    // Upload file to OneDrive
    const uploadResult = await graphClient
      .api(`/me/drive/root:/${folderPath}/${fileName}:/content`)
      .put(file);

    console.log('✅ OneDrive upload successful:', {
      fileId: uploadResult.id,
      fileName: uploadResult.name
    });

    return {
      id: uploadResult.id,
      name: uploadResult.name,
      webUrl: uploadResult.webUrl,
      downloadUrl: uploadResult['@microsoft.graph.downloadUrl']
    };

  } catch (error) {
    console.error('🚨 OneDrive upload error:', error);
    throw new Error(`OneDrive upload failed: ${error}`);
  }
};

// Get file information from OneDrive
export const getOneDriveFileInfo = async (fileId: string) => {
  try {
    const graphClient = await getGraphClient();
    
    const fileInfo = await graphClient
      .api(`/me/drive/items/${fileId}`)
      .get();
    
    return {
      id: fileInfo.id,
      name: fileInfo.name,
      size: fileInfo.size,
      mimeType: fileInfo.file?.mimeType,
      webUrl: fileInfo.webUrl,
      downloadUrl: fileInfo['@microsoft.graph.downloadUrl'],
      createdDateTime: fileInfo.createdDateTime
    };
  } catch (error) {
    console.error('Error getting OneDrive file info:', error);
    throw error;
  }
};

// Delete file from OneDrive
export const deleteFromOneDrive = async (fileId: string): Promise<boolean> => {
  try {
    const graphClient = await getGraphClient();
    
    await graphClient
      .api(`/me/drive/items/${fileId}`)
      .delete();
    
    console.log('🗑️ File deleted from OneDrive:', fileId);
    return true;
  } catch (error) {
    console.error('Error deleting OneDrive file:', error);
    return false;
  }
};

// Complete secure upload workflow with ClamAV
export const secureDocumentUpload = async (
  file: File,
  documentType: string,
  userId: string,
  onProgress?: (stage: string) => void
): Promise<{id: string, name: string, url: string, clean: boolean}> => {
  try {
    // Stage 1: Pre-upload virus scan (optional - scan file before upload)
    onProgress?.('Preparing secure upload...');
    
    // Stage 2: Upload to OneDrive
    onProgress?.('Uploading to secure storage...');
    const uploadResult = await uploadToOneDrive(file, documentType, userId);
    
    // Stage 3: Post-upload virus scan with ClamAV
    onProgress?.('Scanning for security threats...');
    const scanResult = await fetch('/api/scan-virus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileId: uploadResult.id,
        fileName: uploadResult.name,
        downloadUrl: uploadResult.downloadUrl
      })
    });
    
    const scanData = await scanResult.json();
    
    // Stage 4: Handle scan results
    if (scanData.infected) {
      // Delete infected file immediately
      await deleteFromOneDrive(uploadResult.id);
      throw new Error(`🦠 Security threat detected: ${scanData.threat}`);
    }
    
    onProgress?.('Upload complete and secure!');
    
    return {
      id: uploadResult.id,
      name: uploadResult.name,
      url: uploadResult.webUrl,
      clean: true
    };
    
  } catch (error) {
    console.error('🚨 Secure OneDrive upload failed:', error);
    throw error;
  }
};
