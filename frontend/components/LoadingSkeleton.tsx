import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'button' | 'circle';
  className?: string;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  className = '',
  lines = 1
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`card p-6 ${className}`}>
            <div className="loading-skeleton h-6 w-3/4 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="loading-skeleton h-4 w-full"></div>
              ))}
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className={`loading-skeleton h-12 w-32 rounded-xl ${className}`}></div>
        );
      
      case 'circle':
        return (
          <div className={`loading-skeleton w-12 h-12 rounded-full ${className}`}></div>
        );
      
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className={`loading-skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
              ></div>
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

// Predefined skeleton layouts
export const CourtCardSkeleton: React.FC = () => (
  <div className="card p-6 animate-pulse">
    <div className="text-center mb-6">
      <div className="loading-skeleton h-8 w-32 mx-auto mb-3"></div>
      <div className="loading-skeleton h-4 w-48 mx-auto"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="loading-skeleton h-6 w-24 mx-auto"></div>
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="loading-skeleton h-12 w-full rounded-xl"></div>
          ))}
        </div>
      ))}
    </div>
    
    <div className="space-y-3">
      <div className="loading-skeleton h-12 w-full rounded-xl"></div>
      <div className="loading-skeleton h-12 w-full rounded-xl"></div>
    </div>
  </div>
);

export const TeamCardSkeleton: React.FC = () => (
  <div className="card-glass border-gray-300 p-6 animate-pulse">
    <div className="loading-skeleton h-6 w-32 mx-auto mb-4"></div>
    <div className="loading-skeleton h-4 w-40 mx-auto mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="loading-skeleton h-12 w-full rounded-xl"></div>
      ))}
    </div>
  </div>
);

export const QueueSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <TeamCardSkeleton key={i} />
    ))}
  </div>
); 