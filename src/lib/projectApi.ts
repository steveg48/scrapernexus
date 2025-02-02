import { createBrowserClient } from '@/lib/supabase';

interface ProjectPostingData {
    buyer_id: string;  // Changed from number to string for UUID compatibility
    title: string;
    description: string;
    frequency: 'one-time' | 'weekly' | 'monthly' | 'yearly';
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
 * Inserts a new project with associated skills using Supabase
 * @param projectData The project data including skills
 * @returns Promise<string> The ID of the created project
 * @throws Error if the API call fails
 */
export async function insertProjectWithSkills(projectData: ProjectPostingData): Promise<string> {
    const supabase = createBrowserClient();

    try {
        // Debug logging before insert
        console.log('Attempting to insert project with data:', {
            project_name: projectData.title,
            project_description: projectData.description,
            status: 'active',
            project_owner_id: projectData.buyer_id
        });

        // First, create the base project
        const { data: baseProject, error: baseProjectError } = await supabase
            .from('projects')
            .insert({
                project_name: projectData.title,
                project_description: projectData.description,
                status: 'active',
                project_owner_id: projectData.buyer_id
            })
            .select()
            .single();

        if (baseProjectError) {
            console.error('Error creating base project:', baseProjectError);
            // Log the full error object for debugging
            console.error('Full error object:', JSON.stringify(baseProjectError, null, 2));
            throw new Error(`Failed to create base project: ${baseProjectError.message}`);
        }

        if (!baseProject) {
            throw new Error('Failed to create base project: No project data returned');
        }

        console.log('Successfully created base project:', baseProject);

        // Then, create the project posting
        const { data: project, error: projectError } = await supabase
            .from('project_postings')
            .insert({
                project_postings_id: baseProject.project_postings_id,
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
                project_type: projectData.project_type
            })
            .select()
            .single();

        if (projectError) {
            console.error('Error creating project posting:', projectError);
            throw new Error(`Failed to create project posting: ${projectError.message}`);
        }

        if (!project) {
            throw new Error('Failed to create project posting: No project data returned');
        }

        console.log('Successfully created project posting:', project);

        // Then, insert the project skills
        if (projectData.skill_ids.length > 0) {
            const projectSkills = projectData.skill_ids.map(skill_id => ({
                project_postings_id: baseProject.project_postings_id,
                skill_id
            }));

            const { error: skillsError } = await supabase
                .from('project_skills')
                .insert(projectSkills);

            if (skillsError) {
                console.error('Error inserting project skills:', skillsError);
                throw new Error(`Failed to add skills to project: ${skillsError.message}`);
            }
        }

        return baseProject.project_postings_id;

    } catch (error) {
        console.error('Error in insertProjectWithSkills:', error);
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

    // Validate frequency enum
    const validFrequencies = ['one-time', 'weekly', 'monthly'];
    if (!validFrequencies.includes(data.frequency)) {
        throw new Error('Invalid frequency value');
    }

    if (data.project_budget_type === 'fixed' && !data.budget_fixed_price) {
        throw new Error('Fixed price projects must specify a budget_fixed_price');
    }

    if (data.project_budget_type === 'hourly' && (!data.budget_min || !data.budget_max)) {
        throw new Error('Hourly projects must specify both budget_min and budget_max');
    }
}
