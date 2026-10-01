const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for inspecting file before uploading
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only image files.'), false);
  }
};

const uploadMemory = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadSingleImage = (fieldName = 'image') => {
  const multerHandler = uploadMemory.single(fieldName);

  return (req, res, next) => {
    multerHandler(req, res, async (err) => {
      if (err) {
        console.error('Multer file parsing error:', err.message);
        return res.status(400).json({ message: err.message || 'File upload error' });
      }

      if (!req.file) {
        return next();
      }

      // Try uploading buffer to Cloudinary
      try {
        const cloudinaryResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'tripvault', resource_type: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        req.file.path = cloudinaryResult.secure_url;
        return next();
      } catch (cloudError) {
        console.warn('Cloudinary upload failed, using Data URL fallback:', cloudError.message);

        try {
          const mimeType = req.file.mimetype || 'image/jpeg';
          const base64Data = req.file.buffer.toString('base64');
          req.file.path = `data:${mimeType};base64,${base64Data}`;
          return next();
        } catch (fallbackErr) {
          console.error('Data URL fallback failed:', fallbackErr);
          return res.status(500).json({ message: 'Failed to process image payload' });
        }
      }
    });
  };
};

module.exports = { uploadSingleImage, upload: uploadMemory };
