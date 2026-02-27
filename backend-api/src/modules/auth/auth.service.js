/**
 * Authentication Service
 *
 * - Handles login business logic
 * - Validates user credentials
 * - Returns authentication data
 */

exports.login = async ({ email, password }) => {
  // Validate credentials (demo logic)
  if (email !== 'admin@test.com' || password !== '123456') {
    throw new Error('Invalid credentials');
  }

  // Return auth response
  return {
    token: 'dummy-jwt-token',
    user: { id: 1, name: 'Admin' }
  };
};
