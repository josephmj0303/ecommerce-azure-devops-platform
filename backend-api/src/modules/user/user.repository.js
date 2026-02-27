const { pool } = require('../../config/database');

/**
 * User Repository
 *
 * - Handles all database operations for users
 * - Uses parameterized queries to prevent SQL injection
 * - Only interacts with the database; no business logic
 */

/**
 * Check if email exists
 *
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists, false otherwise
 */
exports.isEmailExists = async (email) => {
  const sql = `
    SELECT 1
    FROM tbuser
    WHERE email = $1
      AND delflag = 0 AND isactive = true
    LIMIT 1
  `;
  const { rowCount } = await pool.query(sql, [email]);
  return rowCount > 0;
};



/**
 * Create User
 *
 * - Inserts a new user into tbuser table
 * - Returns the created user (userid, fullname, email)
 * - @param {Object} user - { fullname, email, password }
 * - @returns {Object} Created user
 */
exports.createUser = async (user) => {
  const sql = `
    INSERT INTO tbuser
      (fullname, email, passwordhash,userType,vendorNumber, phone, isactive,
       createdby, createdon,
       modifiedby, modifiedon,
       delflag, deletedby, deletedon)
    VALUES
      ($1, $2, $3, $4, $5, '-', true,
       1, NOW(),
       1, NOW(),
       0, 0, NULL)
    RETURNING userid, fullname, email, userType;
  `;

  const { rows } = await pool.query(sql, [
    user.fullname,
    user.email,
    user.passwordhash,
    user.userType,
    user.vendorNumber
  ]);

  return rows[0];
};

/**
 * Get user by email (Login)
 *
 * - Fetches active user by email
 * - Returns passwordhash for validation
 */
exports.getUserByEmail = async (email, password) => {
  const sql = `
    SELECT userid, fullname, email, userType
    FROM tbuser
    WHERE email = $1 AND passwordhash = $2
      AND delflag = 0
      AND isactive = true
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [email, password]);
  return rows[0]; // undefined if not exists
};


/**
 * Get All Users
 *
 * - Fetches all active users
 * - Ignores soft-deleted records
 * - @returns {Array} List of users
 */
exports.getUsers = async () => {
  const { rows } = await pool.query(
    `SELECT userid, fullname, email , userType
     FROM tbuser 
     WHERE delflag = 0 AND isactive = true`
  );
  return rows;
};

/**
 * Get User By ID
 *
 * - Fetches a user by their ID
 * - Ignores soft-deleted records
 * - @param {number} id - User ID
 * - @returns {Object} User record or null
 */
exports.getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT userid, fullname, email , userType
     FROM tbuser 
     WHERE userid = $1 AND delflag = 0 AND isactive = true`,
    [id]
  );
  return rows[0];
};

/**
 * Update User
 *
 * - Updates fullname and email by userid
 * - Updates modifiedon timestamp automatically
 * - Returns updated user record
 * - @param {number} id - User ID
 * - @param {Object} user - { fullname, email }
 * - @returns {Object} Updated user
 */
exports.updateUser = async (id, user) => {
  const sql = `
    UPDATE tbuser
    SET fullname = $1,
        email = $2,
        modifiedon = NOW()
    WHERE userid = $3
    RETURNING userid, fullname, email
  `;
  const { rows } = await pool.query(sql, [
    user.fullname,
    user.email,
    id
  ]);
  return rows[0];
};

/**
 * Delete User (Soft Delete)
 *
 * - Marks user as deleted (delflag = 1)
 * - Data remains in DB for auditing purposes
 * - @param {number} id - User ID
 */
exports.deleteUser = async (id) => {
  await pool.query(
    `UPDATE tbuser SET delflag = 1 WHERE userid = $1`,
    [id]
  );
};
