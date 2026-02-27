const { pool } = require('../config/db');

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const query = 'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING *';
        const values = [name, description];
        const result = await pool.query(query, values);
        res.status(200).json({'message': 'Category Added Successfully', response: result.rows[0]});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM category';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM category WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);     
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;  
        const { name, description } = req.body;
        const query = 'UPDATE category SET name = $1, description = $2 WHERE category_id = $3 RETURNING *';
        const values = [name, description, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({'message': 'Category Updated Successfully', response: result.rows[0]});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;  
        const query = 'DELETE FROM category WHERE category_id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values); 
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
