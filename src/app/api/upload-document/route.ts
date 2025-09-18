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

    // Save document metadata to database
    try {
      const documentData = {
        userId: userId,
        sessionId: sessionId,
        documents: {
          [documentType]: {
            name: file.name,
            size: file.size,
            type: file.type,
            filePath: data.path,
            fileUrl: urlData.publicUrl,
            uploadedAt: new Date().toISOString()
          }
        }
      };

      // Try to update existing application first
      const { data: existingApps } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingApps && existingApps.length > 0) {
        // Update existing application
        const existingApp = existingApps[0];
        const updatedDocuments = {
          ...existingApp.documents,
          [documentType]: documentData.documents[documentType]
        };

        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            documents: updatedDocuments,
            session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingApp.id);
          
        if (updateError) {
          console.error('🚨 Database update error details:', {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code
          });
          throw new Error(`Database update failed: ${updateError.message}`);
        }

        console.log('📄 Updated existing application with document');
      } else {
        // Create new application
        const { error: insertError } = await supabase
          .from('applications')
          .insert({
            user_id: userId,
            session_id: sessionId,
            status: 'draft',
            documents: documentData.documents,
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('🚨 Database insert error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw new Error(`Database insert failed: ${insertError.message}`);
        }

        console.log('📄 Created new application with document');
      }
    } catch (dbError) {
      console.error('Error saving document metadata to database:', dbError);
      // Don't fail the upload if database save fails
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath: data.path,
      fileUrl: urlData.publicUrl,
      sessionId: sessionId,
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
