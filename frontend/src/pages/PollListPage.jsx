import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getPolls } from '../services/api';

function PollListPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await getPolls();
      setPolls(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 6, px: { xs: 2, sm: 3 } }}>
      <Box 
        sx={{ 
          textAlign: 'center',
          mb: 6,
          animation: 'fadeIn 0.6s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 800,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Discover Active Polls
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400,
            mb: 4,
            textShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          Vote on trending polls or create your own
        </Typography>
      </Box>

      {polls.length === 0 ? (
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            p: 4,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <PollIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5 }} />
          </Box>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            No Active Polls Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to create a poll and start gathering opinions!
          </Typography>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 2 }}
          >
            Create Your First Poll
          </Button>
        </Card>
      ) : (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {polls.map((poll, index) => (
            <Card 
              key={poll.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`,
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                      flex: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {poll.title}
                  </Typography>
                  {poll.isActive && (
                    <Chip
                      label="Live"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 600,
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                        },
                      }}
                    />
                  )}
                </Box>
                {poll.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {poll.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Chip
                    icon={<PollIcon />}
                    label={`${poll.totalVotes || 0} ${poll.totalVotes === 1 ? 'vote' : 'votes'}`}
                    size="medium"
                    sx={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      color: 'primary.main',
                      fontWeight: 600,
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
                <Button
                  component={Link}
                  to={`/poll/${poll.id}`}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Vote Now
                </Button>
                <Button
                  component={Link}
                  to={`/results/${poll.id}`}
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      background: 'rgba(99, 102, 241, 0.08)',
                    },
                  }}
                >
                  Results
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default PollListPage;
