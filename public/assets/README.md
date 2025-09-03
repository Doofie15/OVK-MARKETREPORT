# OVK Brand Assets

## Logo Files
Place your OVK logo files in the following locations:

### `/public/assets/logos/`
- `ovk-logo.svg` - Main logo (vector format, preferred)
- `ovk-logo.png` - High-resolution PNG (fallback)
- `ovk-logo-white.svg` - White version for dark backgrounds
- `ovk-favicon.ico` - Favicon for browser tab

### Usage in Components
To use your logo files instead of the generated SVG:

```tsx
// In components/Header.tsx, replace OVKLogo with:
<img 
  src="/assets/logos/ovk-logo.svg" 
  alt="OVK Logo" 
  className="w-16 h-16 drop-shadow-lg"
/>
```

### File Specifications
- **SVG files**: Recommended for scalability
- **PNG files**: Min 300x300px for crisp display
- **File sizes**: Keep under 100KB for fast loading
- **Colors**: Should work well with light backgrounds

## Brand Colors (Currently Implemented)
- Primary Blue: `#1e40af`
- Secondary Blue: `#3b82f6` 
- Accent Blue: `#60a5fa`
- Brand Green: `#10b981`

## Need Help?
The current SVG logo can be customized by editing `components/OVKLogo.tsx`
