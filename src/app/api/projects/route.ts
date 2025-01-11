import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry an operation
async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                // Wait before retrying, with exponential backoff
                await delay(initialDelay * Math.pow(2, i));
                console.log(`Retry attempt ${i + 1} after error:`, error);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export async function POST(request: Request) {
    try {
        // Create a Supabase client with cookies
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        // Get the current session with retry
        const { data: { session }, error: sessionError } = await retryOperation(
            () => supabase.auth.getSession()
        );

        if (sessionError || !session) {
            throw new Error('Not authenticated');
        }

        // Check if profile exists, if not create it
        const { data: existingProfile } = await retryOperation(
            () => supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .single()
        );

        if (!existingProfile) {
            // Create profile if it doesn't exist
            await retryOperation(
                () => supabase
                    .from('profiles')
                    .insert({
                        id: session.user.id,
                        display_name: session.user.email?.split('@')[0] || 'User',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
            );
        }

        const data = await request.json();
        
        // Create the project posting directly
        const { data: posting, error: postingError } = await supabase
            .from('project_postings')
            .insert({
                buyer_id: session.user.id,
                title: data.title,
                description: data.description,
                frequency: data.frequency,
                budget_min: data.budget_min,
                budget_max: data.budget_max,
                budget_fixed_price: data.budget_fixed_price,
                project_budget_type: data.project_budget_type,
                project_location: data.project_location,
                project_scope: data.project_scope,
                project_type: data.project_type
            })
            .select()
            .single();

        if (postingError) {
            console.error('Error creating project posting:', postingError);
            throw new Error(`Failed to create project posting: ${postingError.message}`);
        }

        // Return success response with the project ID
        return NextResponse.json({ 
            success: true, 
            project_id: posting.project_id
        }, { 
            status: 201 
        });

    } catch (error) {
        console.error('Error in POST /api/projects:', error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, {
            status: error instanceof Error && error.message.includes('Not authenticated') ? 401 : 400
        });
    }
}

export async function GET(request: Request) {
    try {
        // Create a Supabase client with cookies
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        // Get the current session with retry
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch project postings for the user
        const { data: projectPostings, error: projectsError } = await supabase
            .from('project_postings')
            .select(`
                id,
                title,
                created_at,
                buyer_id,
                is_draft,
                project_status
            `)
            .eq('buyer_id', session.user.id)
            .order('created_at', { ascending: false });

        if (projectsError) {
            console.error('Error fetching projects:', projectsError);
            return NextResponse.json(
                { error: `Failed to fetch projects: ${projectsError.message}` },
                { status: 500 }
            );
        }

        // Transform the data to match our frontend needs
        const formattedProjects = projectPostings.map(posting => ({
            id: posting.id,
            title: posting.title || 'Untitled',
            createdAt: posting.created_at,
            createdBy: 'You',
            status: posting.project_status || 'open',
            stats: {
                proposals: 0,
                newProposals: 0,
                messaged: 0,
                hired: 0
            }
        }));

        return NextResponse.json({ 
            success: true, 
            projects: formattedProjects 
        });

    } catch (error) {
        console.error('Error in GET /api/projects:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
