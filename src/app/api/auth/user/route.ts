import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
                fullName: user.user_metadata?.full_name || ''
            }
        });

    } catch (error) {
        console.error('Error in GET /api/auth/user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
