# 🚀 FinFlow Deployment Guide

This guide covers multiple deployment options for the FinFlow financial management system.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository with GitHub Actions enabled
- Account on your chosen deployment platform

## 🌐 Deployment Options

### 1. GitHub Pages (Free)

**Setup:**
1. Go to your repository Settings → Pages
2. Select "GitHub Actions" as source
3. The workflow will automatically deploy on push to master/main

**Features:**
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ Custom domain support
- ✅ HTTPS enabled

**URL:** `https://yourusername.github.io/finflow/`

### 2. Netlify (Recommended)

**Setup:**
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Add these secrets to GitHub:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

**Features:**
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Form handling
- ✅ Edge functions
- ✅ Custom domain + SSL

### 3. Vercel (Fast & Modern)

**Setup:**
1. Create account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Add these secrets to GitHub:
   - `VERCEL_TOKEN`
   - `ORG_ID`
   - `PROJECT_ID`
   - `VERCEL_SCOPE`

**Features:**
- ✅ Free tier available
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Analytics included

## 🔧 Manual Deployment

### Build the Project
```bash
npm install
npm run build
```

### Deploy to Any Static Host
Upload the `dist/` folder contents to your hosting provider.

## 🧪 Testing Before Deployment

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run lint

# Build test
npm run build
npm run preview
```

## 🔐 Environment Variables

For production deployment, you may want to set:

```env
NODE_ENV=production
VITE_APP_TITLE=FinFlow
VITE_APP_DESCRIPTION=Professional Financial Management System
```

## 📊 Monitoring & Analytics

Consider adding:
- Google Analytics
- Sentry for error tracking
- Performance monitoring

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version (18+ required)
2. **Routing issues**: Ensure base path is correct in vite.config.ts
3. **Assets not loading**: Check public path configuration
4. **Tests failing**: Run `npm run test:run` to see detailed output

### GitHub Actions Issues:

1. **Permission denied**: Check repository secrets are set correctly
2. **Build timeout**: Increase timeout in workflow file
3. **Deploy fails**: Verify deployment platform credentials

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Test build locally first
4. Check deployment platform documentation

---

**Happy Deploying! 🎉**
