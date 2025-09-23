import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationSettings: React.FC = () => {
  const { isPermissionGranted, requestPermission, showToast } = useNotifications();
  const [settings, setSettings] = useState({
    newReports: true,
    systemUpdates: true,
    marketAlerts: false,
    weeklyDigest: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
    
    showToast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${value ? 'enabled' : 'disabled'}`, 'success');
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      showToast('Push notifications enabled successfully!', 'success');
    } else {
      showToast('Failed to enable push notifications. Please check your browser settings.', 'error');
    }
  };

  const testNotification = () => {
    if (isPermissionGranted) {
      showToast('This is a test notification!', 'info');
      
      // Also show a browser notification
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('OVK Wool Market - Test Notification', {
            body: 'This is a test notification to verify your settings are working correctly.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'test-notification',
            requireInteraction: false
          });
        });
      }
    } else {
      showToast('Please enable notifications first to test them.', 'warning');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage how you receive notifications about market reports and updates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={testNotification}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Test
          </button>
        </div>
      </div>

      {/* Permission Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        isPermissionGranted 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isPermissionGranted ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {isPermissionGranted ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            <div>
              <p className={`font-medium ${
                isPermissionGranted ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {isPermissionGranted ? 'Push Notifications Enabled' : 'Push Notifications Disabled'}
              </p>
              <p className={`text-sm ${
                isPermissionGranted ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {isPermissionGranted 
                  ? 'You will receive browser notifications when new reports are published'
                  : 'Enable push notifications to receive alerts when new reports are published'
                }
              </p>
            </div>
          </div>
          {!isPermissionGranted && (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Enable
            </button>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Notification Preferences</h3>
        
        <div className="space-y-3">
          {/* New Reports */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">New Market Reports</p>
              <p className="text-sm text-gray-600">Get notified when new auction reports are published</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.newReports}
                onChange={(e) => handleSettingChange('newReports', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* System Updates */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">System Updates</p>
              <p className="text-sm text-gray-600">Get notified about app updates and maintenance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.systemUpdates}
                onChange={(e) => handleSettingChange('systemUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Market Alerts */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Market Alerts</p>
              <p className="text-sm text-gray-600">Get notified about significant market changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.marketAlerts}
                onChange={(e) => handleSettingChange('marketAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Weekly Digest</p>
              <p className="text-sm text-gray-600">Receive a weekly summary of market activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Browser Support Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Browser Support</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Chrome/Edge:</strong> Full notification support including actions</p>
          <p>• <strong>Firefox:</strong> Basic notification support</p>
          <p>• <strong>Safari:</strong> Limited notification support</p>
          <p>• <strong>Mobile:</strong> Works best when app is installed to home screen</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
