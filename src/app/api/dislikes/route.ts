import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Create a single instance of the Supabase client
const getSupabase = () => {
  return createRouteHandlerClient({ cookies });
};

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    
    // Verify session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders()
      });
    }

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');

    if (!sellerId) {
      return NextResponse.json({ error: 'seller_id is required' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    // Only allow users to fetch their own dislikes
    if (session.user.id !== sellerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 403,
        headers: corsHeaders()
      });
    }

    const { data, error } = await supabase
      .from('seller_dislikes')
      .select('project_posting_id')
      .eq('seller_id', sellerId);

    if (error) {
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    return NextResponse.json(data || [], {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Error in GET /api/dislikes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    
    // Verify session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders()
      });
    }

    const json = await request.json();
    const { project_posting_id } = json;

    if (!project_posting_id) {
      return NextResponse.json({ error: 'Missing project_posting_id' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    const { data, error } = await supabase.from('seller_dislikes').insert([
      {
        seller_id: session.user.id,
        project_posting_id: Number(project_posting_id)
      }
    ]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    return NextResponse.json(data[0], {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Error in POST /api/dislikes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabase();
    
    // Verify session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders()
      });
    }

    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    const { error } = await supabase
      .from('seller_dislikes')
      .delete()
      .eq('seller_id', session.user.id)
      .eq('project_posting_id', project_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    return NextResponse.json({ success: true }, {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Error in DELETE /api/dislikes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}
