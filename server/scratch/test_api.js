const testApi = async () => {
  const baseUrl = 'http://localhost:5000/api/auth';
  const email = `test_${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  console.log('--- STARTING BACKEND AUTHENTICATION INTEGRATION TESTS ---');

  // 1. Test registration
  console.log(`\n1. Registering user: ${email}...`);
  try {
    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const registerData = await registerResponse.json();
    console.log(`Response Status: ${registerResponse.status}`);
    console.log('Response Body:', registerData);

    if (registerResponse.status !== 201 || !registerData.success) {
      throw new Error('Registration failed');
    }
    console.log('✅ Registration test passed!');
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    process.exit(1);
  }

  // 2. Test login
  let token = '';
  console.log(`\n2. Logging in user: ${email}...`);
  try {
    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();
    console.log(`Response Status: ${loginResponse.status}`);
    console.log('Response Body:', loginData);

    if (loginResponse.status !== 200 || !loginData.success || !loginData.token) {
      throw new Error('Login failed');
    }
    token = loginData.token;
    console.log('✅ Login test passed! Token received.');
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    process.exit(1);
  }

  // 3. Test GET /api/auth/me (Protected route)
  console.log('\n3. Fetching user profile using JWT...');
  try {
    const profileResponse = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const profileData = await profileResponse.json();
    console.log(`Response Status: ${profileResponse.status}`);
    console.log('Response Body:', profileData);

    if (profileResponse.status !== 200 || !profileData.success || profileData.user.email !== email) {
      throw new Error('Profile retrieval failed');
    }
    console.log('✅ Profile retrieval test passed!');
  } catch (error) {
    console.error('❌ Profile retrieval test failed:', error.message);
    process.exit(1);
  }

  // 4. Test invalid token
  console.log('\n4. Requesting profile with invalid token...');
  try {
    const badResponse = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_token_here',
      },
    });

    const badData = await badResponse.json();
    console.log(`Response Status: ${badResponse.status}`);
    console.log('Response Body:', badData);

    if (badResponse.status !== 401) {
      throw new Error('Server did not reject invalid token with 401 status');
    }
    console.log('✅ Token rejection test passed!');
  } catch (error) {
    console.error('❌ Token rejection test failed:', error.message);
    process.exit(1);
  }

  console.log('\n=============================================');
  console.log('🎉 ALL BACKEND AUTH API VERIFICATION TESTS PASSED!');
  console.log('=============================================');
};

testApi();
