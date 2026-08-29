const mongoose = require('mongoose');
const User = require('../models/User');
const Trip = require('../models/Trip');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5000/api';
let logs = [];
function log(msg) { console.log(msg); logs.push(msg); }
function pass(msg) { log(`✅ PASS: ${msg}`); }
function fail(msg) { log(`❌ FAIL: ${msg}`); }
function warn(msg) { log(`⚠️ WARNING: ${msg}`); }

async function fetchJSON(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runQATests() {
  log('==================================================');
  log('STARTING BACKEND API SECURITY QA TESTING');
  log('==================================================');

  let userA, tokenA, userB, tokenB, tripA_id, tripB_id;

  try {
    // SETUP
    const a = await fetchJSON(`${API_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ name: 'User A', email: `a_${Date.now()}@test.com`, password: 'password123' }) });
    const la = await fetchJSON(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email: a.data.user.email, password: 'password123' }) });
    tokenA = la.data.token;

    const b = await fetchJSON(`${API_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ name: 'User B', email: `b_${Date.now()}@test.com`, password: 'password123' }) });
    const lb = await fetchJSON(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email: b.data.user.email, password: 'password123' }) });
    tokenB = lb.data.token;

    const c = await fetchJSON(`${API_URL}/trips`, { method: 'POST', body: JSON.stringify({ title: 'Trip A', destination: 'Dest A' }), headers: { Authorization: `Bearer ${tokenA}` } });
    tripA_id = c.data._id;

    // SECTION 1: SECURITY TESTING
    log('\n--- 1. Security Edge Cases ---');
    
    // A. No Auth header
    let res = await fetchJSON(`${API_URL}/trips`);
    if (res.status === 401) pass('No Authorization header returns 401');
    else fail(`No Auth header returned ${res.status}`);

    // B. Invalid JWT
    res = await fetchJSON(`${API_URL}/trips`, { headers: { Authorization: `Bearer invalid.jwt.token` } });
    if (res.status === 401) pass('Invalid JWT returns 401');
    else fail(`Invalid JWT returned ${res.status}`);

    // C. Malformed Auth header
    res = await fetchJSON(`${API_URL}/trips`, { headers: { Authorization: `abc` } });
    if (res.status === 401) pass('Malformed Auth "abc" returns 401');
    else fail(`Malformed Auth "abc" returned ${res.status}`);

    res = await fetchJSON(`${API_URL}/trips`, { headers: { Authorization: `Bearer` } });
    if (res.status === 401) pass('Malformed Auth "Bearer" returns 401');
    else fail(`Malformed Auth "Bearer" returned ${res.status}`);

    // E. Malformed MongoDB ID
    res = await fetchJSON(`${API_URL}/trips/not-a-valid-id`, { headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 400 || res.status === 404) pass(`Malformed ID GET handled gracefully (${res.status})`);
    else fail(`Malformed ID GET crashed or unhandled: ${res.status}`);

    // F. Non-existent but syntactically valid ID
    const fakeId = new mongoose.Types.ObjectId().toString();
    res = await fetchJSON(`${API_URL}/trips/${fakeId}`, { headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 404) pass('Valid but non-existent ID GET returns 404');
    else fail(`Non-existent ID GET returned ${res.status}`);

    // G. Missing required fields
    res = await fetchJSON(`${API_URL}/trips`, { method: 'POST', body: JSON.stringify({}), headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 400) pass('Missing required fields on POST returns 400');
    else fail(`Missing fields POST returned ${res.status}`);

    // H. Invalid rating
    res = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { method: 'PUT', body: JSON.stringify({ rating: 6 }), headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 400) pass('Invalid rating > 5 returns 400');
    else warn(`Invalid rating > 5 was accepted (${res.status})`);

    // I. Invalid dates (End Date before Start Date)
    res = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { method: 'PUT', body: JSON.stringify({ startDate: '2026-05-10', endDate: '2026-05-01' }), headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 400) pass('End date before start date is rejected');
    else warn(`End date before start date was NOT rejected (${res.status}) - Requires app layer validation`);

    // J. Unexpected fields (Trying to change owner)
    res = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { method: 'PUT', body: JSON.stringify({ user: b.data.user.id }), headers: { Authorization: `Bearer ${tokenA}` } });
    let check = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { headers: { Authorization: `Bearer ${tokenA}` } });
    if (check.data.user === b.data.user.id) fail('User identity was overwritten by request body!');
    else pass('Client cannot assign ownership via request body');

    log('\n--- 2. Cross-User Ownership Attacks ---');
    const bTrip = await fetchJSON(`${API_URL}/trips`, { method: 'POST', body: JSON.stringify({ title: 'Trip B', destination: 'Dest B' }), headers: { Authorization: `Bearer ${tokenB}` } });
    tripB_id = bTrip.data._id;

    res = await fetchJSON(`${API_URL}/trips`, { headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.data.some(t => t._id === tripB_id)) fail('User A GET /trips returned Trip B!');
    else pass('GET /api/trips strictly returns only owned trips');

    res = await fetchJSON(`${API_URL}/trips/${tripB_id}`, { headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 403) pass('User A GET Trip B returns 403');
    else fail(`User A GET Trip B returned ${res.status}`);

    res = await fetchJSON(`${API_URL}/trips/${tripB_id}`, { method: 'PUT', body: JSON.stringify({ title: 'Hacked' }), headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 403) pass('User A PUT Trip B returns 403');
    else fail(`User A PUT Trip B returned ${res.status}`);

    res = await fetchJSON(`${API_URL}/trips/${tripB_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 403) pass('User A DELETE Trip B returns 403');
    else fail(`User A DELETE Trip B returned ${res.status}`);

    log('\n--- 3. CRUD Data Integrity ---');
    res = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { method: 'PUT', body: JSON.stringify({ title: 'Trip A Modified' }), headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.data.title === 'Trip A Modified' && res.data.destination === 'Dest A') pass('PUT modifies only intended fields without corrupting others');
    else fail('PUT corrupted unrelated fields');

    res = await fetchJSON(`${API_URL}/trips/${tripA_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } });
    if (res.status === 200) pass('DELETE own trip succeeds');
    else fail('DELETE own trip failed');

  } catch (err) {
    console.error('Test script crashed:', err);
  } finally {
    console.log('\nTests completed.');
    process.exit(0);
  }
}

runQATests();
