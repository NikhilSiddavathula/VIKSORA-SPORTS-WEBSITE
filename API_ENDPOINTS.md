# VIKSORASPORTS API Endpoints

## Authentication Endpoints

All authentication endpoints are prefixed with `/api/auth`.

### POST /api/auth/login
- **Description**: Login with email and password
- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

### GET /api/auth/login
- **Description**: Information about the login endpoint (for debugging)
- **Method**: GET
- **URL**: `/api/auth/login`
- **Response**:
  ```json
  {
    "message": "Login endpoint information",
    "method": "POST",
    "endpoint": "/api/auth/login",
    "description": "Use POST method to login with email and password",
    "example": {
      "email": "user@example.com",
      "password": "your_password"
    }
  }
  ```

### POST /api/auth/signup
- **Description**: Register a new user
- **Method**: POST
- **URL**: `/api/auth/signup`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "your_password",
    "phone": "1234567890",
    "country": "India",
    "state": "State Name"
  }
  ```

### POST /api/auth/admin-login
- **Description**: Login for admin users
- **Method**: POST
- **URL**: `/api/auth/admin-login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "admin_password"
  }
  ```

### GET /api/auth/google
- **Description**: Initiate Google OAuth authentication
- **Method**: GET
- **URL**: `/api/auth/google`

### GET /api/auth/google/callback
- **Description**: Google OAuth callback endpoint
- **Method**: GET
- **URL**: `/api/auth/google/callback`

### GET /api/auth/me
- **Description**: Get current logged in user information
- **Method**: GET
- **URL**: `/api/auth/me`
- **Headers**: Authorization: Bearer [jwt_token]