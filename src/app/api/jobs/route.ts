import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get jobs from the view
    const { data: jobs, error: jobsError } = await supabase
      .from('project_postings_with_skills')
      .select('project_postings_id, title, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (jobsError) {
      console.error('Jobs error:', jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    // Transform the data to match the expected interface
    const transformedJobs = jobs?.map(job => ({
      id: job.project_postings_id,
      title: job.title || 'Untitled',
      created_at: job.created_at,
      status: 'open' // Default status for now
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
