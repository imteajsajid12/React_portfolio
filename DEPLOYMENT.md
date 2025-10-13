# 🚀 Deployment Guide for React Portfolio

## 📋 Prerequisites

1. **Appwrite Account**: Ensure you have an Appwrite account and project set up
2. **Node.js**: Version 16 or higher
3. **Appwrite CLI**: Install globally with `npm install -g appwrite-cli`

## 🔧 Environment Setup

### 1. Verify Environment Variables

Ensure your `.env` file contains:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=673dca020027a68a026f
VITE_APPWRITE_DATABASE_ID=68b167ac00260b8be1b2
VITE_APPWRITE_STORAGE_BUCKET=674958ca00169e907ea0
```

### 2. Test Local Build

```bash
# Clean previous builds
npm run clean

# Test production build locally
npm run test:build
```

## 🌐 Deployment Methods

### Method 1: Appwrite Functions (Recommended)

1. **Initialize Appwrite CLI**:

```bash
c
```

2. **Deploy to Appwrite**:

```bash
npm run appwrite:init
```

### Method 2: Manual Upload

1. **Build for production**:

```bash
npm run build:prod
```

2. **Upload dist folder** to your hosting service

### Method 3: Static Hosting Services

#### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

#### Vercel

1. Import project from GitHub
2. Set build command: `npm run build:prod`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

## 🔍 Troubleshooting

### White Page Issues

1. **Check Console Errors**:

   - Open browser DevTools
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Environment Variables**:

   - Ensure all VITE\_ prefixed variables are set
   - Check Appwrite project ID and endpoint

3. **Check Routing**:

   - Ensure `_redirects` file is in public folder
   - Verify base path configuration

4. **Test API Connections**:
   - Visit `/test` route to check Appwrite connectivity
   - Verify database and storage permissions

### Common Fixes

1. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
2. **Check Network**: Ensure Appwrite endpoint is accessible
3. **Verify Permissions**: Check Appwrite database/storage permissions
4. **Review Logs**: Check browser console and network requests

## 📊 Performance Optimization

1. **Bundle Analysis**:

```bash
npm run build:prod -- --analyze
```

2. **Lighthouse Audit**: Run in Chrome DevTools

3. **Image Optimization**: Ensure images are properly compressed

## 🔒 Security Checklist

- [ ] Environment variables are properly set
- [ ] Appwrite permissions are configured correctly
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enabled
- [ ] CORS is properly configured

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review browser console errors
3. Verify Appwrite configuration
4. Test with a fresh build
