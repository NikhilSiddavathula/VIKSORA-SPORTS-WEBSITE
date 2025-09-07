# VIKSORASPORTS - Complete Sports & Fitness Platform

A comprehensive sports and fitness platform built with React.js frontend and Node.js backend, featuring user authentication, trainer management, payment integration, and admin functionality.

## 🚀 Features

### Frontend Features
- **User Authentication**: Signup/Login with Google OAuth integration
- **Responsive Design**: Mobile-first approach with Material-UI
- **Sports Management**: Browse games, book sessions, view equipment
- **Trainer Platform**: Find trainers or apply to become one
- **Fitness & Nutrition**: Comprehensive wellness programs
- **Sponsorship System**: Apply for sports sponsorships
- **Collaboration Portal**: Partner with organizations
- **Contact System**: Multi-category support system
- **Payment Integration**: Razorpay payment gateway
- **Admin Dashboard**: Complete management interface

### Backend Features
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT tokens with Google OAuth
- **Role-based Access**: User and Admin roles
- **Payment Processing**: Razorpay integration
- **Email Services**: Automated notifications
- **File Upload**: Admin content management
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI v5** - Component library
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Country State City** - Location data
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport.js** - OAuth strategies
- **Razorpay** - Payment processing
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd VIKSORASPORTS
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the server directory:
```env
# Database
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/VIKSORASPORTS?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Seed Database
```bash
# Seed games data
node seedGames.js

# Seed trainer applications (optional - requires existing users)
node seedTrainerApplications.js
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Environment Configuration
Create a `.env` file in the client directory:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Razorpay (Frontend)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

#### Start Frontend Server
```bash
npm run dev
```

## 🌐 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup          - User registration
POST /api/auth/login           - User login
GET  /api/auth/me              - Get current user
GET  /api/auth/google          - Google OAuth login
GET  /api/auth/google/callback - Google OAuth callback
```

### Games Endpoints
```
GET    /api/games              - Get all games
GET    /api/games/:id          - Get game by ID
GET    /api/games/name/:name   - Get game by name
POST   /api/games/:id/session  - Book training session
POST   /api/games              - Create game (Admin)
PUT    /api/games/:id          - Update game (Admin)
DELETE /api/games/:id          - Delete game (Admin)
```

### Contact Endpoints
```
POST   /api/contact            - Submit contact form
GET    /api/contact            - Get all contacts (Admin)
GET    /api/contact/:id        - Get contact by ID (Admin)
PUT    /api/contact/:id        - Update contact (Admin)
DELETE /api/contact/:id        - Delete contact (Admin)
```

### Collaboration Endpoints
```
POST   /api/collaborations     - Submit collaboration
GET    /api/collaborations     - Get all collaborations (Admin)
GET    /api/collaborations/:id - Get collaboration by ID (Admin)
PUT    /api/collaborations/:id - Update collaboration (Admin)
DELETE /api/collaborations/:id - Delete collaboration (Admin)
GET    /api/collaborations/stats - Get statistics (Admin)
```

### Sponsorship Endpoints
```
POST   /api/sponsorships       - Submit sponsorship application
GET    /api/sponsorships       - Get all sponsorships (Admin)
GET    /api/sponsorships/:id   - Get sponsorship by ID (Admin)
PUT    /api/sponsorships/:id   - Update sponsorship (Admin)
DELETE /api/sponsorships/:id   - Delete sponsorship (Admin)
```

### Payment Endpoints
```
POST   /api/payment/create-order - Create Razorpay order
POST   /api/payment/verify      - Verify payment
POST   /api/payment             - Create payment record
```

## 👤 User Roles & Permissions

### Regular User
- Browse games and trainers
- Book training sessions
- Apply for sponsorships
- Submit collaboration proposals
- Contact support
- Manage personal profile

### Admin User
- All user permissions
- Manage all games and content
- View and respond to contact forms
- Review collaboration proposals
- Manage sponsorship applications
- Access analytics and reports
- User management
- Content management

## 🔐 Creating Admin User

To create an admin user, you can either:

1. **Via Database**: Manually update a user's role to 'admin' in MongoDB
2. **Via API**: Use the admin routes (requires existing admin)
3. **Via Seeding**: Create an admin seeding script

Example MongoDB update:
```javascript
db.users.updateOne(
  { email: "admin@viksorasports.com" },
  { $set: { role: "admin" } }
)
```

## 🎨 Customization

### Styling
- Modify theme in `client/src/theme/theme.ts`
- Update Material-UI theme configuration
- Customize component styles

### Configuration
- Update API endpoints in `client/src/services/api.js`
- Modify authentication logic in `client/src/context/AuthContext.jsx`
- Adjust backend middleware in `server/middlewares/`

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist folder
```

### Backend Deployment (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to your platform
```

### Environment Variables for Production
Update all URLs and secrets for production environment.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URLs

2. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration settings

3. **Database Connection**
   - Verify MongoDB URI
   - Check network access in MongoDB Atlas

4. **Payment Integration**
   - Verify Razorpay credentials
   - Check webhook configurations

## 📞 Support

For support and questions:
- Email: support@viksorasports.com
- Documentation: Check API endpoints above
- Issues: Create GitHub issues

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**VIKSORASPORTS** - Empowering Athletes, Building Champions 🏆