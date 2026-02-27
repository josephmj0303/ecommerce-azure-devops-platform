const router = require('express').Router();
const userAuthController = require('../controllers/userAuth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// User login
router.post('/login', userAuthController.checkLogin);
router.get('/getUsers', userAuthController.getAllUsers);
// Admin create user
router.post(
  '/admin/create-user',
  userAuthController.addNewUserByAdmin
);

module.exports = router;
