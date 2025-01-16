import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });

    // Verify auth
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, member_type, created_at')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('API: Profile error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        display_name: profile.display_name || 'Anonymous User',
        member_type: profile.member_type || 'buyer',
        created_at: profile.created_at
      }
    });

  } catch (error) {
    console.error('API: Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
