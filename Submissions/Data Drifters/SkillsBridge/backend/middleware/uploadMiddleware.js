const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Your Cloudinary config

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder;
    // Determine folder based on file type or request context
    if (file.mimetype.startsWith('image')) {
      folder = 'skillbridge_images';
    } else if (file.mimetype.startsWith('video')) {
      folder = 'skillbridge_videos';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'skillbridge_pdfs';
    } else {
      folder = 'skillbridge_misc';
    }

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith('image') ? 'image' : 'video', // Cloudinary resource type
      format: 'auto', // Cloudinary will auto-detect format
      public_id: `${folder}_${Date.now()}_${file.originalname.split('.')[0]}` // Unique public ID
    };
  },
});

// Multer instance for handling uploads
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Optional: Filter file types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed!'), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 100 } // Max file size (e.g., 100MB for video)
});

module.exports = upload;