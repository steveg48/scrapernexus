import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { File } from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';
import ReviewButton from '@/components/ReviewButton';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const minuteStr = minute.toString().padStart(2, '0');

  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || day % 100 - day % 10 == 10) ? 0 : day % 10];
  return `${month} ${day}${suffix}, ${year} at ${hour12}:${minuteStr} ${period}`;
};

export default async function JobsList() {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw userError;
    }

    if (!user) {
      return null;
    }

    const { data: projectPostings, error: projectsError } = await supabase
      .from('project_postings')
      .select('project_id, title, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });
    
    if (projectsError) {
      throw projectsError;
    }

    if (!projectPostings?.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          No job postings yet. Click "Post a job" to create your first job posting.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {projectPostings.map((job) => (
          <div key={job.project_id} className="bg-white border border-gray-200 p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    <File className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{job.title || 'Untitled'}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ReviewButton jobId={job.project_id} />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-[#59baea] text-white">
                  Open job post
                </span>
                <span className="text-gray-500 text-sm">
                  Created {formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error in JobsList:', error);
    return (
      <div className="text-center py-8 text-red-500">
        An error occurred while loading your job postings. Please try refreshing the page.
      </div>
    );
  }
}
