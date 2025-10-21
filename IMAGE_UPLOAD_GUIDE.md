# Property Image Upload Feature

## 🖼️ Overview
The property management system now supports image uploads for properties. Landlords can add multiple images when creating or editing properties.

## ✨ Features

### Backend Features
- **Multiple Image Upload**: Upload up to 10 images per property
- **File Validation**: Only accepts image files (jpeg, jpg, png, gif, webp)
- **File Size Limit**: Maximum 5MB per image
- **Secure Storage**: Images stored in `uploads/properties/` directory
- **Unique Filenames**: Automatic filename generation to prevent conflicts
- **Image Deletion**: API endpoint to delete individual images

### Frontend Features
- **Drag & Drop Interface**: Easy image selection with file input
- **Image Preview**: Real-time preview of selected images
- **Image Management**: Remove images before saving
- **Property Cards**: Display property images in the property grid
- **Multiple Image Indicator**: Shows "+X more" when property has multiple images

## 🛠️ Technical Implementation

### Backend Endpoints

#### Upload Images
```
POST /api/properties/upload-images
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: FormData with 'images' field (multiple files)
```

#### Delete Image
```
DELETE /api/properties/images/:filename
Authorization: Bearer <token>
```

### Frontend Components
- **Image Upload Input**: Hidden file input with custom button
- **Image Preview Grid**: 3-column grid showing selected images
- **Remove Image Button**: X button on each preview image
- **Property Card Images**: Main image display with count indicator

## 📁 File Structure
```
backend/
├── uploads/
│   └── properties/          # Uploaded property images
├── middleware/
│   └── upload.js           # Multer configuration
└── routes/
    └── properties.js       # Image upload routes

frontend/
└── src/pages/landlord/
    └── PropertiesPage.jsx  # Updated with image functionality
```

## 🚀 Usage

### For Landlords
1. **Adding Images**: Click "Add Images" button in property form
2. **Preview**: Selected images appear in a grid below
3. **Remove**: Click X button on any image to remove it
4. **Save**: Images are uploaded when property is saved

### Image Display
- **Property Cards**: Show first image as card header
- **Multiple Images**: Display "+X more" indicator
- **No Images**: Property cards show without image header

## 🔒 Security Features
- **Authentication Required**: All image operations require valid JWT token
- **Role-Based Access**: Only landlords can upload/delete images
- **File Type Validation**: Server-side validation of image types
- **File Size Limits**: Prevents large file uploads
- **Unique Filenames**: Prevents file conflicts and overwrites

## 📝 API Response Examples

### Successful Upload
```json
{
  "message": "Images uploaded successfully",
  "images": [
    "/uploads/properties/apartment-1640995200000-123456789.jpg",
    "/uploads/properties/kitchen-1640995200000-987654321.jpg"
  ]
}
```

### Property with Images
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "Beautiful Apartment",
  "address": "123 Main St",
  "images": [
    "/uploads/properties/apartment-1640995200000-123456789.jpg",
    "/uploads/properties/kitchen-1640995200000-987654321.jpg"
  ],
  // ... other property fields
}
```

## 🐛 Error Handling
- **No Images**: Returns 400 if no images provided
- **Invalid File Type**: Returns 400 with file type error
- **File Too Large**: Returns 400 with size limit error
- **Upload Failed**: Returns 500 with server error
- **Unauthorized**: Returns 401/403 for authentication issues

## 🔧 Configuration
- **Upload Directory**: `uploads/properties/`
- **Max File Size**: 5MB per image
- **Max Files**: 10 images per upload
- **Allowed Types**: jpeg, jpg, png, gif, webp
- **Server URL**: Images served at `http://localhost:5000/uploads/properties/`