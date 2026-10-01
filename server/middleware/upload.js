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
      } catch (cloudError) {
        console.warn('Cloudinary upload failed, using local disk fallback:', cloudError.message);

        const ext = path.extname(req.file.originalname) || '.jpg';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        fs.writeFileSync(filePath, req.file.buffer);
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:5000';
        req.file.path = `${protocol}://${host}/uploads/${filename}`;
      }

      next();
    });
  };
};

module.exports = { uploadSingleImage, upload: uploadMemory };
