
// login_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Initialize metrics
const loginSuccesses = new Counter('login_successes');
const loginFailures = new Counter('login_failures');
const errorRate = new Rate('error_rate');

// Stress test configuration for /client_login
// export const options_login = {
//   vus: 50, // Number of virtual users
//   duration: '1m',
// };
export const options = {
  stages: [
    { duration: '1s', target: 50 }, // Gradually ramp up to 10 users
    { duration: '1m', target: 50 }, // Maintain 10 users for 1 minute
    { duration: '10s', target: 0 }, // Gradually ramp down to 0 users
  ],
  vus: 1, // Number of virtual users
};

// Access the shared array
const registeredUsers = new SharedArray('registered_users');

export default function () {
  const index = Math.floor(Math.random() * registeredUsers.length);
  const { email, userName, password } = registeredUsers[index];
  // Scenario 2: Client Login
  const loginData = {
    email: email,
    userName: userName,
    password: password,
  };

    var url = 'http://localhost:5000/client_login';
    var params = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const loginRes = http.post(url, loginData, params);

  check(loginRes, {
    'status is 200': (r) => r.status === 200,
  });

  if (loginRes.status === 200) {
    loginSuccesses.add(1);
  } else {
    loginFailures.add(1);
    errorRate.add(1);
  }

  sleep(1); // Wait for 1 second
}

// BDD-style comments
// Scenario: Login a registered client
// Given: A valid username and password for a registered user
// When: A POST request is made to /client_login with the valid credentials
// Then: The server should respond with a 200 status code and a valid JWT token
