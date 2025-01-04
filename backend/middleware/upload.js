const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'ddrazuqb0',
  api_key: '762961636815798',
  api_secret: process.env.CLOUDINARY_SECRET,
  timeout: 120000 // 2 minutes timeout for Cloudinary
});

const createStorage = (folderName)=>{
  return new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: folderName,
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // Reduce image size
      { quality: "auto:good" } // Optimize quality
    ]
  }
});
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const createUploadMiddleware = (folderName)=>{
  const storage = createStorage(folderName);
  
  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, 
      fieldSize: 10 * 1024 * 1024 
    },
    fileFilter: fileFilter
  }).single('profilePhoto');
};
  

module.exports = {
  doctorProfileUpload: createUploadMiddleware('doctor-profiles'),
  patientProfileUpload: createUploadMiddleware('patient-profiles')
};