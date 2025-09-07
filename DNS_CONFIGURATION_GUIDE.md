# DNS Configuration Guide for VIKSORASPORTS

## 🌐 Domain Configuration Status

Your domain `viksorasports.com` is successfully connected to Vercel and both frontend/backend are working correctly!

### ✅ Current Working URLs:
- **Frontend**: https://www.viksorasports.com ✅ WORKING
- **Backend API**: https://api.viksorasports.com ✅ WORKING
- **Fallback Frontend**: https://viksora-frontend-oxvz3k1e4-viksorasports.vercel.app
- **Fallback Backend**: https://viksora-backend-a7oq6lc7t-viksorasports.vercel.app

## 🔧 Required DNS Records

If you need to configure DNS records manually with your domain provider, here are the required records:

### Primary DNS Records:
```
Type    Name              Value                        TTL
CNAME   www               cname.vercel-dns.com         300
CNAME   api               cname.vercel-dns.com         300
A       @                 76.76.19.61                  300
```

### Additional Recommended Records:
```
Type    Name              Value                        TTL
CNAME   *.viksorasports   cname.vercel-dns.com         300
TXT     @                 "v=spf1 include:vercel.com ~all"
```

## 📋 Verification Steps

### 1. Test Frontend Connection:
```bash
curl -I https://www.viksorasports.com
# Should return: HTTP/2 200 
```

### 2. Test Backend API:
```bash
curl https://api.viksorasports.com
# Should return: {"status":"success","message":"Server is running successfully!"}
```

### 3. Test Admin Panel:
```bash
curl -I https://www.viksorasports.com/admin/login
# Should return: HTTP/2 200
```

## 🚀 Deployment Configuration

### Frontend Project:
- **Project**: viksora-frontend
- **Domain**: www.viksorasports.com
- **Latest Deployment**: ✅ Ready (5 minutes ago)

### Backend Project:
- **Project**: viksora-backend  
- **Domain**: api.viksorasports.com
- **Latest Deployment**: ✅ Ready (6 minutes ago)

## ⚙️ Environment Variables

### Frontend (.env.production):
```
VITE_API_URL=https://api.viksorasports.com
VITE_API_BASE_URL=https://api.viksorasports.com
VITE_GOOGLE_CLIENT_ID=888673755003-nv9ulsoaj4gt58d0hq4o6njgs6jgqfqn.apps.googleusercontent.com
VITE_RAZORPAY_KEY_ID=rzp_test_DpWSC3sy6B4Adz
```

### Backend (.env.production):
```
MONGO_URI=mongodb+srv://sportsuser:sports123@cluster0.cvev8vp.mongodb.net/...
JWT_SECRET=viksorasports_super_secret_jwt_key_2024_production_secure
NODE_ENV=production
FRONTEND_URL=https://www.viksorasports.com
RAZORPAY_KEY_ID=rzp_test_DpWSC3sy6B4Adz
```

## 🔍 Troubleshooting

### Common Issues:

1. **Domain not resolving**: 
   - Wait 24-48 hours for DNS propagation
   - Clear browser cache and DNS cache

2. **CORS errors**:
   - Verify FRONTEND_URL in backend environment
   - Check CORS configuration in server.js

3. **API connection failures**:
   - Verify VITE_API_URL in frontend environment
   - Test backend directly: https://api.viksorasports.com

### Manual DNS Configuration Commands:
```bash
# Add domains to Vercel projects
cd client && vercel domains add www.viksorasports.com
cd server && vercel domains add api.viksorasports.com

# Verify domain configuration
vercel domains ls
```

## ✅ Current Status: FULLY OPERATIONAL

Your VIKSORASPORTS platform is successfully deployed and accessible at:
- **Main Website**: https://www.viksorasports.com
- **API Endpoint**: https://api.viksorasports.com
- **Admin Dashboard**: https://www.viksorasports.com/admin/login

All frontend-backend connections are working correctly! 🎉