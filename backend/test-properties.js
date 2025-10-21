// Simple test script to verify property API endpoints
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Test data
const testProperty = {
  name: "Test Apartment",
  address: "123 Test Street, Test City",
  type: "Apartment",
  rent: 1500,
  description: "A beautiful test apartment",
  bedrooms: 2,
  bathrooms: 1
};

async function testPropertyAPI() {
  try {
    console.log('🧪 Testing Property API endpoints...\n');

    // First, you need to login to get a token
    console.log('ℹ️  Note: You need to login first to get a valid token');
    console.log('ℹ️  Replace YOUR_TOKEN_HERE with actual JWT token from login\n');

    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token
    const headers = { Authorization: `Bearer ${token}` };

    // Test GET /api/properties
    console.log('1. Testing GET /api/properties');
    try {
      const response = await axios.get(`${API_BASE}/properties`, { headers });
      console.log('✅ GET properties successful');
      console.log(`   Found ${response.data.length} properties\n`);
    } catch (error) {
      console.log('❌ GET properties failed:', error.response?.data?.message || error.message);
    }

    // Test POST /api/properties
    console.log('2. Testing POST /api/properties');
    try {
      const response = await axios.post(`${API_BASE}/properties`, testProperty, { headers });
      console.log('✅ POST property successful');
      console.log(`   Created property: ${response.data.name}\n`);
      
      const propertyId = response.data._id;

      // Test PUT /api/properties/:id
      console.log('3. Testing PUT /api/properties/:id');
      const updatedData = { ...testProperty, rent: 1600 };
      try {
        const updateResponse = await axios.put(`${API_BASE}/properties/${propertyId}`, updatedData, { headers });
        console.log('✅ PUT property successful');
        console.log(`   Updated rent to: ${updateResponse.data.rent}\n`);
      } catch (error) {
        console.log('❌ PUT property failed:', error.response?.data?.message || error.message);
      }

      // Test DELETE /api/properties/:id
      console.log('4. Testing DELETE /api/properties/:id');
      try {
        await axios.delete(`${API_BASE}/properties/${propertyId}`, { headers });
        console.log('✅ DELETE property successful\n');
      } catch (error) {
        console.log('❌ DELETE property failed:', error.response?.data?.message || error.message);
      }

    } catch (error) {
      console.log('❌ POST property failed:', error.response?.data?.message || error.message);
    }

    // Test property stats
    console.log('5. Testing GET /api/properties/stats/overview');
    try {
      const response = await axios.get(`${API_BASE}/properties/stats/overview`, { headers });
      console.log('✅ GET property stats successful');
      console.log('   Stats:', response.data);
    } catch (error) {
      console.log('❌ GET property stats failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('Property API Test Script');
console.log('========================');
testPropertyAPI();