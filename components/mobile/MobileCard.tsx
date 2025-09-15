import React from 'react';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  compact = false,
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`card ${compact ? 'compact' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default MobileCard;