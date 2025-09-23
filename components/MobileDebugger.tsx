import React, { useState, useEffect } from 'react';

interface MobileDebuggerProps {
  enabled?: boolean;
}

interface DebugInfo {
  userAgent: string;
  screenSize: string;
  viewport: string;
  devicePixelRatio: number;
  touchSupport: boolean;
  orientation: string;
  connection?: string;
  memory?: number;
  errors: string[];
}

const MobileDebugger: React.FC<MobileDebuggerProps> = ({ enabled = false }) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Capture console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setErrors(prev => [...prev, args.join(' ')]);
      originalConsoleError(...args);
    };

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `Unhandled Error: ${event.message} at ${event.filename}:${event.lineno}`]);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, `Unhandled Promise Rejection: ${event.reason}`]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Collect debug info
    const collectDebugInfo = () => {
      const info: DebugInfo = {
        userAgent: navigator.userAgent,
        screenSize: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window,
        orientation: screen.orientation?.type || 'unknown',
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        errors: errors
      };
      setDebugInfo(info);
    };

    collectDebugInfo();
    const interval = setInterval(collectDebugInfo, 5000);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      clearInterval(interval);
    };
  }, [enabled, errors]);

  if (!enabled || !debugInfo) return null;

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-red-600 text-white p-2 rounded-full shadow-lg"
        style={{ fontSize: '12px' }}
      >
        🐛
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Mobile Debug Info</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Device Info</h4>
                <div className="text-xs space-y-1 font-mono bg-gray-100 p-2 rounded">
                  <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
                  <div><strong>Screen:</strong> {debugInfo.screenSize}</div>
                  <div><strong>Viewport:</strong> {debugInfo.viewport}</div>
                  <div><strong>Device Pixel Ratio:</strong> {debugInfo.devicePixelRatio}</div>
                  <div><strong>Touch Support:</strong> {debugInfo.touchSupport ? 'Yes' : 'No'}</div>
                  <div><strong>Orientation:</strong> {debugInfo.orientation}</div>
                  <div><strong>Connection:</strong> {debugInfo.connection}</div>
                  <div><strong>Memory Usage:</strong> {Math.round((debugInfo.memory || 0) / 1024 / 1024)}MB</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Environment</h4>
                <div className="text-xs space-y-1 font-mono bg-gray-100 p-2 rounded">
                  <div><strong>Supabase URL:</strong> {(import.meta as any).env?.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
                  <div><strong>Supabase Key:</strong> {(import.meta as any).env?.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
                  <div><strong>Mode:</strong> {(import.meta as any).env?.MODE || 'unknown'}</div>
                  <div><strong>Dev:</strong> {(import.meta as any).env?.DEV ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-red-600">Errors ({errors.length})</h4>
                  <div className="text-xs space-y-1 font-mono bg-red-50 p-2 rounded max-h-32 overflow-auto">
                    {errors.slice(-10).map((error, index) => (
                      <div key={index} className="text-red-700">{error}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setErrors([])}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-xs"
                >
                  Clear Errors
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileDebugger;
