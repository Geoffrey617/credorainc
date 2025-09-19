import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName, downloadUrl } = await request.json();
    
    console.log('🔍 Starting ClamAV virus scan for:', fileName);
    
    if (!fileId || !fileName || !downloadUrl) {
      return NextResponse.json(
        { error: 'File ID, name, and download URL are required' },
        { status: 400 }
      );
    }

    // Download file from OneDrive for scanning
    console.log('📥 Downloading file from OneDrive for scanning...');
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error('Failed to download file from OneDrive');
    }
    
    const fileBuffer = await response.arrayBuffer();

    // Create temporary file for scanning
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, `scan_${Date.now()}_${fileName}`);
    
    // Write file data to temporary location
    await fs.writeFile(tempFilePath, Buffer.from(fileBuffer));
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
        
        // Note: OneDrive file deletion will be handled by the client-side code
        // since we're using personal account authentication
        
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
