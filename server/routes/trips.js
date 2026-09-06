const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');
const upload = require('../middleware/upload');

// All trip routes are protected
router.use(protect);

// @route   POST /api/trips
// @desc    Create a trip
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating } = req.body;

    // Build trip object
    const tripFields = {
      title,
      destination,
      user: req.user.id // Set user from token
    };

    if (startDate) tripFields.startDate = startDate;
    if (endDate) tripFields.endDate = endDate;
    if (description) tripFields.description = description;
    if (rating) tripFields.rating = rating;

    const trip = new Trip(tripFields);
    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Only return trips belonging to the logged-in user
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get a trip by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip by ID:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating } = req.body;

    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    // Build updated fields (do not allow changing user)
    const tripFields = {};
    if (title !== undefined) tripFields.title = title;
    if (destination !== undefined) tripFields.destination = destination;
    if (startDate !== undefined) tripFields.startDate = startDate;
    if (endDate !== undefined) tripFields.endDate = endDate;
    if (description !== undefined) tripFields.description = description;
    if (rating !== undefined) tripFields.rating = rating;

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: tripFields },
      { new: true, runValidators: true }
    );

    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await trip.deleteOne();

    res.json({ message: 'Trip removed' });
  } catch (error) {
    console.error('Error deleting trip:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trips/:id/upload
// @desc    Upload a photo for a trip
// @access  Private
const { tripOwnership } = require('../middleware/tripOwnership');

router.post('/:id/upload', tripOwnership, upload.single('image'), async (req, res) => {
  try {
    const trip = req.trip;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid image file' });
    }

    // Get the Cloudinary URL
    const imageUrl = req.file.path;

    // If it's the first image or no cover image is set, set as cover image
    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }

    // Add to photos array
    trip.photos.push(imageUrl);

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

module.exports = router;
