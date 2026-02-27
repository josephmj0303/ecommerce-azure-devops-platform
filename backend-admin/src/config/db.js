const Pool = require('pg');
const devenv = require('dotenv');

// Load environment variables from .env file
devenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
    rejectUnauthorized: false
  }
});

// Export the connection logic
module.exports = {
    pool,
    connect: async () => {
        try {
            await pool.connect(); // Attempt to connect to the database
            console.log('Connected to the PostgreSQL database successfully.');
        } catch (error) {
            console.error('Error connecting to the PostgreSQL database:', error);
            throw error; // Throw an error if connection fails
        }
    },
};