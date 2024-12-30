import http from "k6/http";
import { check, sleep, group } from "k6";
import { Counter, Rate, Trend } from 'k6/metrics';
import { generateUniqueUser, LOGIN_URL, REGISTER_URL, urlencoded_header } from "./../utils/data.js";
import { SharedArray } from 'k6/data';

// Initialize metrics
const registerSuccesses = new Counter('register_successes');
const registerFailures = new Counter('register_failures');
const loginSuccesses = new Counter('login_successes');
const loginFailures = new Counter('login_failures');
const registerationErrorRate = new Rate('error_rate');
const loginErrorRate = new Rate('error_rate');

let TC01_CreateNewUser = new Trend("TC01_CreateNewUser");
let TC02_LoginUser = new Trend("TC02_LoginUser");

const TOTAL_RPS = 10;
const rate = (percentage) => TOTAL_RPS * percentage;

export const options = {
  scenarios: {
    setup: {
      executor: 'shared-iterations',
      vus: 1, // Setup runs with a single user
      iterations: 1, // Ensure setup runs once
      exec: 'setup',
    },
    load_test: {
      executor: 'constant-arrival-rate',
      duration: '10m',
      exec: 'setup',
      preAllocatedVUs: 10,
      rate: rate(0.1), // 10% of virtual users per second
    },
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 550 }, // Ramp up to 1000 VUs in 5 minutes
        { duration: '15m', target: 550 }, // Maintain 1000 VUs for 15 minutes
        { duration: '5m', target: 0 }, // Ramp down to 0 VUs in 5 minutes
      ],
      exec: 'default',

      // preAllocatedVUs: 1,
      // rate: rate(0.9), // 90%
    }
  }
};


export const setup = () =>  {
  return group("TC01: Load test the /client_registeration service", () => {

    // const generateUniqueUser = {
    //   username: `user${Math.random().toString(36).substring(2, 8)}`,
    //   password: 'password123',
    //   email: `user${Math.random().toString(36).substring(2, 8)}@example.com`,
    // };

    const userData = {
      fullName: generateUniqueUser().username,
      userName: generateUniqueUser().username,
      email: generateUniqueUser().email,
      password: generateUniqueUser().password,
      phone: '9049303495',
    };

    var params = {
      headers: urlencoded_header,
      tags: { name: "Create a new User" },
    };

    const response = http.post(REGISTER_URL, userData, params);

    const responseDuration = response.timings.duration;
    TC01_CreateNewUser.add(responseDuration);

    check(response, {
      'status is 200': (r) => r.status === 200,
    });

    if (response.status === 200) {
      registerSuccesses.add(1);
    } else {
      registerFailures.add(1);
      registerationErrorRate.add(1);
    }

    sleep(1);
    return userData;
  });
}


export default (userData) => {
  group("TC02: Stress test the /client_login service",  () => {
    const loginData = {
      email: userData.email,
      userName: userData.userName,
      password: userData.password,
    };

    var params = {
      headers: urlencoded_header,
      tags: { name: "Login to an existing User" },
    };

    const response = http.post(LOGIN_URL, loginData, params);

    const responseDuration = response.timings.duration;
    TC02_LoginUser.add(responseDuration);

    const checkResult = check(response, {
      "is status 200": (r) => r.status === 200,
    });

    if (response.status === 200) {
      loginSuccesses.add(1);
    } else {
      loginFailures.add(1);
      loginErrorRate.add(1);
    }
    sleep(1);
  });
}
