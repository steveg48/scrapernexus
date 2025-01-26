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
    console.log('GET /api/favorites - Querying database...');
    
    const { data, error } = await supabase
      .from('seller_favorites')
      .select('project_posting_id')
      .eq('seller_id', sellerId);

    if (error) {
      console.error('GET /api/favorites - Database error:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('GET /api/favorites - Found favorites:', data);
    return NextResponse.json(data || [], { headers: corsHeaders() });
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
    const body = await request.json();
    const { seller_id, project_posting_id } = body;
    console.log('POST /api/favorites - Request body:', body);

    if (!seller_id || !project_posting_id) {
      console.error('POST /api/favorites - Missing required fields');
      return NextResponse.json(
        { error: 'seller_id and project_posting_id are required' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    const supabase = getSupabase();
    
    // Convert project_posting_id to number
    const projectPostingIdNum = parseInt(project_posting_id);
    if (isNaN(projectPostingIdNum)) {
      console.error('POST /api/favorites - Invalid project_posting_id:', project_posting_id);
      return NextResponse.json(
        { error: 'project_posting_id must be a valid number' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }
    
    console.log('POST /api/favorites - Checking if favorite exists...');
    // First check if the favorite already exists
    const { data: existingFavorite, error: checkError } = await supabase
      .from('seller_favorites')
      .select('*')
      .eq('seller_id', seller_id)
      .eq('project_posting_id', projectPostingIdNum)
      .maybeSingle();

    if (checkError) {
      console.error('POST /api/favorites - Error checking favorite:', checkError);
      return NextResponse.json({ error: checkError.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    if (existingFavorite) {
      console.log('POST /api/favorites - Favorite already exists:', existingFavorite);
      return NextResponse.json(existingFavorite, { headers: corsHeaders() });
    }

    console.log('POST /api/favorites - Inserting new favorite...');
    // If no existing favorite, insert new one
    const { data, error } = await supabase
      .from('seller_favorites')
      .insert({
        seller_id,
        project_posting_id: projectPostingIdNum,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('POST /api/favorites - Error adding favorite:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('POST /api/favorites - Successfully added favorite:', data);
    return NextResponse.json(data, { headers: corsHeaders() });
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
    const body = await request.json();
    const { seller_id, project_posting_id } = body;
    console.log('DELETE /api/favorites - Request body:', body);

    if (!seller_id || !project_posting_id) {
      console.error('DELETE /api/favorites - Missing required fields');
      return NextResponse.json(
        { error: 'seller_id and project_posting_id are required' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    const projectPostingIdNum = parseInt(project_posting_id);
    if (isNaN(projectPostingIdNum)) {
      console.error('DELETE /api/favorites - Invalid project_posting_id:', project_posting_id);
      return NextResponse.json(
        { error: 'project_posting_id must be a valid number' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    const supabase = getSupabase();
    
    console.log('DELETE /api/favorites - Verifying favorite exists...');
    // First verify the favorite exists
    const { data: existingFavorite, error: checkError } = await supabase
      .from('seller_favorites')
      .select('*')
      .eq('seller_id', seller_id)
      .eq('project_posting_id', projectPostingIdNum)
      .maybeSingle();

    if (checkError) {
      console.error('DELETE /api/favorites - Error checking favorite:', checkError);
      return NextResponse.json({ error: checkError.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    if (!existingFavorite) {
      console.error('DELETE /api/favorites - Favorite not found');
      return NextResponse.json({ error: 'Favorite not found' }, { 
        status: 404,
        headers: corsHeaders()
      });
    }

    console.log('DELETE /api/favorites - Deleting favorite...');
    // Delete using composite key
    const { error } = await supabase
      .from('seller_favorites')
      .delete()
      .eq('seller_id', seller_id)
      .eq('project_posting_id', projectPostingIdNum);

    if (error) {
      console.error('DELETE /api/favorites - Error removing favorite:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: corsHeaders()
      });
    }

    console.log('DELETE /api/favorites - Successfully deleted favorite');
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (error) {
    console.error('DELETE /api/favorites - Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}
