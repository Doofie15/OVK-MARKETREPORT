import React from 'react';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
  optimizedForS25?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  compact = false,
  className = '',
  onClick,
  optimizedForS25 = false
}) => {
  return (
    <div 
      className={`
        card 
        ${compact ? 'compact' : ''} 
        ${onClick ? 'clickable' : ''} 
        ${optimizedForS25 ? 's25-optimized' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        // Enhanced for Samsung S25's high PPI and 120Hz refresh
        willChange: onClick ? 'transform' : 'auto',
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
    >
      <div className={`flex items-center gap-3 mb-4 ${optimizedForS25 ? 's25-spacing' : ''}`}>
        {icon && (
          <div className={`
            ${optimizedForS25 ? 'w-8 h-8' : 'w-6 h-6'} 
            rounded-lg 
            bg-gradient-to-br from-indigo-500 to-purple-600 
            flex items-center justify-center
            shadow-sm
          `}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h2 className={`
            ${optimizedForS25 ? 'text-base' : 'text-sm'} 
            font-bold
          `} style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className={`
              ${optimizedForS25 ? 'text-sm' : 'text-xs'} 
              mt-1
            `} style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className={optimizedForS25 ? 's25-content' : ''}>
        {children}
      </div>
    </div>
  );
};

export default MobileCard;