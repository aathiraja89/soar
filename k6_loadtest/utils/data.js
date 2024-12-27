export function generateUniqueUser() {
  return {
    username: `user${Math.random().toString(36).substring(2, 8)}`,
    password: 'password123',
    email: `user${Math.random().toString(36).substring(2, 8)}@example.com`,
  };
}
