import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { AuctionReport } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  toasts: Toast[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_report' | 'system' | 'update';
  timestamp: Date;
  read: boolean;
  data?: {
    reportId?: string;
    seasonLabel?: string;
    catalogueName?: string;
    auctionDate?: string;
  };
}

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  duration?: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('ovk-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setIsPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ovk-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Set up real-time subscription for new reports
  useEffect(() => {
    console.log('Setting up real-time subscription for auction reports...');
    
    const channel = supabase
      .channel('auction_reports_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auction_reports',
          filter: 'status=eq.published'
        },
        (payload) => {
          console.log('Report status changed to published:', payload);
          handleNewReport(payload.new as any);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_reports',
          filter: 'status=eq.published'
        },
        (payload) => {
          console.log('New published report inserted:', payload);
          handleNewReport(payload.new as any);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewReport = async (reportData: any) => {
    try {
      // Fetch the complete auction data
      const { data: auction, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', reportData.auction_id)
        .single();

      if (error) {
        console.error('Error fetching auction data:', error);
        return;
      }

      const notification: Notification = {
        id: `report_${reportData.id}_${Date.now()}`,
        title: 'New Market Report Published',
        message: `${auction.season_label} - ${auction.catalogue_name || `Week ${auction.week_id.split('_')[2]}`} market report is now available`,
        type: 'new_report',
        timestamp: new Date(),
        read: false,
        data: {
          reportId: reportData.id,
          seasonLabel: auction.season_label,
          catalogueName: auction.catalogue_name,
          auctionDate: auction.auction_date
        }
      };

      // Add to notifications
      setNotifications(prev => [notification, ...prev]);

      // Show toast notification
      showToast(notification.message, 'success');

      // Send push notification if permission granted
      if (isPermissionGranted && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(notification.title, {
            body: notification.message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: `report_${reportData.id}`,
            data: {
              url: `/${auction.season_label.replace('/', '')}${auction.catalogue_name?.padStart(2, '0') || auction.week_id.split('_')[2].padStart(2, '0')}`,
              reportId: reportData.id
            },
            actions: [
              {
                action: 'view',
                title: 'View Report',
                icon: '/icons/icon-72x72.png'
              },
              {
                action: 'dismiss',
                title: 'Dismiss'
              }
            ] as any,
            requireInteraction: true,
            silent: false
          } as NotificationOptions);
        } catch (error) {
          console.error('Error showing push notification:', error);
        }
      }
    } catch (error) {
      console.error('Error handling new report notification:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setIsPermissionGranted(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPermissionGranted(granted);
      
      if (granted) {
        showToast('Notifications enabled! You\'ll be notified when new reports are published.', 'success');
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const toast: Toast = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date(),
      duration: type === 'error' ? 8000 : 5000
    };

    setToasts(prev => [...prev, toast]);

    // Auto-dismiss toast after duration
    setTimeout(() => {
      dismissToast(toast.id);
    }, toast.duration);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isPermissionGranted,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    showToast,
    dismissToast,
    toasts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
