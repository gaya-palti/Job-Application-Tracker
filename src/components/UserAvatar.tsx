import React from 'react';

interface UserAvatarProps {
  name: string;
  photoURL?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ name, photoURL, size = 'md', className = '' }: UserAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-xl md:w-32 md:h-32 md:text-3xl',
  };

  if (photoURL) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-surface-container-highest border border-white/10 ${className}`}>
        <img
          className="w-full h-full object-cover"
          src={photoURL}
          alt={name}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-on-primary font-bold tracking-wider border border-white/10 shadow-lg shadow-primary/10 ${className}`}>
      {getInitials(name)}
    </div>
  );
}
