import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: jobs, error: jobsError } = await supabase
      .from('project_postings')
      .select('project_id, title, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (jobsError) {
      console.error('Jobs error:', jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    // Transform the data to match the expected interface
    const transformedJobs = jobs?.map(job => ({
      id: job.project_id,
      title: job.title || 'Untitled',
      created_at: job.created_at,
      status: 'open' // Default status
    })) || [];

    return NextResponse.json({
      success: true,
      jobs: transformedJobs
    });

  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
