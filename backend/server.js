const express = require('express');
const cors = require('cors');
const pollRoutes = require('./routes/pollRoutes');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/polls', pollRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Polling API',
    endpoints: {
      health: '/health',
      polls: '/api/polls',
      options: '/api/options',
      votes: '/api/votes'
    }
  });
});

// Health route
app.get('/health', (req, res) => {
  res.send('API running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
