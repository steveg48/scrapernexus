'use client';

interface ReviewButtonProps {
  jobId: number;
}

export default function ReviewButton({ jobId }: ReviewButtonProps) {
  const handleClick = () => {
    // TODO: Implement review functionality
    console.log('Review job:', jobId);
  };

  return (
    <button 
      onClick={handleClick}
      className="px-6 py-2.5 bg-[#14a800] text-white rounded-md hover:bg-[#14a800]/90 font-medium"
    >
      Review proposals
    </button>
  );
}
