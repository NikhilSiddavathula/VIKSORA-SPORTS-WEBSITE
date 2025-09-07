# Deployment Guide for VIKSORASPORTS - Custom Domain

## Overview
This guide explains how to deploy the VIKSORASPORTS application to your custom domain `www.viksorasports.com`. The application consists of two parts:
1. Frontend (client) - React application → `www.viksorasports.com`
2. Backend (server) - Node.js/Express API → `api.viksorasports.com`

## Prerequisites
- Vercel account
- GitHub repository with the code
- Custom domain: `viksorasports.com`
- Environment variables configured

## Environment Variables

### Server Environment Variables
Set these in Vercel project settings:
```
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
MONGO_URI=your_mongodb_connection_string
NODE_ENV=production
PORT=5000
```

### Client Environment Variables
Set these in Vercel project settings for the frontend:
```
VITE_API_BASE_URL=https://api.viksorasports.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Deployment Steps

### 1. Deploy Backend (Server)
1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Set the root directory to `/server`
4. Add environment variables as listed above
5. Deploy

### 2. Deploy Frontend (Client)
1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Set the root directory to `/client`
4. Add environment variables as listed above
5. Set build command to `npm run build`
6. Set output directory to `dist`
7. Deploy

## CORS Configuration
The server is configured to allow requests from:
- `https://www.viksorasports.com` (production frontend)
- `https://viksorasports.com` (production frontend without www)
- `https://api.viksorasports.com` (production API)
- `http://localhost:5173` (local development)
- Vercel deployment URLs (for staging/preview)

If you're using different ports or domains, make sure to add them to the `allowedOrigins` array in `server/server.js`.

## Troubleshooting

### CORS Errors
If you encounter CORS errors:
1. Check that your frontend URL is in the `allowedOrigins` array in `server/server.js`
2. Verify that the `VITE_API_URL` in your client environment variables matches your backend URL
3. Ensure that the backend is sending the correct CORS headers

### Login Issues
If login is not working:
1. Check browser console for errors
2. Verify that the backend URL in environment variables is correct
3. Ensure MongoDB connection is working
4. Check that JWT_SECRET is properly configured

## Local Development
To run locally:
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Access the application at `http://localhost:5173` (or the port shown in terminal)

## Updating Deployments
To update your deployments:
1. Push changes to your GitHub repository
2. Vercel will automatically deploy the changes
3. Or manually trigger a deployment in the Vercel dashboard