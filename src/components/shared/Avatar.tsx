import React from 'react';
import { USERS } from '../../data/seed';

interface AvatarProps {
  userId: string;
  size?: 'sm' | 'md';
  ring?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ userId, size = 'sm', ring = false }) => {
  const user = USERS.find(u => u.id === userId);
  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  const ringClass   = ring ? 'ring-2 ring-slate-800' : '';

  return (
    <div
      className={`${sizeClasses} ${ringClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: user.color }}
      title={user.name}
    >
      {initials}
    </div>
  );
};