import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface APISettings {
  googleMapsApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  analyticsEnabled: boolean;
  ipSalt: string;
  companyName: string;
  companyEmail: string;
  allowedDomains: string[];
}

interface SystemSettings {
  maintenanceMode: boolean;
  debugMode: boolean;
  cacheEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'system' | 'analytics'>('api');
  const [apiSettings, setApiSettings] = useState<APISettings>({
    googleMapsApiKey: '',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    analyticsEnabled: true,
    ipSalt: '',
    companyName: 'OVK Wool Market',
    companyEmail: '',
    allowedDomains: []
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Try to load settings from Supabase (company-specific settings)
      const { data: settingsData, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (settingsData && !error) {
        setApiSettings(prev => ({
          ...prev,
          ...settingsData.api_settings
        }));
        setSystemSettings(prev => ({
          ...prev,
          ...settingsData.system_settings
        }));
      } else {
        // Load from environment variables as fallback
        setApiSettings(prev => ({
          ...prev,
          googleMapsApiKey: localStorage.getItem('admin_google_maps_key') || '',
          ipSalt: localStorage.getItem('admin_ip_salt') || generateRandomSalt(),
          companyName: localStorage.getItem('admin_company_name') || 'OVK Wool Market',
          companyEmail: localStorage.getItem('admin_company_email') || '',
          allowedDomains: JSON.parse(localStorage.getItem('admin_allowed_domains') || '[]')
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setErrorMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      
      // Save to localStorage (immediate effect)
      localStorage.setItem('admin_google_maps_key', apiSettings.googleMapsApiKey);
      localStorage.setItem('admin_ip_salt', apiSettings.ipSalt);
      localStorage.setItem('admin_company_name', apiSettings.companyName);
      localStorage.setItem('admin_company_email', apiSettings.companyEmail);
      localStorage.setItem('admin_allowed_domains', JSON.stringify(apiSettings.allowedDomains));
      localStorage.setItem('admin_analytics_enabled', apiSettings.analyticsEnabled.toString());

      // Try to save to Supabase (for persistence)
      const settingsPayload = {
        api_settings: apiSettings,
        system_settings: systemSettings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_settings')
        .upsert(settingsPayload, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.warn('Could not save to database, using localStorage only:', error);
      }

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Update analytics configuration
      if (window.analytics) {
        window.analytics.updateConfig({
          enabled: apiSettings.analyticsEnabled,
          endpoint: '/api/analytics'
        });
      }

    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const generateRandomSalt = () => {
    return 'ovk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const testGoogleMaps = () => {
    if (!apiSettings.googleMapsApiKey) {
      setErrorMessage('Please enter a Google Maps API key first');
      return;
    }
    
    window.open(`https://maps.googleapis.com/maps/api/js?key=${apiSettings.googleMapsApiKey}&libraries=geometry`, '_blank');
  };

  const addDomain = () => {
    const domain = prompt('Enter domain (e.g., yourcompany.com):');
    if (domain && !apiSettings.allowedDomains.includes(domain)) {
      setApiSettings(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, domain]
      }));
    }
  };

  const removeDomain = (domain: string) => {
    setApiSettings(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Admin Settings</h2>
            <p className="text-purple-100">
              Configure API keys, system settings, and company preferences. Settings are saved per company and work across deployments.
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'api', name: 'API Keys', icon: '🔐' },
            { id: 'system', name: 'System', icon: '⚙️' },
            { id: 'analytics', name: 'Analytics', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Maps Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                </label>
                <div className="flex space-x-3">
                  <input
                    type="password"
                    value={apiSettings.googleMapsApiKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="AIzaSyD3wWF2a8TwWnXG7W_8ALtydF1si4JCpOY"
                  />
                  <button
                    onClick={testGoogleMaps}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Test
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Required for geographic analytics maps. Get your key from Google Cloud Console.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={apiSettings.companyName}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={apiSettings.companyEmail}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="admin@yourcompany.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP Hash Salt (Privacy Protection)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={apiSettings.ipSalt}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, ipSalt: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="ovk-unique-salt-string"
                  />
                  <button
                    onClick={() => setApiSettings(prev => ({ ...prev, ipSalt: generateRandomSalt() }))}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used for POPIA-compliant IP hashing. Change this to invalidate all existing IP hashes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Domains
                </label>
                <div className="space-y-2">
                  {apiSettings.allowedDomains.map((domain) => (
                    <div key={domain} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm">{domain}</span>
                      <button
                        onClick={() => removeDomain(domain)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDomain}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Domain
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Domains that are allowed to send analytics data to your platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Debug Mode</h4>
                  <p className="text-sm text-gray-500">Enable detailed logging and error messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.debugMode}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Cache Enabled</h4>
                  <p className="text-sm text-gray-500">Enable caching for better performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.cacheEnabled}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, cacheEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={systemSettings.backupFrequency}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, backupFrequency: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Enable Analytics</h4>
                  <p className="text-sm text-gray-500">Collect visitor and usage analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apiSettings.analyticsEnabled}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, analyticsEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Analytics Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Geographic visitor mapping (world and South Africa)</li>
                  <li>• Auction engagement tracking</li>
                  <li>• Real-time user activity</li>
                  <li>• Privacy-compliant data collection (POPIA)</li>
                  <li>• Cookieless session tracking</li>
                  <li>• Section visibility analytics</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Privacy Information</h4>
                <p className="text-sm text-yellow-800">
                  All analytics data is collected in compliance with POPIA (Protection of Personal Information Act). 
                  No personal information is stored, and IP addresses are hashed with daily rotation for privacy protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={loadSettings}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          disabled={saving}
        >
          Reset
        </button>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
