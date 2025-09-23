import React, { useState, useEffect } from 'react';

interface OVKLoadingSpinnerProps {
  message?: string;
  showProgress?: boolean;
}

const OVKLoadingSpinner: React.FC<OVKLoadingSpinnerProps> = ({ 
  message = "Loading auction data...",
  showProgress = true 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Stop at 95% to avoid completing before actual load
        return prev + Math.random() * 15; // Random increment for realistic feel
      });
    }, 200);

    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
      <div className="text-center max-w-md mx-auto px-6">
        {/* Prominent Large Logo with Float Animation */}
        <div className="relative mb-12">
          <img 
            src="/assets/logos/ovk-logo-embedded.svg" 
            alt="OVK Logo" 
            className="h-48 w-48 mx-auto object-contain animate-bounce"
            style={{ 
              filter: 'drop-shadow(0 12px 48px rgba(59, 130, 246, 0.4))',
              animationDuration: '2s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Loading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
              {/* Progress Bar Fill */}
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                
                {/* Moving Highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50 animate-pulse" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Brand Footer */}
        <div className="mt-8 text-xs text-gray-400">
          <p>Powered by OVK Market Intelligence</p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

    </div>
  );
};

export default OVKLoadingSpinner;
