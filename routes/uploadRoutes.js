const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed'));
    }
  },
});

router.post('/image', upload.single('image'), uploadImage);

module.exports = router;
