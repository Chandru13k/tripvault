const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the trip']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // If either date is missing, skip validation
        if (!this.startDate || !value) return true;
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  description: {
    type: String
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Added index for performance
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
