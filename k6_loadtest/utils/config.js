import { Trend, Counter } from 'k6/metrics';

// Metrics
export const registrationTrend = new Trend('registration_response_time');
export const loginTrend = new Trend('login_response_time');
export const errorCounter = new Counter('error_count');
