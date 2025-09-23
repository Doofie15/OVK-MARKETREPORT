import React, { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const SimplePWAManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if mobile device
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Only proceed if not already installed and on mobile
    if (standalone || !mobile) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install banner after 5 seconds
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS devices, show banner after 5 seconds
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) {
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle install click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setShowInstallBanner(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error during install prompt:', error);
      }
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // For iOS, show instructions
      alert('To install this app:\n1. Tap the Share button\n2. Select "Add to Home Screen"');
      setShowInstallBanner(false);
    }
  };

  // Handle dismiss by clicking outside
  const handleDismiss = () => {
    setShowInstallBanner(false);
  };

  // Handle touch events for swipe up
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientY;
    const swipeDistance = touchStart - touchEnd;

    // If swiped up more than 50px, dismiss the banner
    if (swipeDistance > 50) {
      setShowInstallBanner(false);
    }

    setTouchStart(null);
  };

  // Don't render if not mobile or already installed
  if (!isMobile || isStandalone || !showInstallBanner) return null;

  return (
    <>
      {/* Backdrop - clicking anywhere dismisses the banner */}
      <div 
        className="fixed inset-0 z-40"
        onClick={handleDismiss}
      />
      
      {/* Install Banner */}
      <div 
        ref={bannerRef}
        className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl rounded-t-2xl animate-slide-up"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-primary)'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-2">
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/assets/logos/ovk-logo-embedded.svg" 
              alt="OVK Logo" 
              className="w-16 h-16 rounded-xl shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Install OVK Wool Market
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Add to your home screen for quick access
              </p>
            </div>
          </div>
          
          <button
            onClick={handleInstallClick}
            className="w-full font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: 'var(--ovk-primary)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ovk-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ovk-primary)';
            }}
          >
            Install App
          </button>
          
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
            Tap anywhere outside or swipe up to dismiss
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SimplePWAManager;
