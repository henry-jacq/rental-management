# User Data Middleware Setup

## Overview
This setup implements a middleware system that automatically fetches complete user data from the database and makes it available across all authenticated routes, replacing the previous dummy data approach.

## Changes Made

### Backend Changes

#### 1. New User Data Middleware (`backend/middleware/userMiddleware.js`)
- **Purpose**: Fetches complete user data from database after authentication
- **Functionality**: 
  - Retrieves user data using `req.user.id` from JWT token
  - Populates related fields (properties, lease info)
  - Excludes sensitive data (password)
  - Adds computed fields (initials)
  - Attaches data to `req.userData`

#### 2. Updated Server Configuration (`backend/server.js`)
- Applied user data middleware to all protected routes
- Routes now use both `verifyToken()` and `attachUserData` middleware
- Ensures user data is available before route handlers execute

#### 3. Updated Authentication Middleware (`backend/middleware/auth.js`)
- Added `requireRole()` function for role-based access control
- Separates authentication from authorization logic
- Uses `req.userData` instead of `req.user` for role checking

#### 4. Updated Route Handlers
All route files updated to use real user data:
- **Dashboard routes**: Use `req.userData` for personalized responses
- **Payment routes**: Generate user-specific payment data
- **Tenant routes**: Filter data by landlord ID
- **Maintenance routes**: Show requests based on user role and ID
- **Reports routes**: Generate landlord-specific reports

#### 5. Enhanced User Model (`backend/models/User.js`)
- Added `company` field for landlord users
- Supports role-specific data storage

#### 6. New Profile Update Endpoint
- `PUT /api/dashboard/profile`: Updates user profile information
- Handles role-specific fields (company for landlords)
- Returns updated user data

### Frontend Changes

#### 1. Enhanced User Context (`frontend/src/contexts/UserContext.jsx`)
- Fetches complete user profile on app load
- Falls back to JWT token data if API fails
- Provides real user data throughout the application

#### 2. Updated Dashboard Pages
- **Tenant Dashboard**: Uses real user data from context and API
- **Landlord Dashboard**: Displays actual user information
- Removed hardcoded dummy data fallbacks

#### 3. Updated Profile Pages
- **Tenant Profile**: Fetches and updates real user data
- **Landlord Profile**: Handles company information
- Implements profile update functionality

## Key Benefits

1. **Real Data**: All UI components now display actual user information from the database
2. **Consistency**: User data is consistent across all routes and components
3. **Performance**: User data is fetched once per request and cached
4. **Security**: Proper role-based access control with database validation
5. **Maintainability**: Centralized user data fetching logic

## API Endpoints

### New/Updated Endpoints
- `GET /api/dashboard/profile` - Get complete user profile
- `PUT /api/dashboard/profile` - Update user profile
- All existing endpoints now return user-specific data

### Authentication Flow
1. User logs in → receives JWT token
2. Frontend stores token and fetches user profile
3. All API requests include token in Authorization header
4. Backend verifies token → fetches user data → processes request
5. Response includes personalized data based on user role and permissions

## Usage Examples

### Backend Route Handler
```javascript
router.get("/example", (req, res) => {
  // req.userData contains complete user information
  const response = {
    message: `Welcome ${req.userData.name}`,
    userSpecificData: generateDataForUser(req.userData._id),
    role: req.userData.role
  };
  res.json(response);
});
```

### Frontend Component
```javascript
const { user } = useUser(); // Gets real user data from context
return (
  <div>
    <h1>Welcome, {user?.name}</h1>
    <p>Email: {user?.email}</p>
    <p>Role: {user?.role}</p>
  </div>
);
```

## Testing
- All routes now require valid authentication
- User data is fetched from database on each request
- Profile updates are persisted to database
- Role-based access control is enforced

The system now provides a complete user data management solution with real database integration and proper security controls.