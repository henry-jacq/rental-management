// Simple test script to verify image upload functionality
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api';

async function testImageUpload() {
  try {
    console.log('🧪 Testing Image Upload API...\n');

    // You need a valid JWT token from login
    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token
    const headers = { Authorization: `Bearer ${token}` };

    console.log('ℹ️  Note: You need to login first to get a valid token');
    console.log('ℹ️  Replace YOUR_TOKEN_HERE with actual JWT token from login');
    console.log('ℹ️  Also place a test image file named "test-image.jpg" in the backend folder\n');

    // Test image upload
    console.log('1. Testing POST /api/properties/upload-images');
    
    // Check if test image exists
    const testImagePath = 'test-image.jpg';
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found. Please add a test-image.jpg file to the backend folder');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('images', fs.createReadStream(testImagePath));

      const response = await axios.post(
        `${API_BASE}/properties/upload-images`,
        formData,
        {
          headers: {
            ...headers,
            ...formData.getHeaders()
          }
        }
      );

      console.log('✅ Image upload successful');
      console.log('   Uploaded images:', response.data.images);
      console.log('   Message:', response.data.message);

      // Test creating property with images
      console.log('\n2. Testing property creation with images');
      const propertyData = {
        name: "Test Property with Images",
        address: "123 Image Test St",
        type: "Apartment",
        rent: 1500,
        description: "A property with uploaded images",
        bedrooms: 2,
        bathrooms: 1,
        images: response.data.images
      };

      const propertyResponse = await axios.post(
        `${API_BASE}/properties`,
        propertyData,
        { headers }
      );

      console.log('✅ Property with images created successfully');
      console.log('   Property ID:', propertyResponse.data._id);
      console.log('   Images:', propertyResponse.data.images);

    } catch (error) {
      console.log('❌ Image upload failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('Image Upload Test Script');
console.log('========================');
testImageUpload();