const mongoose = require('mongoose');
const User = require('../models/User');
const Trip = require('../models/Trip');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return { status: res.status, data };
}

async function runTests() {
  console.log('--- Starting API Tests ---');
  let user1Token, user2Token, tripId;

  try {
    // 1. Setup: Register and Login two test users
    console.log('1. Setting up test users...');
    const userAEmail = `testA_${Date.now()}@test.com`;
    await fetchJSON(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User A',
        email: userAEmail,
        password: 'password123'
      })
    });
    let loginA = await fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: userAEmail, password: 'password123' })
    });
    user1Token = loginA.data.token;

    const userBEmail = `testB_${Date.now()}@test.com`;
    await fetchJSON(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User B',
        email: userBEmail,
        password: 'password123'
      })
    });
    let loginB = await fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: userBEmail, password: 'password123' })
    });
    user2Token = loginB.data.token;
    console.log('✅ Users registered and logged in.');

    // 2. Test POST /api/trips
    console.log('\n2. Testing Trip Creation (POST /api/trips)');
    let createRes = await fetchJSON(`${API_URL}/trips`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Paris Vacation',
        destination: 'Paris, France',
        startDate: '2027-05-01',
        endDate: '2027-05-15',
        description: 'Spring break in Paris!',
        rating: 5
      }),
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    tripId = createRes.data._id;
    if (!tripId) throw new Error('Trip ID missing in response');
    console.log('✅ Trip created successfully by User A.');

    // 3. Test GET /api/trips
    console.log('\n3. Testing Get All Trips (GET /api/trips)');
    let getResA = await fetchJSON(`${API_URL}/trips`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    if (getResA.data.length !== 1) throw new Error('User A should have exactly 1 trip');
    console.log('✅ User A fetched their trips.');

    let getResB = await fetchJSON(`${API_URL}/trips`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    if (getResB.data.length !== 0) throw new Error('User B should have 0 trips');
    console.log('✅ User B fetched their trips (empty).');

    // 4. Test Ownership Protection (User B tries to update User A's trip)
    console.log('\n4. Testing Ownership Protection (PUT/DELETE)');
    try {
      await fetchJSON(`${API_URL}/trips/${tripId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: 'Hacked Trip' }),
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      throw new Error('User B was able to update User A\'s trip!');
    } catch (err) {
      if (err.status === 403) {
        console.log('✅ User B prevented from updating User A\'s trip (403).');
      } else {
        throw err;
      }
    }

    try {
      await fetchJSON(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      throw new Error('User B was able to delete User A\'s trip!');
    } catch (err) {
      if (err.status === 403) {
        console.log('✅ User B prevented from deleting User A\'s trip (403).');
      } else {
        throw err;
      }
    }

    // 5. Test Update Own Trip (User A)
    console.log('\n5. Testing Update Own Trip (PUT /api/trips/:id)');
    let updateRes = await fetchJSON(`${API_URL}/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating: 4 }),
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    if (updateRes.data.rating !== 4) throw new Error('Rating not updated');
    console.log('✅ User A successfully updated their trip.');

    // 6. Test Delete Own Trip (User A)
    console.log('\n6. Testing Delete Own Trip (DELETE /api/trips/:id)');
    await fetchJSON(`${API_URL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✅ User A successfully deleted their trip.');

    // Verify deletion
    try {
      await fetchJSON(`${API_URL}/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${user1Token}` }
      });
      throw new Error('Trip should be 404 not found');
    } catch (err) {
      if (err.status !== 404) throw err;
      console.log('✅ Deletion verified.');
    }

    console.log('\n🎉 ALL TESTS PASSED!');

  } catch (error) {
    console.error('❌ TEST FAILED:');
    if (error.status) {
      console.error(error.status, error.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    // Cleanup DB
    console.log('\nCleaning up DB...');
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      await User.deleteMany({ email: /test.*@test\.com/ });
      await Trip.deleteMany({});
      console.log('Cleanup done.');
    } else {
      console.log('MONGO_URI not set, skipping cleanup.');
    }
    process.exit(0);
  }
}

runTests();
