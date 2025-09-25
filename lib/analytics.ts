/**
 * OVK Analytics Tracker - Privacy-friendly, cookieless analytics
 * 
 * Features:
 * - Cookieless session tracking via localStorage
 * - SPA-aware pageview tracking
 * - Section visibility tracking
 * - PWA install/prompt tracking
 * - Scroll depth tracking
 * - Custom business events (view_report, download_report, bid_click)
 * - Heartbeat tracking for time-on-page
 * - Do Not Track respect (optional)
 */

export type AnalyticsEventType = 
  | 'pageview' | 'heartbeat' | 'click' | 'download' | 'custom'
  | 'section_view' | 'scroll_depth' | 'pwa_install' | 'pwa_prompt_shown' 
  | 'pwa_prompt_result' | 'app_launch' | 'js_error' | 'web_vital'
  | 'view_report' | 'download_report' | 'bid_click';

export type TrackMeta = Record<string, unknown>;

interface AnalyticsConfig {
  functionUrl: string;
  respectDNT: boolean;
  debug: boolean;
  sessionKey: string;
  heartbeatInterval: number;
}

class Analytics {
  private config: AnalyticsConfig;
  private sessionId: string;
  private heartbeatTimer?: number;
  private pageStartTime: number = 0;
  private scrollDepthSent = new Set<number>();
  private deferredPrompt: any = null;
  private visibilityObserver?: IntersectionObserver;
  private sectionVisibilityData = new Map<string, { startTime: number; totalVisible: number }>();

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      functionUrl: '/api/analytics',
      respectDNT: true,
      debug: import.meta.env.VITE_APP_ENV === 'development',
      sessionKey: 'ovk_analytics_session_id',
      heartbeatInterval: 15000, // 15 seconds
      ...config
    };

    // Initialize session ID
    this.sessionId = this.getOrCreateSessionId();
    
    // Set up tracking
    this.setupInitialTracking();
    this.setupEventListeners();
    
    if (this.config.debug) {
      console.log('OVK Analytics initialized', { sessionId: this.sessionId });
    }
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem(this.config.sessionKey);
    if (!sessionId) {
      sessionId = this.generateUUID();
      localStorage.setItem(this.config.sessionKey, sessionId);
    }
    return sessionId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private shouldTrack(): boolean {
    // Respect Do Not Track if enabled
    if (this.config.respectDNT && (navigator as any).doNotTrack === "1") {
      return false;
    }
    
    // Don't track in admin sections (they have their own internal tracking flag)
    if (window.location.pathname.startsWith('/admin')) {
      return false;
    }
    
    return true;
  }

  private async send(type: AnalyticsEventType, meta: TrackMeta = {}): Promise<void> {
    if (!this.shouldTrack()) {
      return;
    }

    try {
      const utm = this.extractUTMParams();
      const payload = {
        session_id: this.sessionId,
        type,
        path: window.location.pathname + window.location.search,
        page_title: document.title,
        referrer: document.referrer || null,
        ua: navigator.userAgent,
        lang: navigator.language,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utm,
        screen_w: window.screen.width,
        screen_h: window.screen.height,
        meta
      };

      if (this.config.debug) {
        console.log('Analytics event:', type, payload);
      }

      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      
      // Use sendBeacon for better reliability, fall back to fetch
      if (navigator.sendBeacon && type !== 'heartbeat') {
        navigator.sendBeacon(this.config.functionUrl, blob);
      } else {
        await fetch(this.config.functionUrl, {
          method: 'POST',
          body: blob,
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          if (this.config.debug) {
            console.warn('Analytics fetch failed:', error);
          }
        });
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('Analytics error:', error);
      }
    }
  }

  private extractUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      term: params.get('utm_term'),
      content: params.get('utm_content')
    };
  }

  private setupInitialTracking(): void {
    // Track initial pageview
    this.trackPageView();
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Track app launch mode (PWA vs browser)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window as any).navigator.standalone;
    this.send('app_launch', { mode: isStandalone ? 'standalone' : 'browser' });
  }

  private setupEventListeners(): void {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.pageStartTime = performance.now();
        this.startHeartbeat();
      } else {
        this.stopHeartbeat();
      }
    });

    // Page unload
    window.addEventListener('beforeunload', () => {
      this.stopHeartbeat();
      this.flushSectionVisibility();
    });

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.send('pwa_prompt_shown');
    });

    // PWA installed
    window.addEventListener('appinstalled', () => {
      this.send('pwa_install');
    });

    // Scroll depth tracking
    let scrollDepthTimer: number;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollDepthTimer);
      scrollDepthTimer = window.setTimeout(() => {
        this.trackScrollDepth();
      }, 300);
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.send('js_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.send('js_error', {
        message: 'Unhandled Promise Rejection',
        reason: event.reason?.toString()
      });
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    this.pageStartTime = performance.now();
    let secondsOnPage = 0;
    
    this.heartbeatTimer = window.setInterval(() => {
      secondsOnPage += this.config.heartbeatInterval / 1000;
      this.send('heartbeat', { 
        seconds_on_page: Math.round(secondsOnPage),
        page_start_time: this.pageStartTime
      });
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private trackScrollDepth(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
    
    // Track at 25%, 50%, 75%, and 100%
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => scrollPercent >= m && !this.scrollDepthSent.has(m));
    
    if (milestone) {
      this.scrollDepthSent.add(milestone);
      this.send('scroll_depth', { percent: milestone });
    }
  }

  private flushSectionVisibility(): void {
    this.sectionVisibilityData.forEach((data, sectionId) => {
      if (data.startTime > 0) {
        data.totalVisible += performance.now() - data.startTime;
      }
      if (data.totalVisible > 0) {
        this.send('section_view', {
          section_id: sectionId,
          ms_visible: Math.round(data.totalVisible)
        });
      }
    });
    this.sectionVisibilityData.clear();
  }

  // Public API methods

  /**
   * Track a pageview (call this on route changes in SPA)
   */
  trackPageView(customPath?: string): void {
    // Reset scroll depth tracking for new page
    this.scrollDepthSent.clear();
    
    // Flush any pending section visibility data
    this.flushSectionVisibility();
    
    const meta: TrackMeta = {};
    if (customPath) {
      meta.custom_path = customPath;
    }
    
    this.send('pageview', meta);
    
    // Restart heartbeat for new page
    this.startHeartbeat();
  }

  /**
   * Track section visibility (call when a component mounts)
   */
  trackSectionVisibility(sectionId: string, element: Element): () => void {
    if (!this.visibilityObserver) {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const id = entry.target.getAttribute('data-section-id');
            if (!id) return;
            
            const data = this.sectionVisibilityData.get(id);
            if (!data) return;
            
            if (entry.isIntersecting) {
              data.startTime = performance.now();
            } else if (data.startTime > 0) {
              data.totalVisible += performance.now() - data.startTime;
              data.startTime = 0;
            }
          });
        },
        { threshold: 0.5 }
      );
    }

    // Set up tracking data
    this.sectionVisibilityData.set(sectionId, { startTime: 0, totalVisible: 0 });
    
    // Add data attribute and observe
    element.setAttribute('data-section-id', sectionId);
    this.visibilityObserver.observe(element);
    
    // Return cleanup function
    return () => {
      this.visibilityObserver?.unobserve(element);
      this.sectionVisibilityData.delete(sectionId);
    };
  }

  /**
   * Track custom events
   */
  track(eventType: AnalyticsEventType, meta: TrackMeta = {}): void {
    this.send(eventType, meta);
  }

  /**
   * Track business-specific events
   */
  trackReportView(reportId: string, auctionId?: string): void {
    this.send('view_report', { 
      report_id: reportId, 
      auction_id: auctionId,
      timestamp: Date.now()
    });
  }

  trackReportDownload(reportId: string, format: string = 'pdf'): void {
    this.send('download_report', { 
      report_id: reportId, 
      format,
      timestamp: Date.now()
    });
  }

  trackBidClick(producerName: string, auctionId?: string): void {
    this.send('bid_click', { 
      producer_name: producerName, 
      auction_id: auctionId,
      timestamp: Date.now()
    });
  }

  /**
   * Handle PWA install prompt
   */
  async promptPWAInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    this.send('pwa_prompt_result', { outcome });
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  /**
   * Track Web Vitals (call this with your web vitals library)
   */
  trackWebVital(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    this.send('web_vital', {
      name,
      value,
      rating,
      timestamp: Date.now()
    });
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Destroy the analytics instance
   */
  destroy(): void {
    this.stopHeartbeat();
    this.flushSectionVisibility();
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
    }
  }
}

// Create singleton instance
export const analytics = new Analytics();

// React hook for easy usage
export function useAnalytics() {
  return {
    trackPageView: (path?: string) => analytics.trackPageView(path),
    trackSectionVisibility: (id: string, element: Element) => analytics.trackSectionVisibility(id, element),
    track: (type: AnalyticsEventType, meta?: TrackMeta) => analytics.track(type, meta),
    trackReportView: (reportId: string, auctionId?: string) => analytics.trackReportView(reportId, auctionId),
    trackReportDownload: (reportId: string, format?: string) => analytics.trackReportDownload(reportId, format),
    trackBidClick: (producerName: string, auctionId?: string) => analytics.trackBidClick(producerName, auctionId),
    promptPWAInstall: () => analytics.promptPWAInstall(),
    trackWebVital: (name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') => analytics.trackWebVital(name, value, rating),
    getSessionId: () => analytics.getSessionId()
  };
}

// Export the analytics instance as default
export default analytics;
