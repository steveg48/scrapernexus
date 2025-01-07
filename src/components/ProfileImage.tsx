'use client';

interface ProfileImageProps {
  size?: 'sm' | 'md' | 'mlg' | 'lg';
  src?: string | null;
  isMenuIcon?: boolean;
  className?: string;
}

export default function ProfileImage({ size = 'md', src, isMenuIcon = false, className = '' }: ProfileImageProps) {
  const sizeClasses = {
    sm: 'w-[32px] h-[32px]',
    md: 'w-12 h-12',
    mlg: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const borderClasses = isMenuIcon ? 'border-[1.5px]' : 'border';

  if (src) {
    return (
      <img
        src={src}
        alt="Profile"
        className={`${sizeClasses[size]} rounded-full ${borderClasses} border-[#e0e6ef] object-cover ${className}`}
      />
    );
  }

  return (
    <img 
      src="/default-profile.svg"
      alt="Profile"
      className={`${sizeClasses[size]} rounded-full ${borderClasses} border-[#e0e6ef] ${className}`}
    />
  );
}
