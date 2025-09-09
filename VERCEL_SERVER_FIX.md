# 🚨 Vercel Server Crash Fix

## Problem Identified
Your Vercel deployment at `https://api.viksorasports.com/` is crashing due to several critical issues:

### 1. **Wrong Package.json Configuration**
- The `server/package.json` was overwritten with RSS proxy configuration
- It had `"type": "module"` and `"main": "rssProxy.js"` instead of `"main": "server.js"`
- This caused Vercel to try running the wrong file with wrong module system

### 2. **Database Connection Issues**
- Environment variable naming inconsistency: `MONGO_URI` vs `MONGODB_URI`
- Database connection blocking server startup in serverless environment
- No proper error handling for Vercel cold starts

### 3. **Serverless Optimization Missing**
- No proper error handlers for uncaught exceptions in serverless
- Database connection happening synchronously during startup
- Missing Vercel-specific optimizations

## ✅ Fixes Applied

### 1. **Restored Correct Package.json**
```json
{
  "name": "viksorasports-backend",
  "version": "1.0.0", 
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^6.12.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0", 
    "passport-jwt": "^4.0.1",
    "razorpay": "^2.8.6",
    "nodemailer": "^6.9.4",
    "multer": "^1.4.5-lts.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0"
  }
}
```

### 2. **Enhanced Error Handling**
- Added global exception handlers for Vercel
- Environment variable normalization (MONGODB_URI → MONGO_URI)
- Non-blocking database connection for serverless

### 3. **Vercel Optimizations**  
- Database initialization on first request (prevents cold start timeout)
- Improved error handling for serverless functions
- Better logging for debugging

## 🚀 Deployment Steps

### Step 1: Verify Environment Variables in Vercel
Make sure these are set in your Vercel project settings:

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id  
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NODE_ENV=production
```

### Step 2: Redeploy to Vercel
```bash
cd server
git add .
git commit -m "Fix: Restore correct package.json and add Vercel optimizations"
git push origin main
```

Or if using Vercel CLI:
```bash
cd server  
vercel --prod
```

### Step 3: Test the Deployment
Once redeployed, test these endpoints:

1. **Root endpoint**: `https://api.viksorasports.com/`
2. **Health check**: `https://api.viksorasports.com/api/health`
3. **CORS test**: `https://api.viksorasports.com/api/cors-test`
4. **Debug**: `https://api.viksorasports.com/api/debug`

## 🔧 Environment Variables Checklist

Ensure these are configured in Vercel dashboard:

- ✅ `MONGODB_URI` - MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens  
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth client ID
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- ✅ `RAZORPAY_KEY_ID` - Razorpay payment key ID
- ✅ `RAZORPAY_KEY_SECRET` - Razorpay payment secret
- ✅ `NODE_ENV` - Set to "production"

## 📝 Post-Deployment Verification

After deployment, you should see:

1. **Root URL** (`https://api.viksorasports.com/`) returns:
```json
{
  "status": "success",
  "message": "Server is running successfully!",
  "timestamp": "2025-01-09T...",
  "environment": "production"
}
```

2. **No more 500 errors**
3. **Database connection working** (check `/api/health`)

## 🛠️ RSS Proxy (Optional)
The RSS proxy has been moved to `/rss-proxy/` directory as a separate service if needed later.

## ⚡ Quick Fix Commands

If still having issues, run these commands:

```bash
cd server
rm -rf node_modules package-lock.json
npm install
git add .  
git commit -m "Clean install dependencies"
git push origin main
```

The server should now deploy successfully on Vercel without the 500 FUNCTION_INVOCATION_FAILED error.