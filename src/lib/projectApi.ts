interface ProjectPostingData {
    buyer_id: string;  // Changed from number to string for UUID compatibility
    title: string;
    description: string;
    frequency: string;
    budget_min: number | null;
    budget_max: number | null;
    budget_fixed_price: number | null;
    project_budget_type: string;
    project_location: string;
    project_scope: string;
    project_type: string;
    skill_ids: number[];  // Array of skill IDs
}

/**
 * Inserts a new project with associated skills using the Supabase RPC endpoint
 * @param projectData The project data including skills
 * @returns Promise<number> The ID of the created project
 * @throws Error if the API call fails
 */
export async function insertProjectWithSkills(projectData: ProjectPostingData): Promise<number> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
    }

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/insert_project_with_skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Prefer': 'return=minimal'  // This tells Supabase to return just the result
            },
            body: JSON.stringify({
                buyer_id: projectData.buyer_id,
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
                skill_ids: projectData.skill_ids
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Failed to create project. Status: ${response.status}. ${
                    errorData ? `Error: ${JSON.stringify(errorData)}` : ''
                }`
            );
        }

        // The response will be the project_id as per the Supabase function
        const project_id = await response.json();
        return project_id;

    } catch (error) {
        console.error('Error inserting project:', error);
        throw error;
    }
}

/**
 * Helper function to validate project data before submission
 * @param data The project data to validate
 * @throws Error if validation fails
 */
export function validateProjectData(data: ProjectPostingData): void {
    const requiredFields: (keyof ProjectPostingData)[] = [
        'buyer_id',
        'title',
        'description',
        'frequency',
        'project_budget_type',
        'project_location',
        'project_scope',
        'project_type',
        'skill_ids'
    ];

    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    if (!Array.isArray(data.skill_ids) || data.skill_ids.length === 0) {
        throw new Error('At least one skill must be specified');
    }

    if (data.project_budget_type === 'fixed' && !data.budget_fixed_price) {
        throw new Error('Fixed price projects must specify a budget_fixed_price');
    }

    if (data.project_budget_type === 'hourly' && (!data.budget_min || !data.budget_max)) {
        throw new Error('Hourly projects must specify both budget_min and budget_max');
    }
}
