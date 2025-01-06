'use client';

interface ProfileImageProps {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  isMenuIcon?: boolean;
}

export default function ProfileImage({ size = 'md', src, isMenuIcon = false }: ProfileImageProps) {
  const sizeClasses = {
    sm: 'w-[32px] h-[32px]',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const borderClasses = isMenuIcon ? 'border-[1.5px]' : 'border';

  if (src) {
    return (
      <img
        src={src}
        alt="Profile"
        className={`${sizeClasses[size]} rounded-full ${borderClasses} border-[#e0e6ef] object-cover`}
      />
    );
  }

  return (
    <img 
      src="/images/default-avatar.svg"
      alt="Profile"
      className={`${sizeClasses[size]} rounded-full ${borderClasses} border-[#e0e6ef]`}
    />
  );
}
