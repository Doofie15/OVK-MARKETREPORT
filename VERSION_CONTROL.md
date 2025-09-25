# Version Control System

This application includes a comprehensive version control system that displays version information on all pages and provides easy version management tools.

## Features

### 🏷️ Version Display
- **Visible on all pages**: Small version badge appears in the bottom corner
- **Environment indicators**: Different colors for development, staging, and production
- **Detailed information**: Click the version badge to see build details, features, and git commit
- **Smart positioning**: Public pages show version on bottom-left, admin pages on bottom-right

### 📦 Version Management
- **Semantic versioning**: Follows major.minor.patch format (e.g., 1.2.3)
- **Automatic build numbers**: Generated from timestamp (YYMMDD.HHMM)
- **Git integration**: Includes git commit hash when available
- **Feature tracking**: Lists recent features in the version details

## Usage

### Viewing Version Information
- Look for the small version badge in the bottom corner of any page
- Click the badge to see detailed version information
- The badge color indicates the environment:
  - 🟡 **Yellow**: Development
  - 🔵 **Blue**: Staging  
  - 🟢 **Green**: Production

### Updating Versions

#### Using NPM Scripts (Recommended)
```bash
# Increment patch version (1.2.0 -> 1.2.1)
npm run version:patch

# Increment minor version (1.2.0 -> 1.3.0)
npm run version:minor

# Increment major version (1.2.0 -> 2.0.0)
npm run version:major

# Set specific version
npm run version:set 2.1.0
```

#### Using the Script Directly
```bash
# Increment versions
node scripts/update-version.js patch
node scripts/update-version.js minor
node scripts/update-version.js major

# Set specific version
node scripts/update-version.js 1.5.0

# Get help
node scripts/update-version.js --help
```

## What Gets Updated

When you update the version, the script automatically:

1. **Updates version.ts**: Sets new version, build date, and git commit
2. **Updates package.json**: Syncs the package version
3. **Generates build number**: Creates timestamp-based build identifier
4. **Captures git commit**: Includes current commit hash (if available)

## File Structure

```
config/
└── version.ts              # Main version configuration
components/
└── VersionDisplay.tsx      # Version display component  
scripts/
└── update-version.js       # Version update script
```

## Version Configuration

Edit `config/version.ts` to:
- Update the features list
- Modify version display logic
- Change environment detection
- Customize build number format

## Integration

The version system is integrated into:
- **PublicLayout.tsx**: Shows version on public pages (bottom-left)
- **AdminLayoutSupabase.tsx**: Shows version on admin pages (bottom-right)
- **VersionDisplay.tsx**: Reusable component for any page

## Best Practices

1. **Use semantic versioning**:
   - **Major**: Breaking changes or major new features
   - **Minor**: New features, backward compatible
   - **Patch**: Bug fixes and small improvements

2. **Update features list**: Keep the features array current with recent additions

3. **Test before release**: Verify version displays correctly after updates

4. **Document changes**: Consider keeping a CHANGELOG.md for detailed release notes

## Environment Variables

Optional environment variables for enhanced functionality:
- `VITE_GIT_COMMIT`: Override git commit hash detection
- `NODE_ENV`: Automatically detected for environment setting

## Troubleshooting

### Version not updating?
- Check that `config/version.ts` exists and is writable
- Ensure you have proper permissions to modify files
- Verify the script runs without errors

### Git commit not showing?
- Ensure you're in a git repository
- Check that git is installed and available in PATH
- The system gracefully handles missing git information

### Import errors?
- Make sure `config/version.ts` exists in the project root
- Check that `components/VersionDisplay.tsx` exists
- Verify import paths are correct relative to the file structure
