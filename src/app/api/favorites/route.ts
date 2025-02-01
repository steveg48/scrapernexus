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
  const cookieStore = cookies();
  return createRouteHandlerClient({ cookies: () => cookieStore });
};

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');
    console.log('GET /api/favorites - Fetching favorites for seller:', sellerId);

    if (!sellerId) {
      console.error('GET /api/favorites - Missing seller_id');
      return NextResponse.json({ error: 'seller_id is required' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    const supabase = getSupabase();
    
    // Verify session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders()
      });
    }

    // Only allow users to fetch their own favorites
    if (session.user.id !== sellerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 403,
        headers: corsHeaders()
      });
    }

    console.log('GET /api/favorites - Querying database...');
    const { data, error } = await supabase
      .from('seller_favorites')
      .select('project_postings_id')
      .eq('seller_id', sellerId);

    if (error) {
      console.error('GET /api/favorites - Database error:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('GET /api/favorites - Success, returning data:', data);
    return NextResponse.json(data, {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('GET /api/favorites - Unexpected error:', error);
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

    const body = await request.json();
    const { project_postings_id } = body;

    if (!project_postings_id) {
      return NextResponse.json({ error: 'project_postings_id is required' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    console.log('POST /api/favorites - Adding favorite:', {
      seller_id: session.user.id,
      project_postings_id
    });

    const { data, error } = await supabase
      .from('seller_favorites')
      .insert([{
        seller_id: session.user.id,
        project_postings_id,
        created_at: new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) {
      console.error('POST /api/favorites - Database error:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('POST /api/favorites - Success, returning data:', data);
    return NextResponse.json(data, {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('POST /api/favorites - Unexpected error:', error);
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
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'project_id is required' }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    console.log('DELETE /api/favorites - Removing favorite:', {
      seller_id: session.user.id,
      project_id: projectId
    });

    const { error } = await supabase
      .from('seller_favorites')
      .delete()
      .eq('seller_id', session.user.id)
      .eq('project_postings_id', projectId);

    if (error) {
      console.error('DELETE /api/favorites - Database error:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('DELETE /api/favorites - Success');
    return new NextResponse(null, { 
      status: 204,
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('DELETE /api/favorites - Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}
