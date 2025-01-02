const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'ddrazuqb0',
  api_key: '762961636815798',
  api_secret: process.env.CLOUDINARY_SECRET,
  timeout: 120000 // 2 minutes timeout for Cloudinary
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'doctor-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // Reduce image size
      { quality: "auto:good" } // Optimize quality
    ]
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  },
  fileFilter: fileFilter
}).single('profilePhoto');

module.exports = uploadMiddleware;