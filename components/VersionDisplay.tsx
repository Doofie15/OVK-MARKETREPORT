import React, { useState } from 'react';
import { getVersionString, getFullVersionString, getBuildInfo, VERSION_CONFIG } from '../config/version';

interface VersionDisplayProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'inline';
  size?: 'xs' | 'sm' | 'md';
  showBuildInfo?: boolean;
  className?: string;
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({
  position = 'bottom-right',
  size = 'xs',
  showBuildInfo = false,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    md: 'text-md'
  };

  const positionClasses = {
    'bottom-left': 'fixed bottom-2 left-2 z-50',
    'bottom-right': 'fixed bottom-2 right-2 z-50',
    'top-left': 'fixed top-2 left-2 z-50',
    'top-right': 'fixed top-2 right-2 z-50',
    'inline': ''
  };

  const envColor = {
    development: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    staging: 'bg-blue-100 text-blue-800 border-blue-200',
    production: 'bg-green-100 text-green-800 border-green-200'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    ${positionClasses[position]}
    ${envColor[VERSION_CONFIG.environment]}
    px-2 py-1 rounded border font-mono cursor-pointer transition-all duration-200
    hover:shadow-md select-none
    ${className}
  `.trim();

  return (
    <div 
      className={baseClasses}
      onClick={() => setShowDetails(!showDetails)}
      title={showBuildInfo ? getBuildInfo() : getFullVersionString()}
    >
      <div className="flex items-center gap-1">
        <span>{getVersionString()}</span>
        {VERSION_CONFIG.environment !== 'production' && (
          <span className="opacity-75">
            ({VERSION_CONFIG.environment.charAt(0).toUpperCase()})
          </span>
        )}
      </div>
      
      {showDetails && (
        <div className="absolute bottom-full mb-2 left-0 min-w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
          <div className="font-semibold mb-2">Version Details</div>
          <div className="space-y-1 text-gray-600">
            <div><span className="font-medium">Version:</span> {VERSION_CONFIG.version}</div>
            <div><span className="font-medium">Build:</span> {VERSION_CONFIG.buildNumber}</div>
            <div><span className="font-medium">Date:</span> {VERSION_CONFIG.buildDate}</div>
            <div><span className="font-medium">Environment:</span> {VERSION_CONFIG.environment}</div>
            {VERSION_CONFIG.gitCommit && (
              <div><span className="font-medium">Commit:</span> {VERSION_CONFIG.gitCommit.slice(0, 8)}</div>
            )}
          </div>
          
          {VERSION_CONFIG.features.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="font-medium mb-1">Latest Features:</div>
              <div className="space-y-0.5">
                {VERSION_CONFIG.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="text-gray-600">• {feature}</div>
                ))}
                {VERSION_CONFIG.features.length > 3 && (
                  <div className="text-gray-500">+ {VERSION_CONFIG.features.length - 3} more...</div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-2 pt-2 border-t border-gray-200 text-gray-500">
            Click to close
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionDisplay;
