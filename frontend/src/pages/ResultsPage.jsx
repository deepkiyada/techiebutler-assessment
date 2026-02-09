import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Paper,
  Chip
} from '@mui/material';
import { getResults } from '../services/api';

function ResultsPage() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getResults(id);
      // Sort options by vote count in descending order
      if (data.options) {
        data.options.sort((a, b) => b.voteCount - a.voteCount);
      }
      setResults(data);
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
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Back to Polls
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6, px: { xs: 2, sm: 3 } }}>
      <Button 
        component={Link} 
        to="/" 
        sx={{ 
          mb: 3,
          color: 'white',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        ← Back to Polls
      </Button>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, sm: 5 },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          animation: 'fadeIn 0.6s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ mb: 4, pb: 3, borderBottom: '2px solid rgba(99, 102, 241, 0.1)' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
            }}
          >
            {results.title}
          </Typography>
          {results.description && (
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              {results.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Chip
            label={`${results.totalVotes} Total ${results.totalVotes === 1 ? 'Vote' : 'Votes'}`}
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              px: 2,
              py: 3,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              color: 'primary.main',
              border: '2px solid rgba(99, 102, 241, 0.3)',
            }}
          />
        </Box>

        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
        >
          Live Results
        </Typography>

        {results.totalVotes === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              border: '1px solid rgba(99, 102, 241, 0.3)',
              textAlign: 'center',
              py: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              No votes yet
            </Typography>
            <Typography variant="body1">
              Be the first to cast your vote!
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {results.options.map((option, index) => (
              <Paper 
                key={option.id}
                elevation={0}
                sx={{ 
                  p: 3.5,
                  borderRadius: 4,
                  background: index === 0 && option.voteCount > 0 && results.totalVotes > 0
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)'
                    : 'rgba(248, 250, 252, 0.8)',
                  border: '2px solid',
                  borderColor: index === 0 && option.voteCount > 0 && results.totalVotes > 0
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(99, 102, 241, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ flex: 1, fontSize: '1.2rem', lineHeight: 1.3 }}
                  >
                    {option.text}
                  </Typography>
                  <Box sx={{ textAlign: 'right', ml: 2 }}>
                    <Typography 
                      variant="h4" 
                      fontWeight={800}
                      sx={{
                        background: index === 0 && option.voteCount > 0
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {option.percentage}%
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(option.percentage)}
                    sx={{ 
                      height: 20, 
                      borderRadius: 10,
                      backgroundColor: 'rgba(226, 232, 240, 0.5)',
                      overflow: 'hidden',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 10,
                        background: index === 0 && option.voteCount > 0 && results.totalVotes > 0
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : index % 4 === 0
                          ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                          : index % 4 === 1
                          ? 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)'
                          : index % 4 === 2
                          ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                          : 'linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)',
                        transition: 'transform 1s ease-out',
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    {option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'}
                  </Typography>
                  {index === 0 && option.voteCount > 0 && results.totalVotes > 0 && (
                    <Chip 
                      label="🏆 Top Choice" 
                      size="small"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        },
                      }}
                    />
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 5, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            component={Link}
            to={`/poll/${id}`}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 28px rgba(99, 102, 241, 0.4)',
              },
            }}
          >
            Cast Your Vote
          </Button>
          <Button
            onClick={fetchResults}
            variant="outlined"
            size="large"
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: { sm: 140 },
              borderWidth: 2,
              borderColor: 'primary.main',
              '&:hover': {
                borderWidth: 2,
                background: 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            🔄 Refresh
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResultsPage;
