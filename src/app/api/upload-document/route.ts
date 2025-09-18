import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const sessionId = formData.get('sessionId') as string;
    const documentType = formData.get('documentType') as string;
    
    if (!file || !userId || !documentType || !sessionId) {
      return NextResponse.json(
        { error: 'File, userId, sessionId, and documentType are required' },
        { status: 400 }
      );
    }

    // Create session-based filename for consistency
    const fileExtension = file.name.split('.').pop();
    const fileName = `${sessionId}_${documentType}_${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('application-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('application-documents')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath: data.path,
      fileUrl: urlData.publicUrl,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
