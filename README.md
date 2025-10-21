# Rental Management System

A comprehensive full-stack web application for managing rental properties, connecting landlords and tenants through an intuitive platform.

## 🏠 Overview

This rental management system provides a complete solution for property rental operations, featuring separate interfaces for landlords and tenants with role-based access control, property management, payment tracking, and maintenance request handling.

## ✨ Key Features

### For Landlords
- **Property Management**: Create, edit, and manage rental properties with detailed information
- **Image Upload**: Multiple image support for property listings with drag-and-drop interface
- **Tenant Management**: View and manage tenant information and lease agreements
- **Payment Tracking**: Monitor rent payments and generate financial reports
- **Maintenance Requests**: Handle property maintenance and repair requests
- **Dashboard Analytics**: Overview of properties, tenants, and financial metrics
- **Rental Type Options**: Specify properties as rental, lease, or both

### For Tenants
- **Property Search**: Browse available properties with advanced filtering options
- **Property Details**: View comprehensive property information with image galleries
- **Contact Landlords**: Express interest and communicate directly with property owners
- **Payment Management**: Track rent payments and payment history
- **Maintenance Requests**: Submit and track property maintenance requests
- **Profile Management**: Update personal information and preferences
- **Favorites System**: Save and manage favorite properties

### System Features
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access
- **Real-time Data**: Live updates and real-time synchronization
- **Responsive Design**: Mobile-friendly interface using Material-UI components
- **File Management**: Secure image upload and storage system
- **Search & Filtering**: Advanced property search with multiple filter criteria
- **Database Integration**: MongoDB with Mongoose ODM for data persistence

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks and context
- **Material-UI (MUI)** - Professional component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rental-management-system
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/rental-management
JWT_SECRET=your-secret-key
PORT=5000
```

4. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:5173`

## 📁 Project Structure

```
rental-management-system/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication and user data middleware
│   ├── models/          # MongoDB schemas (User, Property, etc.)
│   ├── routes/          # API route definitions
│   ├── uploads/         # File upload storage
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context providers
│   │   ├── pages/       # Application pages
│   │   └── App.jsx      # Main application component
│   └── index.html       # HTML entry point
└── README.md
```

## 🔐 Authentication & Roles

The system supports two user roles:

### Landlord
- Manage multiple properties
- View tenant information
- Handle maintenance requests
- Generate reports and analytics
- Upload property images

### Tenant
- Browse available properties
- Contact landlords
- Submit maintenance requests
- Track payment history
- Manage profile and preferences

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Properties
- `GET /api/properties/available` - List available properties
- `GET /api/properties/:id` - Get property details
- `POST /api/landlord-properties` - Create property (landlord)
- `PUT /api/landlord-properties/:id` - Update property (landlord)

### User Management
- `GET /api/dashboard/profile` - Get user profile
- `PUT /api/dashboard/profile` - Update user profile

### File Upload
- `POST /api/properties/upload-images` - Upload property images
- `DELETE /api/properties/images/:filename` - Delete property image

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with Material-UI components
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Consistent theming throughout the application
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Data Visualization**: Charts and graphs for analytics and reports
- **Image Management**: Drag-and-drop upload with preview functionality

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Setup
- Backend runs on port 5000
- Frontend development server runs on port 5173
- MongoDB connection required for full functionality
- File uploads stored in `backend/uploads/` directory

## 📝 Recent Updates

- **Image Upload System**: Complete image management for properties
- **Rental Type Feature**: Properties can be marked as rental, lease, or both
- **User Data Middleware**: Real-time user data integration
- **Enhanced Property Management**: Comprehensive property creation and editing
- **Tenant Property Browsing**: Advanced search and filtering capabilities
- **Authentication Improvements**: Secure JWT-based authentication system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please refer to the documentation files in the project root or create an issue in the repository.