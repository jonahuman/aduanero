import React from 'react';
import { Loader2 } from 'lucide-react';

interface MiniLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MiniLoading: React.FC<MiniLoadingProps> = ({ 
  message = "Cargando...", 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};