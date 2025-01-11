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
    
    const { data: jobs, error: jobsError } = await supabase
      .from('project_postings')
      .select('*')
      .order('created_at', { ascending: false });

    if (jobsError) {
      console.error('Jobs error:', jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      jobs: jobs
    });

  } catch (error) {
    console.error('Error in GET /api/jobs/all:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
