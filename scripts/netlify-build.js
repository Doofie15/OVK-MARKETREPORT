#!/usr/bin/env node

/**
 * Netlify Build Optimization Script
 * Runs before the main build to optimize for Netlify deployment
 */

const { execSync } = require('child_process');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');

console.log('🚀 Starting Netlify build optimization...');

// Check if we're in a Netlify environment
const isNetlify = process.env.NETLIFY === 'true';
const deployContext = process.env.CONTEXT || 'development';
const deployUrl = process.env.DEPLOY_URL || process.env.URL;

console.log(`📦 Build context: ${deployContext}`);
console.log(`🌐 Deploy URL: ${deployUrl || 'localhost'}`);

if (isNetlify) {
  // Update analytics endpoint for Netlify
  const analyticsConfig = {
    endpoint: '/api/analytics',
    netlifyOptimized: true,
    deployContext,
    deployUrl,
    timestamp: new Date().toISOString()
  };
  
  // Write build-time config
  writeFileSync(
    join(process.cwd(), 'src', 'config', 'build.json'),
    JSON.stringify(analyticsConfig, null, 2)
  );
  
  console.log('✅ Analytics endpoint configured for Netlify');
  
  // Optimize for branch deploys
  if (deployContext === 'branch-deploy') {
    console.log('🔧 Optimizing for branch deploy...');
    // Add branch-specific optimizations here
  }
  
  // Production optimizations
  if (deployContext === 'production') {
    console.log('🔧 Applying production optimizations...');
    
    // Enable PWA service worker
    process.env.VITE_PWA_ENABLED = 'true';
    
    // Enable analytics tracking
    process.env.VITE_ANALYTICS_ENABLED = 'true';
  }
}

// Update package.json build script if needed
const packageJsonPath = join(process.cwd(), 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  // Ensure we have the netlify build command
  if (!packageJson.scripts['build:netlify']) {
    packageJson.scripts['build:netlify'] = 'node scripts/netlify-build.js && npm run build';
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added Netlify build script to package.json');
  }
}

// Install analytics dependencies if missing
try {
  execSync('npm list react-apexcharts', { stdio: 'ignore' });
  console.log('✅ Analytics dependencies verified');
} catch (error) {
  console.log('📦 Installing missing analytics dependencies...');
  execSync('npm install react-apexcharts leaflet react-leaflet @types/leaflet', { stdio: 'inherit' });
}

console.log('🎉 Netlify build optimization complete!');
