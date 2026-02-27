const router = require('express').Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');

// Route to create a new category
router.post('/create', createCategory);
// Route to get all categories
router.get('/getCategorys', getCategories);
// Route to get a category by ID
router.get('getCategoryById/:id', getCategoryById);
// Route to update a category by ID
router.put('/:id', updateCategory);
// Route to delete a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;
