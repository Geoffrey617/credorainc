import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch all active conversations for mobile app
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    
    // Verify admin access (you can set this key in your env)
    if (adminKey !== process.env.CHAT_ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('📱 Fetching conversations for mobile app');

    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        id,
        user_email,
        user_name,
        status,
        last_message,
        last_message_at,
        created_at,
        chat_messages!inner (
          id,
          message,
          sender_type,
          sender_name,
          created_at
        )
      `)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    // Group messages by conversation and get unread count
    const conversationsWithStats = data.map(conv => {
      const messages = conv.chat_messages || [];
      const unreadCount = messages.filter(msg => 
        msg.sender_type === 'user' && 
        new Date(msg.created_at) > new Date(conv.last_message_at || conv.created_at)
      ).length;

      return {
        id: conv.id,
        userEmail: conv.user_email,
        userName: conv.user_name,
        status: conv.status,
        lastMessage: conv.last_message,
        lastMessageAt: conv.last_message_at,
        createdAt: conv.created_at,
        unreadCount,
        messageCount: messages.length
      };
    });

    return NextResponse.json({ 
      conversations: conversationsWithStats,
      totalActive: conversationsWithStats.length
    });

  } catch (error) {
    console.error('Error in conversations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update conversation status (close, reopen, etc.)
export async function PUT(request: NextRequest) {
  try {
    const { conversationId, status, adminKey } = await request.json();
    
    // Verify admin access
    if (adminKey !== process.env.CHAT_ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!conversationId || !status) {
      return NextResponse.json(
        { error: 'Conversation ID and status are required' },
        { status: 400 }
      );
    }

    console.log('📱 Updating conversation status:', { conversationId, status });

    const { data, error } = await supabase
      .from('chat_conversations')
      .update({ status })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to update conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      conversation: data 
    });

  } catch (error) {
    console.error('Error in conversations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
