const pollService = require('../services/pollService');

const pollController = {
  // GET /polls - Get all active polls
  async getAllPolls(req, res) {
    try {
      const polls = await pollService.getAllPolls();
      res.json(polls);
    } catch (error) {
      console.error('Error in getAllPolls controller:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch polls',
        message: error.message 
      });
    }
  },

  // GET /polls/:id - Get poll by ID with options
  async getPollById(req, res) {
    try {
      const poll = await pollService.getPollById(req.params.id);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.json(poll);
    } catch (error) {
      console.error('Error in getPollById controller:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch poll',
        message: error.message 
      });
    }
  },

  // POST /polls - Create a new poll with options
  async createPoll(req, res) {
    try {
      const { question, options } = req.body;

      // Validation
      if (!question || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ 
          error: 'Question and at least 2 options are required' 
        });
      }

      const newPoll = await pollService.createPoll({ question, options });
      res.status(201).json(newPoll);
    } catch (error) {
      console.error('Error in createPoll controller:', error.message);
      res.status(500).json({ 
        error: 'Failed to create poll',
        message: error.message 
      });
    }
  },

  // POST /polls/:id/vote - Vote on a poll
  async voteOnPoll(req, res) {
    try {
      const { optionId } = req.body;

      if (!optionId) {
        return res.status(400).json({ error: 'Option ID is required' });
      }

      // Get user IP from request
      const userIp = req.ip || 
                     req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.connection.remoteAddress || 
                     'unknown';

      const result = await pollService.voteOnPoll(req.params.id, optionId, userIp);
      
      // Handle different error types
      if (result.error === 'duplicate') {
        return res.status(409).json({ error: result.message });
      }
      
      if (result.error === 'not_found') {
        return res.status(404).json({ error: result.message });
      }

      if (result.error === 'invalid') {
        return res.status(400).json({ error: result.message });
      }

      res.json(result.poll);
    } catch (error) {
      console.error('Error in voteOnPoll controller:', error.message);
      res.status(500).json({ 
        error: 'Failed to vote',
        message: error.message 
      });
    }
  },

  // GET /polls/:id/results - Get poll results with percentages
  async getPollResults(req, res) {
    try {
      const results = await pollService.getPollResults(req.params.id);
      
      if (!results) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      res.json(results);
    } catch (error) {
      console.error('Error in getPollResults controller:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch poll results',
        message: error.message 
      });
    }
  },

  // DELETE /polls/:id - Delete a poll
  deletePoll(req, res) {
    try {
      const deletedPoll = pollService.deletePoll(req.params.id);
      
      if (!deletedPoll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      res.json({ message: 'Poll deleted successfully', poll: deletedPoll });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete poll' });
    }
  }
};

module.exports = pollController;
