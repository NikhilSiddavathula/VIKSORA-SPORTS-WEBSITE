# VIKSORASPORTS Vercel Deployment Guide

## 🚀 Quick Redeploy Commands

### Option 1: Deploy Everything (Recommended)
```bash
# From the root directory
npm run deploy
```

### Option 2: Deploy Frontend and Backend Separately
```bash
# Deploy frontend (www.viksorasports.com)
npm run deploy-client

# Deploy backend (api.viksorasports.com)
npm run deploy-server
```

### Option 3: Manual Deployment
```bash
# Frontend deployment
cd client
vercel --prod

# Backend deployment  
cd server
vercel --prod
```

## 🌐 Domain Configuration

Your current domain setup:
- **Frontend**: www.viksorasports.com
- **Backend API**: api.viksorasports.com (recommended)

### Setting Up Custom Domains in Vercel:

1. **Frontend Domain Setup:**
   ```bash
   cd client
   vercel domains add www.viksorasports.com
   vercel domains add viksorasports.com # Optional: redirect to www
   ```

2. **Backend Domain Setup:**
   ```bash
   cd server
   vercel domains add api.viksorasports.com
   ```

## ⚙️ Environment Variables Setup

### Required Environment Variables for Production:

#### Backend (Server) Environment Variables:
```bash
# Database
MONGO_URI=mongodb+srv://your-atlas-connection-string

# JWT
JWT_SECRET=your-super-secure-jwt-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_NAME=VIKSORASPORTS

# Production Settings
NODE_ENV=production
VERCEL_ENV=production
```

#### Frontend (Client) Environment Variables:
```bash
# API Base URL
VITE_API_BASE_URL=https://api.viksorasports.com/api

# Google OAuth (for frontend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Razorpay (for frontend payments)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### Setting Environment Variables in Vercel:

1. **Via Vercel Dashboard:**
   - Go to your project dashboard
   - Navigate to Settings → Environment Variables
   - Add each variable for Production environment

2. **Via Vercel CLI:**
   ```bash
   # For backend
   cd server
   vercel env add MONGO_URI production
   vercel env add JWT_SECRET production
   # ... add all other variables

   # For frontend
   cd client
   vercel env add VITE_API_BASE_URL production
   vercel env add VITE_GOOGLE_CLIENT_ID production
   ```

## 🔧 Pre-deployment Checklist

Before redeploying, ensure:

- [ ] Environment variables are set in Vercel dashboard
- [ ] MongoDB Atlas is accessible and connection string is correct
- [ ] Google OAuth credentials are configured for production domains
- [ ] Razorpay is configured for production
- [ ] Domain DNS settings point to Vercel

## 🚦 Deployment Steps

### Step 1: Update Environment Variables
```bash
# Login to Vercel
vercel login

# Link your projects (if not already linked)
cd client && vercel link
cd ../server && vercel link
```

### Step 2: Deploy Backend First
```bash
cd server
vercel --prod
```

### Step 3: Deploy Frontend
```bash
cd client
vercel --prod
```

### Step 4: Verify Deployment
- Check https://www.viksorasports.com (frontend)
- Check https://api.viksorasports.com/api/health (backend health)

## 🛠️ Troubleshooting Common Issues

### Issue: CORS Errors
**Solution:** Ensure your domain is in the allowed origins list (already updated in server.js)

### Issue: API Not Found
**Solution:** Check that VITE_API_BASE_URL points to your backend domain

### Issue: Database Connection Failed
**Solution:** Verify MONGO_URI environment variable in Vercel dashboard

### Issue: Authentication Issues
**Solution:** 
- Check Google OAuth redirect URIs include your production domain
- Verify JWT_SECRET is set

### Issue: Payment Integration
**Solution:**
- Use production Razorpay keys for live payments
- Test with Razorpay test keys first

## 📱 Post-Deployment Verification

1. **Frontend Checks:**
   - [ ] Website loads at www.viksorasports.com
   - [ ] All pages are accessible
   - [ ] Authentication works
   - [ ] API calls succeed

2. **Backend Checks:**
   - [ ] Health endpoint responds: `/api/health`
   - [ ] Authentication endpoints work: `/api/auth/*`
   - [ ] Database operations succeed
   - [ ] CORS is properly configured

3. **Integration Checks:**
   - [ ] Login/Signup flow works end-to-end
   - [ ] Payment integration functions
   - [ ] Contact forms submit successfully
   - [ ] Admin dashboard accessible

## 📞 Support Commands

```bash
# Check deployment status
vercel list

# View deployment logs
vercel logs

# Remove a deployment
vercel remove

# Check domain status
vercel domains ls
```

## 🎯 Quick Redeploy (Your Case)

Since you already have the setup, just run:

```bash
# From root directory
npm run deploy
```

Or deploy each separately:
```bash
npm run deploy-server  # Backend
npm run deploy-client  # Frontend
```

Your updated CORS configuration now properly includes www.viksorasports.com as the primary domain!