import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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
        const cookieStore = cookies();
        const supabase = createServerComponentClient({ cookies: () => cookieStore });
        
        // Get auth token from header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }
        
        // Get the current session with retry
        const { data: { session }, error: sessionError } = await retryOperation(
            () => supabase.auth.getSession()
        );

        if (sessionError || !session) {
            console.error('Session error:', sessionError);
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Verify the token matches
        const token = authHeader.split(' ')[1];
        if (token !== session.access_token) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
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

        // Extract the project data from the request
        const projectData = await request.json();
        console.log('Received project data:', projectData);

        // First insert the project posting
        const { data: projectPosting, error: projectError } = await retryOperation(
            () => supabase
                .from('project_postings')
                .insert({
                    buyer_id: session.user.id,
                    title: projectData.title,
                    description: projectData.description,
                    frequency: projectData.frequency,
                    budget_min: projectData.budget_min,
                    budget_max: projectData.budget_max,
                    budget_fixed_price: projectData.budget_fixed_price,
                    project_budget_type: projectData.project_budget_type,
                    project_location: projectData.project_location,
                    project_scope: projectData.project_scope,
                    project_type: projectData.project_type,
                    data_fields: projectData.data_fields,
                    project_id: undefined // Let Supabase generate this
                })
                .select('project_postings_id')
                .single()
        );

        if (projectError) {
            console.error('Error creating project:', JSON.stringify(projectError, null, 2));
            return NextResponse.json({ 
                error: 'Failed to create project',
                details: projectError.message,
                code: projectError.code
            }, { status: 500 });
        }

        if (!projectPosting || !projectPosting.project_postings_id) {
            console.error('Project posting created but no ID returned');
            return NextResponse.json({ 
                error: 'Failed to create project',
                details: 'No project ID returned'
            }, { status: 500 });
        }

        console.log('Project created with ID:', projectPosting.project_postings_id);
        console.log('Adding skills:', projectData.skill_ids);

        // Then add skills one by one using direct insert to project_skills
        if (projectData.skill_ids && projectData.skill_ids.length > 0) {
            for (const skillId of projectData.skill_ids) {
                try {
                    console.log(`Adding skill ${skillId} to project ${projectPosting.project_postings_id}`);
                    const { error: skillError } = await retryOperation(
                        () => supabase
                            .from('project_skills')
                            .insert({
                                project_posting_id: projectPosting.project_postings_id,
                                skill_id: skillId
                            })
                    );
                    
                    if (skillError) {
                        console.error(`Error adding skill ${skillId}:`, JSON.stringify(skillError, null, 2));
                        // If a skill fails to add, delete the project posting and return error
                        await supabase
                            .from('project_postings')
                            .delete()
                            .eq('project_postings_id', projectPosting.project_postings_id);
                        return NextResponse.json({ 
                            error: 'Failed to add project skills',
                            details: skillError.message,
                            code: skillError.code,
                            skill_id: skillId
                        }, { status: 500 });
                    }
                    console.log(`Successfully added skill ${skillId}`);
                } catch (error) {
                    console.error(`Error adding skill ${skillId}:`, error);
                    // If a skill fails to add, delete the project posting and return error
                    await supabase
                        .from('project_postings')
                        .delete()
                        .eq('project_postings_id', projectPosting.project_postings_id);
                    return NextResponse.json({ 
                        error: 'Failed to add project skills',
                        details: error instanceof Error ? error.message : 'Unknown error',
                        skill_id: skillId
                    }, { status: 500 });
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            project: projectPosting,
            message: `Successfully added ${projectData.skill_ids?.length || 0} skills`
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
        const cookieStore = cookies();
        const supabase = createServerComponentClient({ cookies: () => cookieStore });
        
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
