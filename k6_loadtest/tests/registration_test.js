// registration_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { generateUniqueUser } from './../utils/data.js'

// Initialize metrics
const registerSuccesses = new Counter('register_successes');
const registerFailures = new Counter('register_failures');
const errorRate = new Rate('error_rate');

// Load test configuration for /client_registeration
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Gradually ramp up to 10 users
    { duration: '1m', target: 10 }, // Maintain 10 users for 1 minute
    { duration: '10s', target: 10 }, // Gradually ramp down to 0 users
  ],
  vus: 1, // Number of virtual users
};

// SharedArray to store registered users
const registeredUsers = new SharedArray('registered_users', function() {
  return [];
});

export default function () {
  // Scenario 1: Client Registration
  const userData = {
    fullName: generateUniqueUser().username,
    userName: generateUniqueUser().username,
    email: generateUniqueUser().email,
    password: generateUniqueUser().password,
    phone: '9049303495',
  };

  var url = 'http://localhost:5000/client_registeration';
  var payload = userData;
  var params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  if (res.status === 200) {
    registerSuccesses.add(1);
    registeredUsers.push({ email: userData.email, userName: userData.userName, password: userData.password });
  } else {
    registerFailures.add(1);
    errorRate.add(1);
  }

  sleep(1); // Wait for 1 second
}

// BDD-style comments
// Scenario: Register a new client with valid data
// Given: A valid set of user data
// When: A POST request is made to /client_registeration with the user data
// Then: The server should respond with a 200 status code and a success message
