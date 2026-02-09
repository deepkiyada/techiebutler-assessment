import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper
} from '@mui/material';
import { getPollDetails, votePoll } from '../services/api';

function PollDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const data = await getPollDetails(id);
      setPoll(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await votePoll(id, selectedOption);
      setHasVoted(true);
      setTimeout(() => {
        navigate(`/results/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !poll) {
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
            {poll.title}
          </Typography>
          {poll.description && (
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              {poll.description}
            </Typography>
          )}
        </Box>

        {hasVoted && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              '& .MuiAlert-icon': {
                fontSize: 28,
              },
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Vote submitted successfully! Redirecting to results...
            </Typography>
          </Alert>
        )}

        {error && !hasVoted && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
          <Typography 
            variant="h5" 
            component="legend" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            Cast Your Vote
          </Typography>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {poll.options?.map((option, index) => (
              <Paper 
                key={option.id}
                elevation={0}
                sx={{ 
                  mb: 2,
                  p: 2.5,
                  border: selectedOption === option.id.toString() 
                    ? '2px solid' 
                    : '2px solid transparent',
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  cursor: hasVoted ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: selectedOption === option.id.toString()
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
                    : 'rgba(248, 250, 252, 0.8)',
                  animation: `slideIn 0.4s ease-out ${index * 0.1}s backwards`,
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(-20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                  '&:hover': {
                    background: hasVoted 
                      ? 'rgba(248, 250, 252, 0.8)'
                      : selectedOption === option.id.toString()
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)'
                      : 'rgba(99, 102, 241, 0.05)',
                    transform: hasVoted ? 'none' : 'translateX(4px)',
                    boxShadow: hasVoted ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.15)',
                  },
                }}
              >
                <FormControlLabel
                  value={option.id.toString()}
                  control={
                    <Radio 
                      disabled={hasVoted}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 28,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                      {option.text}
                    </Typography>
                  }
                  sx={{ width: '100%', m: 0 }}
                  disabled={hasVoted}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 5, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            onClick={handleVote}
            disabled={hasVoted || submitting || !selectedOption}
            fullWidth
            size="large"
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
            {submitting ? <CircularProgress size={28} sx={{ color: 'white' }} /> : hasVoted ? '✓ Vote Submitted' : 'Submit Vote'}
          </Button>
          <Button
            component={Link}
            to={`/results/${id}`}
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
            View Results
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PollDetailPage;
