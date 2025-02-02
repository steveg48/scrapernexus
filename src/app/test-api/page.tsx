'use client';

import { useState } from 'react';

export default function TestAPI() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testProjectData = {
        buyer_id: 1,
        title: "Test Project",
        description: "This is a test project to verify the API",
        frequency: "weekly",
        budget_min: 1000,
        budget_max: 2000,
        budget_fixed_price: null,
        project_budget_type: "hourly",
        project_location: "remote",
        project_scope: "medium",
        project_type: "standard",
        skill_ids: [1, 2, 3]  // Make sure these skill IDs exist in your database
    };

    const testApi = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testProjectData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create project');
            }

            setResult(data);
            
            // If successful, let's verify the data was inserted
            if (data.project_postings_id) {
                setLoading(false);
                console.log('Project created successfully with ID:', data.project_postings_id);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error testing API:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
                
                {/* Test Data Display */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Test Data to Send:</h2>
                    <pre className="bg-gray-50 p-4 rounded overflow-auto">
                        {JSON.stringify(testProjectData, null, 2)}
                    </pre>
                </div>

                {/* Test Button */}
                <button
                    onClick={testApi}
                    disabled={loading}
                    className="mb-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Testing...' : 'Test API'}
                </button>

                {/* Results Display */}
                {result && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2 text-green-800">Success!</h2>
                        <pre className="bg-white p-4 rounded overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2 text-red-800">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
