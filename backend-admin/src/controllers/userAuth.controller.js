const { pool } = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM tbuser WHERE username = $1",
            [username]
        );

        res.json({
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addNewUserByAdmin = async (req, res) => {
    try {
        const {
            role_id,
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number
        } = req.body;

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const password_hash = await bcrypt.hash(password, saltRounds);

        await pool.query(
            `INSERT INTO tbuser
             (role_id, username, email, password_hash, first_name, last_name, phone_number)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [role_id, username, email, password_hash, first_name, last_name, phone_number]
        );

        res.status(201).json({
            status: "SUCCESS",
            message: "User created successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tbuser");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkLogin,
    addNewUserByAdmin,
    getAllUsers
};