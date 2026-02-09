const axios = require('axios');

// JSON Server URL (default port 4000)
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:4000';

const pollService = {
  // Get all active polls
  async getAllPolls() {
    try {
      const response = await axios.get(`${JSON_SERVER_URL}/polls`);
      // Filter to return only active polls
      const activePolls = response.data.filter(poll => poll.isActive === true);
      return activePolls;
    } catch (error) {
      console.error('Error fetching polls from JSON server:', error.message);
      throw new Error('Failed to fetch polls from database');
    }
  },

  // Get poll by ID with options
  async getPollById(id) {
    try {
      // Fetch poll and options in parallel for better performance
      const [pollResponse, optionsResponse] = await Promise.all([
        axios.get(`${JSON_SERVER_URL}/polls/${id}`),
        axios.get(`${JSON_SERVER_URL}/options?pollId=${id}`)
      ]);

      const poll = pollResponse.data;
      const options = optionsResponse.data;

      // Combine poll with its options
      return {
        ...poll,
        options
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Poll with id ${id} not found`);
        return null;
      }
      console.error('Error fetching poll from JSON server:', error.message);
      throw new Error('Failed to fetch poll from database');
    }
  },

  // Create a new poll with options
  async createPoll(pollData) {
    try {
      const { question, options } = pollData;

      // Create the poll first
      const pollPayload = {
        title: question,
        description: '',
        createdAt: new Date().toISOString(),
        totalVotes: 0,
        isActive: true
      };

      const pollResponse = await axios.post(`${JSON_SERVER_URL}/polls`, pollPayload);
      const createdPoll = pollResponse.data;

      // Create all options linked to the poll
      const optionPromises = options.map((optionText) => 
        axios.post(`${JSON_SERVER_URL}/options`, {
          pollId: createdPoll.id,
          text: optionText,
          voteCount: 0
        })
      );

      const optionResponses = await Promise.all(optionPromises);
      const createdOptions = optionResponses.map(res => res.data);

      // Return combined result
      return {
        ...createdPoll,
        options: createdOptions
      };
    } catch (error) {
      console.error('Error creating poll in JSON server:', error.message);
      throw new Error('Failed to create poll in database');
    }
  },

  // Vote on a poll option
  async voteOnPoll(pollId, optionId, userIp) {
    try {
      const parsedPollId = parseInt(pollId);
      const parsedOptionId = parseInt(optionId);

      // Check if this IP has already voted on this poll
      const existingVotesResponse = await axios.get(
        `${JSON_SERVER_URL}/votes?pollId=${parsedPollId}&userIp=${userIp}`
      );

      if (existingVotesResponse.data.length > 0) {
        return { error: 'duplicate', message: 'You have already voted on this poll' };
      }

      // Verify poll exists and get option
      const [pollResponse, optionResponse] = await Promise.all([
        axios.get(`${JSON_SERVER_URL}/polls/${parsedPollId}`).catch(() => null),
        axios.get(`${JSON_SERVER_URL}/options/${parsedOptionId}`).catch(() => null)
      ]);

      if (!pollResponse || !pollResponse.data) {
        return { error: 'not_found', message: 'Poll not found' };
      }

      if (!optionResponse || !optionResponse.data) {
        return { error: 'not_found', message: 'Option not found' };
      }

      const option = optionResponse.data;

      // Verify option belongs to the poll
      if (option.pollId !== parsedPollId) {
        return { error: 'invalid', message: 'Option does not belong to this poll' };
      }

      // Increment option vote count
      const updatedOption = await axios.patch(
        `${JSON_SERVER_URL}/options/${parsedOptionId}`,
        { voteCount: option.voteCount + 1 }
      );

      // Create vote record
      await axios.post(`${JSON_SERVER_URL}/votes`, {
        pollId: parsedPollId,
        optionId: parsedOptionId,
        userIp: userIp,
        votedAt: new Date().toISOString()
      });

      // Update poll total votes
      const poll = pollResponse.data;
      await axios.patch(`${JSON_SERVER_URL}/polls/${parsedPollId}`, {
        totalVotes: poll.totalVotes + 1
      });

      // Fetch updated poll with all options
      const updatedPollData = await this.getPollById(parsedPollId);
      return { success: true, poll: updatedPollData };

    } catch (error) {
      console.error('Error voting on poll:', error.message);
      throw new Error('Failed to register vote');
    }
  },

  // Get poll results with percentages
  async getPollResults(id) {
    try {
      const parsedPollId = parseInt(id);

      // Fetch poll and options in parallel
      const [pollResponse, optionsResponse] = await Promise.all([
        axios.get(`${JSON_SERVER_URL}/polls/${parsedPollId}`),
        axios.get(`${JSON_SERVER_URL}/options?pollId=${parsedPollId}`)
      ]);

      const poll = pollResponse.data;
      const options = optionsResponse.data;

      // Calculate total votes from options
      const totalVotes = options.reduce((sum, option) => sum + option.voteCount, 0);

      // Calculate percentage for each option
      const optionsWithPercentage = options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option.voteCount,
        percentage: totalVotes > 0 ? ((option.voteCount / totalVotes) * 100).toFixed(2) : '0.00'
      }));

      return {
        pollId: poll.id,
        title: poll.title,
        description: poll.description,
        totalVotes: totalVotes,
        options: optionsWithPercentage
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Poll with id ${id} not found`);
        return null;
      }
      console.error('Error fetching poll results from JSON server:', error.message);
      throw new Error('Failed to fetch poll results from database');
    }
  },

  // Delete a poll
  deletePoll(id) {
    const index = polls.findIndex(poll => poll.id === parseInt(id));
    if (index !== -1) {
      const deletedPoll = polls[index];
      polls.splice(index, 1);
      return deletedPoll;
    }
    return null;
  }
};

module.exports = pollService;
