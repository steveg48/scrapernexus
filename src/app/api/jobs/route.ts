import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, Request } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('API: Starting jobs fetch');
    
    // Create a Supabase client for the route handler
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore,
      supabaseUrl,
      supabaseAnonKey
    });

    // Verify auth
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      console.log('Auth error or no session:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session user ID:', session.user.id);

    // Get jobs for this user
    const { data: jobs, error: jobsError } = await supabase
      .from('project_postings')
      .select(`
        project_postings_id,
        title,
        description,
        created_at,
        status,
        data_fields,
        frequency
      `)
      .eq('buyer_id', session.user.id)
      .order('created_at', { ascending: false });

    console.log('Jobs for user:', jobs);
    console.log('Query error if any:', jobsError);

    if (jobsError) {
      console.error('API: Jobs error:', jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    // Transform the data
    const transformedJobs = jobs?.map(job => ({
      id: job.project_postings_id.toString(),
      title: job.title || 'Untitled Project',
      description: job.description || '',
      created_at: job.created_at,
      status: job.status || 'open',
      data_fields: job.data_fields || {},
      frequency: job.frequency || 'one_time'
    })) || [];

    console.log('Transformed jobs:', transformedJobs);

    console.log('API: Sending response:', { success: true, jobs: transformedJobs });

    return NextResponse.json({
      success: true,
      jobs: transformedJobs
    });

  } catch (error) {
    console.error('API: Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
