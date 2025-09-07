# Custom Domain Deployment Guide - www.viksorasports.com

This guide will help you deploy your VIKSORASPORTS application to your custom domain `www.viksorasports.com`.

## Architecture Overview

Your application will be deployed with this structure:
- **Frontend**: `www.viksorasports.com` (main website)
- **Backend API**: `api.viksorasports.com` (API endpoints)
- **Alternative**: Both can be served from the same domain with proper routing

## Prerequisites

1. Domain ownership: `viksorasports.com` 
2. Vercel account (recommended for deployment)
3. MongoDB Atlas account (for database)
4. Google Cloud Console project (for OAuth)

## Option 1: Separate Subdomains (Recommended)

### Step 1: Deploy Backend API to api.viksorasports.com

1. **Create New Vercel Project for Backend**
   ```bash
   # In your project root
   cd server
   vercel
   ```

2. **Configure Backend Domain**
   - In Vercel dashboard, go to your backend project
   - Settings → Domains
   - Add domain: `api.viksorasports.com`

3. **Set Backend Environment Variables**
   ```bash
   # Required environment variables for backend
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://www.viksorasports.com
   
   # Optional (for Razorpay payments)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Optional (for email notifications)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

### Step 2: Deploy Frontend to www.viksorasports.com

1. **Create New Vercel Project for Frontend**
   ```bash
   # In your project root
   cd client
   vercel
   ```

2. **Configure Frontend Domain**
   - In Vercel dashboard, go to your frontend project
   - Settings → Domains
   - Add domain: `www.viksorasports.com`
   - Add domain: `viksorasports.com` (redirect to www)

3. **Set Frontend Environment Variables**
   ```bash
   # Required environment variables for frontend
   VITE_API_BASE_URL=https://api.viksorasports.com
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

### Step 3: Configure DNS Records

Add these DNS records at your domain registrar:

```
Type    Name    Value                           TTL
CNAME   www     cname.vercel-dns.com           300
CNAME   api     cname.vercel-dns.com           300
A       @       76.76.19.61                    300
AAAA    @       2606:4700:4700::1111           300
```

## Option 2: Single Domain with API Routes

If you prefer to serve everything from `www.viksorasports.com`:

### Step 1: Deploy Combined Application

1. **Create Single Vercel Project**
   - Deploy frontend to `www.viksorasports.com`
   - Configure API routes to `/api/*`

2. **Update Frontend Configuration**
   ```bash
   # Frontend environment variables
   VITE_API_BASE_URL=https://www.viksorasports.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

3. **Configure Vercel Rewrites**
   
   Update `client/vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-project.vercel.app/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

## Step 4: Configure Google OAuth

1. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Configure Authorized Origins**
   ```
   https://www.viksorasports.com
   https://viksorasports.com
   http://localhost:5173 (for development)
   ```

3. **Configure Redirect URIs**
   ```
   https://api.viksorasports.com/api/auth/google/callback
   https://www.viksorasports.com/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback (for development)
   ```

## Step 5: Test Deployment

1. **Test Frontend**
   ```bash
   curl -I https://www.viksorasports.com
   # Should return 200 OK
   ```

2. **Test Backend API**
   ```bash
   curl https://api.viksorasports.com/api/health
   # Should return JSON with status
   ```

3. **Test CORS**
   ```bash
   curl -H "Origin: https://www.viksorasports.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS https://api.viksorasports.com/api/auth/login
   ```

## Step 6: SSL Certificates

Vercel automatically provides SSL certificates for custom domains. Verification may take 5-10 minutes.

## Environment Variables Checklist

### Frontend (www.viksorasports.com)
- [ ] `VITE_API_BASE_URL=https://api.viksorasports.com`
- [ ] `VITE_GOOGLE_CLIENT_ID=your_client_id`

### Backend (api.viksorasports.com)
- [ ] `MONGO_URI=mongodb+srv://...`
- [ ] `JWT_SECRET=your_secret_key`
- [ ] `GOOGLE_CLIENT_ID=your_client_id`
- [ ] `GOOGLE_CLIENT_SECRET=your_client_secret`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://www.viksorasports.com`

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify frontend URL is in backend CORS allowedOrigins
   - Check environment variables are set correctly

2. **Google OAuth Errors**
   - Verify redirect URIs in Google Cloud Console
   - Check client ID in both frontend and backend

3. **API Not Found (404)**
   - Verify API base URL in frontend environment
   - Check backend deployment status

4. **SSL Certificate Issues**
   - Wait 5-10 minutes for Vercel to provision certificates
   - Check DNS propagation with `dig www.viksorasports.com`

### Testing Commands

```bash
# Test DNS propagation
dig www.viksorasports.com
dig api.viksorasports.com

# Test SSL
openssl s_client -connect www.viksorasports.com:443

# Test API connectivity
curl -v https://api.viksorasports.com/api/health
```

## Monitoring & Analytics

Consider adding:
- Vercel Analytics for performance monitoring
- Google Analytics for user tracking
- Sentry for error monitoring

## Next Steps

1. Set up monitoring and analytics
2. Configure CI/CD for automatic deployments
3. Set up staging environment (e.g., `staging.viksorasports.com`)
4. Configure database backups
5. Set up email notifications

---

Need help? Check the troubleshooting section or refer to:
- [Vercel Custom Domains Documentation](https://vercel.com/docs/custom-domains)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)