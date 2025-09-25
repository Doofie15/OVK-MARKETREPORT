/**
 * Application Version Configuration
 * Update this file when releasing new versions
 */

export interface VersionInfo {
  version: string;
  buildDate: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: string[];
  gitCommit?: string;
}

export const VERSION_CONFIG: VersionInfo = {
  version: '1.2.1',
  buildDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  buildNumber: generateBuildNumber(),
  environment: import.meta.env.PROD ? 'production' : 'development',
  features: [
    'Compact auction table rows',
    'Season filtering',
    'Supabase database integration',
    'Enhanced UI/UX',
    'Mobile responsive design'
  ],
  gitCommit: '443dbae4e5e21863b16f41f61dd2a4663b47b230'
};

function generateBuildNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  
  return `${year}${month}${day}.${hour}${minute}`;
}

export const getVersionString = (): string => {
  return `v${VERSION_CONFIG.version}`;
};

export const getFullVersionString = (): string => {
  return `v${VERSION_CONFIG.version} (${VERSION_CONFIG.buildNumber})`;
};

export const getBuildInfo = (): string => {
  const env = VERSION_CONFIG.environment.charAt(0).toUpperCase() + VERSION_CONFIG.environment.slice(1);
  return `${env} • Build ${VERSION_CONFIG.buildNumber} • ${VERSION_CONFIG.buildDate}`;
};
