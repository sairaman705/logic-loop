const express = require('express');
const router = express.Router();
const Editor = require('../models/Editor'); // Import your Editor model

// Route to fetch all editors
router.get('/editors', async (req, res) => {
  try {
    const editors = await Editor.find(); // Fetch all editors
    res.json(editors);
  } catch (error) {
    console.error('Error fetching editors:', error);
    res.status(500).json({ message: 'Error fetching editors' });
  }
});

module.exports = router;
