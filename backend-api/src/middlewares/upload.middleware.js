/**
 * File Upload Middleware (Multer)
 * Purpose:
 * - Handle image uploads for Category Groups & Products
 * - Store files on disk with clean naming
 * - Validate file type
 * - Log upload success & failure
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Ensure upload folder exists
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Multer Storage Factory
 * @param {string} folderName - Subfolder inside /uploads
 * @returns {DiskStorage}
 */
const storage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join('uploads', folderName);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${folderName}_${Date.now()}${ext}`;
      cb(null, filename);
    }
  });

/**
 * File Filter
 * Allowed types:
 * - jpeg
 * - jpg
 * - png
 * - webp
 */
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid =
    allowed.test(file.mimetype) &&
    allowed.test(path.extname(file.originalname).toLowerCase());

  if (!isValid) {
    logger.warn('❌ Invalid file type upload attempt', {
      originalName: file.originalname,
      mimeType: file.mimetype
    });
    return cb(new Error('Only image files are allowed'), false);
  }

  cb(null, true);
};

/**
 * Upload: Category Group Image
 * Field name: image
 * Max files: 1
 */
const uploadCategoryGroupImage = multer({
  storage: storage('categorygroup'),
  fileFilter
}).single('image');

/**
 * Upload: Product Images
 * Field name: images
 * Max files: 5
 */
const uploadProductImages = multer({
  storage: storage('product'),
  fileFilter
}).array('images', 5);

/**
 * Multer Error Handler Wrapper
 * Ensures errors go to global error handler
 */
const uploadHandler = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err) {
      logger.error('📂 File upload failed', {
        error: err.message
      });
      return next(err);
    }
    logger.info('📂 File upload success', {
      files: req.files || req.file
    });
    next();
  });
};
module.exports = {
  uploadCategoryGroupImage: uploadHandler(uploadCategoryGroupImage),
  uploadProductImages: uploadHandler(uploadProductImages)
};
