const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING WEEK 3 QA TESTS ---');
  let userA, userB, tokenA, tokenB, tripA;

  // 1. Setup Users
  try {
    const ts = Date.now();
    const resA = await axios.post(`${API_URL}/auth/register`, {
      name: 'User A', email: `usera_${ts}@test.com`, password: 'password123'
    });
    userA = resA.data.user;
    
    const loginA = await axios.post(`${API_URL}/auth/login`, {
      email: userA.email, password: 'password123'
    });
    tokenA = loginA.data.token;

    const resB = await axios.post(`${API_URL}/auth/register`, {
      name: 'User B', email: `userb_${ts}@test.com`, password: 'password123'
    });
    userB = resB.data.user;
    
    const loginB = await axios.post(`${API_URL}/auth/login`, {
      email: userB.email, password: 'password123'
    });
    tokenB = loginB.data.token;
    
    console.log('✅ Users registered and logged in');
  } catch (err) {
    console.error('❌ User setup failed:', err.response?.data || err.message);
    return;
  }

  // 2. Profile Edit
  try {
    const ts = Date.now();
    const username = `usera_${ts}`;
    const res = await axios.put(`${API_URL}/users/profile`, {
      username: username,
      bio: 'I love traveling!'
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    userA.username = res.data.user.username;
    console.log('✅ Profile edit successful');
  } catch (err) {
    console.error('❌ Profile edit failed:', err.response?.data || err.message);
  }

  // 3. Create Trip for User A
  try {
    const res = await axios.post(`${API_URL}/trips`, {
      title: 'Trip A',
      destination: 'Paris'
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    tripA = res.data;
    console.log('✅ Trip created successfully');
  } catch (err) {
    console.error('❌ Trip creation failed:', err.response?.data || err.message);
  }

  // 4. Photo Ownership Attack
  try {
    // User B tries to upload to Trip A
    const form = new FormData();
    // Use a dummy text file to test the upload restriction before even hitting Cloudinary
    form.append('image', Buffer.from('fake image data'), { filename: 'test.png', contentType: 'image/png' });
    
    await axios.post(`${API_URL}/trips/${tripA._id}/upload`, form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${tokenB}` 
      }
    });
    console.error('❌ Photo Ownership Attack succeeded (IT SHOULD HAVE FAILED)');
  } catch (err) {
    if (err.response?.status === 403) {
      console.log('✅ Photo Ownership Attack rejected (403)');
    } else {
      console.error('❌ Photo Ownership Attack failed with wrong error:', err.response?.status, err.response?.data);
    }
  }

  // 5. File Security (non-image)
  try {
    const form = new FormData();
    form.append('image', Buffer.from('this is a text file'), { filename: 'test.txt', contentType: 'text/plain' });
    
    await axios.post(`${API_URL}/trips/${tripA._id}/upload`, form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${tokenA}` 
      }
    });
    console.error('❌ Non-image file upload succeeded (IT SHOULD HAVE FAILED)');
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 500) {
      console.log('✅ Non-image file upload rejected');
    } else {
      console.error('❌ Non-image file upload failed with wrong error:', err.response?.status, err.response?.data);
    }
  }

  // 5b. REAL CLOUDINARY UPLOAD
  try {
    const imagePath = 'C:\\Users\\Chandru\\.gemini\\antigravity-ide\\brain\\8a012717-576e-46f3-8964-653b60863ce5\\test_trip_photo_1787988528881.jpg';
    if (fs.existsSync(imagePath)) {
      const form = new FormData();
      form.append('image', fs.createReadStream(imagePath));
      
      const res = await axios.post(`${API_URL}/trips/${tripA._id}/upload`, form, {
        headers: { 
          ...form.getHeaders(),
          Authorization: `Bearer ${tokenA}` 
        }
      });
      if (res.data.coverImage && res.data.photos.length > 0) {
        console.log('✅ Real Cloudinary upload succeeded! URL:', res.data.coverImage);
      } else {
        console.error('❌ Upload succeeded but URL is missing:', res.data);
      }
    } else {
      console.warn('⚠️ Test image not found at', imagePath, 'Skipping real upload test.');
    }
  } catch (err) {
    console.error('❌ Real Cloudinary upload failed:', err.response?.data || err.message);
  }

  // 6. Public Profile API
  try {
    const res = await axios.get(`${API_URL}/users/${userA.username}/profile`);
    if (res.data.user.email || res.data.user.password) {
      console.error('❌ Public Profile exposes sensitive data!');
    } else {
      console.log('✅ Public Profile API succeeded without sensitive data');
    }
  } catch (err) {
    console.error('❌ Public Profile API failed:', err.response?.data || err.message);
  }

  console.log('--- QA TESTS COMPLETED ---');
}

runTests();
