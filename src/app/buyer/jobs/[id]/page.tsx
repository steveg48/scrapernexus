import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Job Details</h1>
      {/* You can add your job details component here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p>Loading job details for ID: {params.id}</p>
      </div>
    </div>
  );
}
