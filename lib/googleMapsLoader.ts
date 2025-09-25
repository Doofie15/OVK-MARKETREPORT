// Google Maps loader utility
let isGoogleMapsLoaded = false;
let isLoading = false;
const callbacks: Array<() => void> = [];

export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      resolve();
      return;
    }

    // Add to callback queue
    callbacks.push(() => resolve());

    // If already loading, don't load again
    if (isLoading) {
      return;
    }

    isLoading = true;

  // Get API key from admin settings or environment
  const apiKey = localStorage.getItem('admin_google_maps_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    reject(new Error('Google Maps API key not configured. Please set it in Admin Settings.'));
    return;
  }

  // Create script element
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      isLoading = false;
      // Execute all callbacks
      callbacks.forEach(callback => callback());
      callbacks.length = 0; // Clear callbacks
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    // Append to head
    document.head.appendChild(script);
  });
};

export const isGoogleMapsReady = (): boolean => {
  return isGoogleMapsLoaded && window.google && window.google.maps;
};
