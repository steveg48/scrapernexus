import { NextResponse } from 'next/server';
import { insertProjectWithSkills, validateProjectData } from '@/lib/projectApi';
import type { ProjectPostingData } from '@/lib/projectApi';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validate the incoming data
        validateProjectData(data as ProjectPostingData);
        
        // Insert the project and get the project ID
        const project_id = await insertProjectWithSkills(data as ProjectPostingData);
        
        // Return success response with the project ID
        return NextResponse.json({ 
            success: true, 
            project_id 
        }, { 
            status: 201 
        });

    } catch (error) {
        console.error('Error in POST /api/projects:', error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, {
            status: 400
        });
    }
}
