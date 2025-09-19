import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Google Drive API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET
);

// Set credentials (you'll need to handle OAuth flow)
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_DRIVE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName } = await request.json();
    
    console.log('🔍 Starting ClamAV virus scan for:', fileName);
    
    if (!fileId || !fileName) {
      return NextResponse.json(
        { error: 'File ID and name are required' },
        { status: 400 }
      );
    }

    // Download file from Google Drive for scanning
    console.log('📥 Downloading file from Google Drive for scanning...');
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    });

    // Create temporary file for scanning
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, `scan_${Date.now()}_${fileName}`);
    
    // Write file data to temporary location
    await fs.writeFile(tempFilePath, response.data as any);
    console.log('💾 File written to temp location for scanning:', tempFilePath);

    let scanResult;
    try {
      // Run ClamAV scan
      console.log('🔍 Running ClamAV scan...');
      execSync(`clamscan --no-summary "${tempFilePath}"`, { 
        stdio: 'pipe',
        timeout: 30000 // 30 second timeout
      });
      
      // If we get here, file is clean (clamscan exits 0 for clean files)
      scanResult = {
        infected: false,
        clean: true,
        threat: null
      };
      
      console.log('✅ ClamAV scan complete - file is clean');
      
    } catch (error: any) {
      // ClamAV exits with non-zero code if virus found
      if (error.status === 1) {
        // Virus detected
        scanResult = {
          infected: true,
          clean: false,
          threat: 'Virus or malware detected by ClamAV'
        };
        
        console.log('🦠 VIRUS DETECTED by ClamAV:', fileName);
        
        // Delete infected file from Google Drive immediately
        try {
          await drive.files.delete({ fileId });
          console.log('🗑️ Infected file deleted from Google Drive');
        } catch (deleteError) {
          console.error('Error deleting infected file:', deleteError);
        }
        
      } else {
        // Scan error
        console.error('ClamAV scan error:', error);
        throw new Error('Virus scan failed - please try again');
      }
    } finally {
      // Clean up temporary file
      try {
        await fs.unlink(tempFilePath);
        console.log('🧹 Temporary scan file cleaned up');
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }

    return NextResponse.json(scanResult);

  } catch (error) {
    console.error('🚨 Virus scanning API error:', error);
    return NextResponse.json(
      { error: 'Virus scanning failed', infected: null },
      { status: 500 }
    );
  }
}
