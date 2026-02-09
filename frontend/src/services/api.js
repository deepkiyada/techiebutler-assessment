import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get all active polls
 * @returns {Promise<Array>} List of active polls
 */
export const getPolls = async () => {
  try {
    const response = await apiClient.get('/polls');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch polls');
  }
};

/**
 * Get poll details by ID with options
 * @param {number|string} id - Poll ID
 * @returns {Promise<Object>} Poll details with options
 */
export const getPollDetails = async (id) => {
  try {
    const response = await apiClient.get(`/polls/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Poll not found');
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch poll details');
  }
};

/**
 * Create a new poll
 * @param {Object} pollData - Poll data
 * @param {string} pollData.question - Poll question
 * @param {Array<string>} pollData.options - Array of option texts
 * @returns {Promise<Object>} Created poll with options
 */
export const createPoll = async (pollData) => {
  try {
    const response = await apiClient.post('/polls', pollData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid poll data');
    }
    throw new Error(error.response?.data?.error || 'Failed to create poll');
  }
};

/**
 * Vote on a poll
 * @param {number|string} pollId - Poll ID
 * @param {number} optionId - Option ID to vote for
 * @returns {Promise<Object>} Updated poll with options
 */
export const votePoll = async (pollId, optionId) => {
  try {
    const response = await apiClient.post(`/polls/${pollId}/vote`, {
      optionId: parseInt(optionId),
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('You have already voted on this poll');
    }
    if (error.response?.status === 404) {
      throw new Error('Poll or option not found');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid vote data');
    }
    throw new Error(error.response?.data?.error || 'Failed to submit vote');
  }
};

/**
 * Get poll results with percentages
 * @param {number|string} id - Poll ID
 * @returns {Promise<Object>} Poll results with vote counts and percentages
 */
export const getResults = async (id) => {
  try {
    const response = await apiClient.get(`/polls/${id}/results`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Poll not found');
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch results');
  }
};

// Export the configured axios instance for custom requests if needed
export default apiClient;
