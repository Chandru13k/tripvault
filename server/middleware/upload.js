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
  return (req, res, next) => {
    uploadMemory.single(fieldName)(req, res, async (err) => {
      if (err) {
        console.error('Multer parsing error:', err.message);
        return res.status(400).json({ message: err.message || 'File upload error' });
      }

      if (!req.file || !req.file.buffer) {
        return next();
      }

      try {
        const cloudinaryResult = await new Promise((resolve, reject) => {
          try {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'tripvault', resource_type: 'auto' },
              (error, result) => {
                if (error) return reject(error);
                if (!result || !result.secure_url) return reject(new Error('Invalid Cloudinary response'));
                resolve(result);
              }
            );
            if (!stream || typeof stream.end !== 'function') {
              return reject(new Error('Cloudinary stream unavailable'));
            }
            stream.end(req.file.buffer);
          } catch (streamErr) {
            reject(streamErr);
          }
        });

        req.file.path = cloudinaryResult.secure_url;
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, applying base64 Data URL fallback:', cloudErr.message || cloudErr);
        const mimeType = req.file.mimetype || 'image/jpeg';
        const base64Data = req.file.buffer.toString('base64');
        req.file.path = `data:${mimeType};base64,${base64Data}`;
      }

      next();
    });
  };
};

module.exports = { uploadSingleImage, upload: uploadMemory };
