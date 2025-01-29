'use client';

interface ProfileImageProps {
  size?: 'sm' | 'md' | 'mlg' | 'lg';
  src?: string | null;
  isMenuIcon?: boolean;
  className?: string;
  isOnline?: boolean;
}

export default function ProfileImage({ 
  size = 'md', 
  src, 
  isMenuIcon = false, 
  className = '',
  isOnline
}: ProfileImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    mlg: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const statusDotSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    mlg: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const borderClasses = isMenuIcon ? 'border-[1px]' : 'border-2';

  const ImageComponent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt="Profile"
          className={`${sizeClasses[size]} rounded-full ${borderClasses} border-gray-200 object-cover ${className}`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full ${borderClasses} border-gray-200 bg-gray-100 flex items-center justify-center ${className}`}>
        <svg className="w-2/3 h-2/3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      <ImageComponent />
      {isOnline !== undefined && (
        <div
          className={`absolute bottom-0 right-0 ${statusDotSizes[size]} rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}
