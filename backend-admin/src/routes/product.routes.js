const router = require('express').Router();
const multer = require('multer');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to create a new product
router.post('/create', upload.array('images', 10), createProduct);
// Route to get all products
router.get('/getProducts', getProducts);
// Route to get a product by ID
router.get('/getProductById/:id', getProductById);
// Route to update a product by ID
router.put('/updateProduct/:id', upload.array('images', 10), updateProduct);
// Route to delete a product by ID
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;