# VIKSORASPORTS Environment Setup Guide

## Required Environment Variables

To run this project properly, you need to set up environment variables. Follow these steps:

### 1. Server Environment Setup

1. Navigate to the `server` folder
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the required values in the `.env` file:

#### Database Configuration
- **MONGO_URI**: Your MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/viksorasports`
  - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/viksorasports`

#### Authentication & Security
- **JWT_SECRET**: A strong random string for JWT token signing
- **GOOGLE_CLIENT_ID**: Google OAuth client ID (from Google Console)
- **GOOGLE_CLIENT_SECRET**: Google OAuth client secret

#### Payment Integration
- **RAZORPAY_KEY_ID**: Your Razorpay key ID
- **RAZORPAY_KEY_SECRET**: Your Razorpay key secret

#### Email Configuration (Optional)
- **EMAIL_HOST**: SMTP server (e.g., smtp.gmail.com)
- **EMAIL_PORT**: SMTP port (e.g., 587)
- **EMAIL_USER**: Your email address
- **EMAIL_PASS**: App password for email

### 2. Installation & Setup

#### Backend Setup:
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup:
```bash
cd client
npm install
npm run dev
```

### 3. Database Setup

1. Seed the database with sample games:
   ```bash
   cd server
   node seedGames.js
   ```

2. Create an admin user (optional):
   ```bash
   node createAdmin.js
   ```

### 4. Common Issues & Solutions

#### Issue: Database Connection Failed
- **Solution**: Check your MONGO_URI in the .env file
- **Solution**: Ensure MongoDB is running (for local setup)
- **Solution**: Check network access in MongoDB Atlas

#### Issue: CORS Errors
- **Solution**: The allowed origins are configured in server.js
- **Solution**: Add your domain to the allowedOrigins array if needed

#### Issue: Authentication Issues
- **Solution**: Check JWT_SECRET is set
- **Solution**: Verify Google OAuth credentials

#### Issue: Payment Integration Errors
- **Solution**: Verify Razorpay credentials
- **Solution**: Ensure you're using the correct environment (test/live)

### 5. Security Notes

⚠️ **IMPORTANT**: Never commit the `.env` file to version control!

- The `.env` file contains sensitive information
- Use environment-specific values for different deployments
- Rotate secrets regularly in production

### 6. Deployment

For production deployment:
1. Set environment variables in your hosting platform
2. Use production URLs for database and OAuth
3. Enable HTTPS for security
4. Use production Razorpay keys