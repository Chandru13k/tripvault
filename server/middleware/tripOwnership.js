const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const tripOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Trip ID format' });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    // Attach trip to request object so controllers don't need to fetch it again
    req.trip = trip;
    
    // Ownership confirmed, proceed
    next();
  } catch (error) {
    console.error('Error in tripOwnership middleware:', error.message);
    res.status(500).json({ message: 'Server error during ownership check' });
  }
};

module.exports = { tripOwnership };
