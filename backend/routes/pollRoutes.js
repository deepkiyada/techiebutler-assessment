const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// GET /polls - Get all polls
router.get('/', pollController.getAllPolls);

// GET /polls/:id/results - Get poll results with percentages
router.get('/:id/results', pollController.getPollResults);

// GET /polls/:id - Get poll by ID
router.get('/:id', pollController.getPollById);

// POST /polls - Create a new poll
router.post('/', pollController.createPoll);

// POST /polls/:id/vote - Vote on a poll
router.post('/:id/vote', pollController.voteOnPoll);

// DELETE /polls/:id - Delete a poll
router.delete('/:id', pollController.deletePoll);

module.exports = router;
