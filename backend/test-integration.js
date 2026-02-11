const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3001/api';

// Test variables
let authToken = '';
let userId = null;
let testTodoId = null;

async function runTests() {
  console.log('Starting API Integration Tests...\n');

  try {
    // Scenario 1: 회원가입 → 로그인 → 할일 추가 → 조회
    console.log('=== Scenario 1: Full user flow ===');
    
    // Register a new user
    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: `test_user_${Date.now()}`,
      password: 'password123',
      email: `test${Date.now()}@example.com`
    });
    console.log('✓ Registration successful:', registerResponse.data.user.username);
    userId = registerResponse.data.user.id;

    // Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: registerResponse.data.user.username,
      password: 'password123'
    });
    authToken = loginResponse.data.token;
    console.log('✓ Login successful, token received');

    // Add a todo
    console.log('3. Adding a todo...');
    const todoResponse = await axios.post(`${BASE_URL}/todos`, {
      title: 'Test todo from integration test',
      description: 'This is a test todo',
      dueDate: '2026-12-31'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    testTodoId = todoResponse.data.id;
    console.log('✓ Todo added successfully:', todoResponse.data.title);

    // Retrieve todos
    console.log('4. Retrieving todos...');
    const getTodosResponse = await axios.get(`${BASE_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ Retrieved', getTodosResponse.data.length, 'todos');

    // Scenario 2: 할일 수정 → 완료 처리 → 삭제
    console.log('\n=== Scenario 2: Todo operations ===');

    // Update the todo
    console.log('1. Updating the todo...');
    const updateResponse = await axios.put(`${BASE_URL}/todos/${testTodoId}`, {
      title: 'Updated test todo',
      description: 'This is an updated test todo',
      dueDate: '2026-12-31'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ Todo updated successfully:', updateResponse.data.title);

    // Toggle complete
    console.log('2. Toggling complete status...');
    const toggleResponse = await axios.patch(`${BASE_URL}/todos/${testTodoId}/complete`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ Todo completion toggled, is_completed:', toggleResponse.data.is_completed);

    // Delete the todo
    console.log('3. Deleting the todo...');
    await axios.delete(`${BASE_URL}/todos/${testTodoId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ Todo deleted successfully');

    // Scenario 3: 미인증 접근 테스트
    console.log('\n=== Scenario 3: Unauthorized access test ===');
    try {
      await axios.get(`${BASE_URL}/todos`);
      console.log('✗ Failed: Should have received unauthorized error');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✓ Correctly rejected unauthorized request with 401');
      } else {
        console.log('✗ Unexpected error for unauthorized request:', error.message);
      }
    }

    // Scenario 4: 에러 코드 발생 테스트
    console.log('\n=== Scenario 4: Error code tests ===');
    
    // Test E-002: Invalid credentials
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'nonexistent_user',
        password: 'wrong_password'
      });
      console.log('✗ Failed: Should have received invalid credentials error');
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.error === 'E-002') {
        console.log('✓ Correctly returned E-002 for invalid credentials');
      } else {
        console.log('✗ Expected E-002 error but got:', error.response?.data || error.message);
      }
    }

    // Test E-103: Missing title when creating todo
    try {
      await axios.post(`${BASE_URL}/todos`, {
        description: 'This todo has no title',
        dueDate: '2026-12-31'
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✗ Failed: Should have received title required error');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'E-103') {
        console.log('✓ Correctly returned E-103 for missing title');
      } else {
        console.log('✗ Expected E-103 error but got:', error.response?.data || error.message);
      }
    }

    console.log('\n✓ All integration tests completed successfully!');
  } catch (error) {
    console.error('✗ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the tests
runTests();