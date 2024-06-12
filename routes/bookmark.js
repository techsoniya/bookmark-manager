const express = require('express');
const router = express.Router();
const GuestbookEntry = require('../models/BookmarkEntry');

// Get all entries
router.get('/entries', async (req, res) => {
    try {
        const entries = await GuestbookEntry.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new entry
router.post('/entries', async (req, res) => {
    const entry = new GuestbookEntry({
        name: req.body.name,
        message: req.body.message
    });

    try {
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single entry by ID
router.get('/entries/:id', getEntry, (req, res) => {
    res.json(res.entry);
});

// Update an entry by ID
router.put('/entries/:id', getEntry, async (req, res) => {
    if (req.body.name != null) {
        res.entry.name = req.body.name;
    }
    if (req.body.message != null) {
        res.entry.message = req.body.message;
    }
    try {
        const updatedEntry = await res.entry.save();
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an entry by ID
router.delete('/entries/:id', getEntry, async (req, res) => {
    try {
        await res.entry.remove();
        res.json({ message: 'Deleted Entry' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single entry by ID
async function getEntry(req, res, next) {
    let entry;
    try {
        entry = await GuestbookEntry.findById(req.params.id);
        if (entry == null) {
            return res.status(404).json({ message: 'Cannot find entry' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.entry = entry;
    next();
}

module.exports = router;
