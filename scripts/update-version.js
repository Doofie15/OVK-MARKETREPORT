#!/usr/bin/env node

/**
 * Version Update Script
 * Usage: node scripts/update-version.js [major|minor|patch|version]
 * Examples:
 *   node scripts/update-version.js patch    // 1.2.0 -> 1.2.1
 *   node scripts/update-version.js minor    // 1.2.0 -> 1.3.0
 *   node scripts/update-version.js major    // 1.2.0 -> 2.0.0
 *   node scripts/update-version.js 1.5.0    // Set specific version
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const VERSION_FILE = path.join(process.cwd(), 'config/version.ts');
const PACKAGE_FILE = path.join(process.cwd(), 'package.json');

function parseVersion(versionString) {
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${versionString}`);
  }
  
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

function incrementVersion(currentVersion, increment) {
  const version = parseVersion(currentVersion);
  
  switch (increment) {
    case 'major':
      return `${version.major + 1}.0.0`;
    case 'minor':
      return `${version.major}.${version.minor + 1}.0`;
    case 'patch':
      return `${version.major}.${version.minor}.${version.patch + 1}`;
    default:
      // Assume it's a specific version string
      parseVersion(increment); // Validate format
      return increment;
  }
}

async function getGitCommit() {
  try {
    const { stdout } = await execAsync('git rev-parse HEAD');
    return stdout.trim();
  } catch (error) {
    console.warn('Warning: Could not get git commit hash');
    return undefined;
  }
}

async function updateVersionFile(newVersion, gitCommit) {
  const versionContent = fs.readFileSync(VERSION_FILE, 'utf8');
  
  // Update version
  let updatedContent = versionContent.replace(
    /version: '[^']*'/,
    `version: '${newVersion}'`
  );
  
  // Update build date
  const buildDate = new Date().toISOString().split('T')[0];
  updatedContent = updatedContent.replace(
    /buildDate: '[^']*'/,
    `buildDate: '${buildDate}'`
  );
  
  // Update git commit if available
  if (gitCommit) {
    if (updatedContent.includes('gitCommit:')) {
      updatedContent = updatedContent.replace(
        /gitCommit: [^,\n]*/,
        `gitCommit: '${gitCommit}'`
      );
    } else {
      updatedContent = updatedContent.replace(
        /environment: [^,\n]*,/,
        `environment: import.meta.env.PROD ? 'production' : 'development',\n  gitCommit: '${gitCommit}',`
      );
    }
  }
  
  fs.writeFileSync(VERSION_FILE, updatedContent);
}

async function updatePackageJson(newVersion) {
  const packageContent = fs.readFileSync(PACKAGE_FILE, 'utf8');
  const packageData = JSON.parse(packageContent);
  
  packageData.version = newVersion;
  
  fs.writeFileSync(PACKAGE_FILE, JSON.stringify(packageData, null, 2) + '\n');
}

function getCurrentVersion() {
  const versionContent = fs.readFileSync(VERSION_FILE, 'utf8');
  const match = versionContent.match(/version: '([^']*)'/);
  
  if (!match) {
    throw new Error('Could not find version in version.ts file');
  }
  
  return match[1];
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Version Update Script

Usage: node scripts/update-version.js [increment|version]

Arguments:
  major     Increment major version (1.2.3 -> 2.0.0)
  minor     Increment minor version (1.2.3 -> 1.3.0)  
  patch     Increment patch version (1.2.3 -> 1.2.4)
  X.Y.Z     Set specific version number

Examples:
  node scripts/update-version.js patch
  node scripts/update-version.js minor
  node scripts/update-version.js major
  node scripts/update-version.js 2.1.0
    `);
    process.exit(0);
  }
  
  try {
    const increment = args[0];
    const currentVersion = getCurrentVersion();
    const newVersion = incrementVersion(currentVersion, increment);
    const gitCommit = await getGitCommit();
    
    console.log(`Updating version from ${currentVersion} to ${newVersion}`);
    
    // Update files
    await updateVersionFile(newVersion, gitCommit);
    await updatePackageJson(newVersion);
    
    console.log('✅ Version updated successfully!');
    console.log(`📦 Package.json: ${newVersion}`);
    console.log(`⚙️  Version config: ${newVersion}`);
    if (gitCommit) {
      console.log(`🔗 Git commit: ${gitCommit.slice(0, 8)}`);
    }
    console.log(`📅 Build date: ${new Date().toISOString().split('T')[0]}`);
    
  } catch (error) {
    console.error('❌ Error updating version:', error.message);
    process.exit(1);
  }
}

main();
