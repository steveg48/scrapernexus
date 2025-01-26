import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');

    if (!sellerId) {
      return NextResponse.json({ error: 'seller_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('seller_favorites')
      .select('project_posting_id')
      .eq('seller_id', sellerId);

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const { seller_id, project_posting_id } = body;

    if (!seller_id || !project_posting_id) {
      return NextResponse.json(
        { error: 'seller_id and project_posting_id are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('seller_favorites')
      .insert([
        {
          seller_id,
          project_posting_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');
    const projectPostingId = searchParams.get('project_posting_id');

    if (!sellerId || !projectPostingId) {
      return NextResponse.json(
        { error: 'seller_id and project_posting_id are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('seller_favorites')
      .delete()
      .eq('seller_id', sellerId)
      .eq('project_posting_id', projectPostingId);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
