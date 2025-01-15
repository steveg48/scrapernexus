-- Create project_postings table
CREATE TABLE IF NOT EXISTS project_postings (
    project_id BIGSERIAL PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    budget_fixed_price DECIMAL(10,2),
    project_budget_type VARCHAR(50) NOT NULL,
    project_location VARCHAR(100) NOT NULL,
    project_scope VARCHAR(50) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    data_fields JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_skills junction table
CREATE TABLE IF NOT EXISTS project_skills (
    project_id BIGINT REFERENCES project_postings(project_id) ON DELETE CASCADE,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, skill_id)
);

-- Create function to add project skills
CREATE OR REPLACE FUNCTION add_project_skill(
    p_project_posting_id BIGINT,
    p_skill_id BIGINT
) RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO project_skills (project_id, skill_id)
    VALUES (p_project_posting_id, p_skill_id);
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
