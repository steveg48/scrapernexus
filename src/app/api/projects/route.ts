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
        const supabase = createRouteHandlerClient({ cookies });
        
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
