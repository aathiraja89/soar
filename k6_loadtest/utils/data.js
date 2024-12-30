export function generateUniqueUser() {
  return {
    username: `user${Math.random().toString(36).substring(2, 8)}`,
    password: 'password123',
    email: `user${Math.random().toString(36).substring(2, 8)}@example.com`,
  };
}

export const LOGIN_URL = 'http://localhost:5000/client_login'
export const REGISTER_URL = 'http://localhost:5000/client_registeration'


export const urlencoded_header = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
