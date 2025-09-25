# Automatic Versioning Guide

This repository uses automatic versioning based on commit messages. When you push to the main branch, GitHub Actions will automatically detect the type of changes and bump the version accordingly.

## Commit Message Conventions

Use these prefixes in your commit messages to control version bumping:

### 🔴 MAJOR Version (Breaking Changes)
**Format:** `major:`, `breaking:`, `BREAKING CHANGE:`, or `!:`

**Examples:**
```bash
git commit -m "major: complete API restructure"
git commit -m "breaking: remove deprecated endpoints"
git commit -m "BREAKING CHANGE: change database schema"
git commit -m "!: rewrite authentication system"
```

**When to use:**
- API breaking changes
- Database schema changes that require migration
- Removal of features or endpoints
- Major architectural changes
- Any change that breaks backward compatibility

### 🟡 MINOR Version (New Features)
**Format:** `feat:`, `feature:`, `minor:`, `add:`, or `new:`

**Examples:**
```bash
git commit -m "feat: add season filtering to auctions table"
git commit -m "feature: implement user profile management"
git commit -m "minor: add export functionality"
git commit -m "add: new dashboard widgets"
git commit -m "new: mobile responsive design"
```

**When to use:**
- New features
- New API endpoints
- Significant enhancements
- New components or pages
- Backward-compatible functionality additions

### 🟢 PATCH Version (Bug Fixes & Small Changes)
**Format:** `fix:`, `patch:`, `bug:`, `hotfix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, or `chore:`

**Examples:**
```bash
git commit -m "fix: resolve login form validation issue"
git commit -m "patch: update table row spacing"
git commit -m "bug: fix mobile layout overflow"
git commit -m "docs: update API documentation"
git commit -m "style: improve button hover effects"
git commit -m "refactor: clean up component structure"
git commit -m "perf: optimize database queries"
git commit -m "test: add unit tests for auth service"
git commit -m "chore: update dependencies"
```

**When to use:**
- Bug fixes
- Small UI improvements
- Documentation updates
- Code refactoring
- Performance improvements
- Testing updates
- Dependency updates
- Configuration changes

## Keyword-Based Detection

If you don't use conventional commit prefixes, the system will also look for keywords:

### MAJOR Keywords
- `break`, `breaking`, `major`, `incompatible`

### MINOR Keywords  
- `feature`, `feat`, `add`, `new`, `minor`

### PATCH Keywords (Default)
- `fix`, `bug`, `patch`, `update`, `improve`

## How It Works

1. **Push to main branch** - Triggers the auto-versioning workflow
2. **Commit analysis** - Scans commit messages since last release
3. **Version detection** - Determines version bump type based on patterns
4. **Version update** - Runs `node scripts/update-version.js [type]`
5. **Git operations** - Commits version changes, creates tag
6. **Release creation** - Creates GitHub release with changelog
7. **Build process** - Builds the application

## Manual Versioning

You can also trigger versioning manually:

### Via GitHub Actions
1. Go to **Actions** tab in GitHub
2. Select **Auto Version & Release** workflow
3. Click **Run workflow**
4. Choose version type: `patch`, `minor`, or `major`

### Via Command Line
```bash
# For development
npm run version:patch   # 1.2.1 -> 1.2.2
npm run version:minor   # 1.2.1 -> 1.3.0
npm run version:major   # 1.2.1 -> 2.0.0

# For specific version
npm run version:set 2.5.0
```

## Examples in Practice

### Scenario 1: Bug Fix
```bash
git add .
git commit -m "fix: resolve auction table loading issue"
git push origin main
# Result: 1.2.1 -> 1.2.2 (PATCH)
```

### Scenario 2: New Feature
```bash
git add .
git commit -m "feat: add season filter dropdown to auctions"
git push origin main
# Result: 1.2.1 -> 1.3.0 (MINOR)
```

### Scenario 3: Breaking Change
```bash
git add .
git commit -m "breaking: change API response format"
git push origin main
# Result: 1.2.1 -> 2.0.0 (MAJOR)
```

### Scenario 4: Multiple Commits
```bash
git commit -m "fix: minor CSS adjustments"
git commit -m "feat: add new dashboard widget"
git commit -m "docs: update README"
git push origin main
# Result: Takes highest priority (feat: = MINOR)
# 1.2.1 -> 1.3.0
```

## Priority Order

When multiple commit types are detected, the system uses this priority:

1. **MAJOR** (highest priority)
2. **MINOR** 
3. **PATCH** (lowest priority)

## Release Notes

Each release automatically includes:
- **Version type** (MAJOR/MINOR/PATCH)
- **Commit list** with short hashes
- **Build information** (date, environment, git commit)
- **Direct link** to the GitHub release

## Best Practices

1. **Be descriptive** - Clear commit messages help with automatic changelog generation
2. **One change per commit** - Makes version detection more accurate
3. **Use conventional formats** - More reliable than keyword detection
4. **Test locally first** - Use `npm run version:patch` to test version updates
5. **Check releases** - Verify the auto-generated release notes make sense

## Troubleshooting

### Version not bumping?
- Check commit message format
- Ensure you're pushing to `main` or `master` branch
- Verify GitHub Actions are enabled in repository settings

### Wrong version type detected?
- Use conventional commit prefixes for more reliable detection
- Check the workflow run logs in GitHub Actions
- Manually trigger with correct version type if needed

### Missing permissions?
- Ensure GitHub Actions has write permissions to repository
- Check that `GITHUB_TOKEN` has proper scopes
