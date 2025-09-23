import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAUpdateEvent extends Event {
  waiting?: ServiceWorker;
}

const EnhancedPWAManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    
    // Reset dismissal after a week
    if (dismissed === 'true' && dismissedTime && (now - parseInt(dismissedTime)) > oneWeek) {
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-dismissed-time');
      setIsDismissed(false);
    } else {
      setIsDismissed(dismissed === 'true');
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('PWA install prompt deferred');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-dismissed-time');
    };

    // Service Worker update detection
    const handleSWUpdate = (event: PWAUpdateEvent) => {
      if (event.waiting) {
        setWaitingWorker(event.waiting);
        setShowUpdatePrompt(true);
      }
    };

    // Register service worker and listen for updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates every 30 seconds when app is active
          setInterval(() => {
            registration.update();
          }, 30000);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitor data loading state
  useEffect(() => {
    const checkDataLoaded = () => {
      // Check if main content is loaded (you can customize this logic)
      const mainContent = document.querySelector('[data-testid="main-content"]') || 
                         document.querySelector('.card') ||
                         document.querySelector('main');
      
      if (mainContent && !isDataLoaded) {
        setIsDataLoaded(true);
        
        // Show install prompt after data is loaded and user has had time to see the content
        setTimeout(() => {
          if (deferredPrompt && !isDismissed && !isStandalone) {
            setShowInstallPrompt(true);
          }
        }, 5000); // Wait 5 seconds after data loads
      }
    };

    // Check immediately
    checkDataLoaded();

    // Also check periodically in case content loads dynamically
    const interval = setInterval(checkDataLoaded, 1000);

    return () => clearInterval(interval);
  }, [deferredPrompt, isDismissed, isStandalone, isDataLoaded]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        handleDismiss();
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    setIsDismissed(true);
  };

  const handleUpdateClick = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleUpdateDismiss = () => {
    setShowUpdatePrompt(false);
  };

  const showInstallButton = () => {
    if (deferredPrompt && !isDismissed && !isStandalone) {
      setShowInstallPrompt(true);
    }
  };

  // Floating install button (always available)
  const InstallButton = () => {
    if (isStandalone || (!deferredPrompt && !isIOS)) return null;

    return (
      <button
        onClick={isIOS ? () => alert('To install: Tap Share → Add to Home Screen') : showInstallButton}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Install App"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    );
  };

  return (
    <>
      {/* Update Available Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Update Available</h3>
                  <p className="text-green-100 text-xs sm:text-sm">
                    A new version of the app is ready to install
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUpdateClick}
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Update Now
                </button>
                <button
                  onClick={handleUpdateDismiss}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base">Install OVK Wool Market App</h3>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Get instant access to wool market reports on your home screen
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Install</span>
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  aria-label="Dismiss install prompt"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Install Button */}
      <InstallButton />

      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EnhancedPWAManager;
