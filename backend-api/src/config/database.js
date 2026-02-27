/**
 * PostgreSQL Database Connection Module
 *
 * - Uses pg Pool for efficient connection reuse
 * - Reads credentials from environment variables
 * - Verifies database connectivity during app startup
 */

/* Concept Explanation
WHY Pool?
---------
• Pool maintains multiple DB connections
• Improves performance
• Avoids connection overhead per request
• Handles concurrent queries safely

WHY SELECT 1?
-------------
• Fastest possible query
• Does not touch any tables
• Used only to test DB availability
• Industry standard DB health check

WHY process.exit(1)?
--------------------
• Application should NOT run without DB
• Fails fast during startup
• Prevents runtime crashes later
• Common practice in production systems

*/

const { Pool } = require('pg');
const logger = require('../utils/logger'); // import logger

/**
 * Create a Connection Pool
 * Pool manages multiple DB connections efficiently
 * and prevents creating a new connection per request
 */

const pool = new Pool({
  host: process.env.DB_HOST,          // Database host (e.g. localhost, RDS endpoint)
  port: process.env.DB_PORT,          // Default  PostgreSQL port: 5432
  database: process.env.DB_NAME,      // Database name
  user: process.env.DB_USER,          // Database username
  password: process.env.DB_PASSWORD,   // Database password
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Connect Database
 *
 * Purpose:
 * - Ensures database is reachable when application starts
 * - Fails fast if Database is unavailable
 *
 * How it works:
 * - Executes a lightweight test query: `SELECT 1`
 * - If query succeeds → Database is connected
 * - If query fails → application exits
 */

const connectDB = async () => {
  try {
    // Simple health check query
    await pool.query('SELECT 1');
    logger.info(`✅ Database Connected (${process.env.NODE_ENV})`);
  } catch (err) {
    logger.error('❌ Database Connection Failed');
    logger.error(err.message);
    // Exit the process if Database connection fails
    // Prevents app from running in broken state
    process.exit(1);
  }
};
module.exports = { pool, connectDB };
