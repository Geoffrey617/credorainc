import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch chat messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userEmail = searchParams.get('userEmail');
    
    if (!conversationId && !userEmail) {
      return NextResponse.json(
        { error: 'Conversation ID or user email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching chat messages for:', { conversationId, userEmail });

    let query = supabase
      .from('chat_messages')
      .select(`
        *,
        chat_conversations!inner (
          id,
          user_email,
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: true });
    
    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    } else if (userEmail) {
      query = query.eq('chat_conversations.user_email', userEmail);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chat messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chat messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send a new chat message
export async function POST(request: NextRequest) {
  try {
    const { conversationId, userEmail, message, senderType, senderName } = await request.json();
    
    if (!message || !userEmail) {
      return NextResponse.json(
        { error: 'Message and user email are required' },
        { status: 400 }
      );
    }

    console.log('💬 Sending chat message:', { conversationId, userEmail, senderType });

    let currentConversationId = conversationId;

    // If no conversation ID, create or find existing conversation
    if (!currentConversationId) {
      const { data: existingConversation, error: findError } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_email', userEmail)
        .eq('status', 'active')
        .single();

      if (existingConversation) {
        currentConversationId = existingConversation.id;
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            user_email: userEmail,
            user_name: senderName || userEmail.split('@')[0],
            status: 'active',
            last_message: message,
            last_message_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
          );
        }

        currentConversationId = newConversation.id;
      }
    }

    // Insert the message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        message: message,
        sender_type: senderType || 'user', // 'user' or 'admin'
        sender_name: senderName || userEmail.split('@')[0],
        sender_email: senderType === 'admin' ? null : userEmail
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Update conversation last message
    await supabase
      .from('chat_conversations')
      .update({
        last_message: message,
        last_message_at: new Date().toISOString()
      })
      .eq('id', currentConversationId);

    return NextResponse.json({ 
      success: true, 
      message: data,
      conversationId: currentConversationId
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
