import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: dislikes } = await supabase
      .from('seller_dislikes')
      .select('project_posting_id')
      .eq('seller_id', user.id);

    return NextResponse.json(dislikes || []);
  } catch (error) {
    console.error('Error in GET /api/dislikes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const project_posting_id = json.project_posting_id;

    if (!project_posting_id) {
      return new NextResponse('Missing project_posting_id', { status: 400 });
    }

    const { error } = await supabase.from('seller_dislikes').insert([
      {
        seller_id: user.id,
        project_posting_id,
      },
    ]);

    if (error) {
      console.error('Error inserting dislike:', error);
      return new NextResponse('Failed to add dislike', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/dislikes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return new NextResponse('Missing project_id', { status: 400 });
    }

    const { error } = await supabase
      .from('seller_dislikes')
      .delete()
      .eq('seller_id', user.id)
      .eq('project_posting_id', project_id);

    if (error) {
      console.error('Error deleting dislike:', error);
      return new NextResponse('Failed to remove dislike', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/dislikes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
