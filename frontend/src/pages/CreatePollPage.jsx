import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createPoll } from '../services/api';

function CreatePollPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const pollData = {
        question: question.trim(),
        options: validOptions
      };
      if (description.trim()) {
        pollData.description = description.trim();
      }
      const data = await createPoll(pollData);
      navigate(`/poll/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
            }}
          >
            Create New Poll
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
            Ask a question and gather opinions from the community
          </Typography>
        </Box>

        {error && (
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

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Poll Question"
            variant="outlined"
            fullWidth
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                },
              },
            }}
          />

          <TextField
            label="Description (Optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context to help people understand your poll..."
            sx={{ 
              mb: 5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                },
              },
            }}
          />

          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            Answer Options
          </Typography>

          <Box sx={{ mb: 3 }}>
            {options.map((option, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  mb: 2.5,
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`,
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(-20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                      },
                    },
                  }}
                />
                {options.length > 2 && (
                  <IconButton
                    onClick={() => handleRemoveOption(index)}
                    aria-label="delete option"
                    sx={{ 
                      alignSelf: 'center',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            variant="outlined"
            sx={{ 
              mb: 5,
              borderRadius: 3,
              borderWidth: 2,
              py: 1.5,
              px: 3,
              fontWeight: 600,
              borderColor: 'primary.main',
              '&:hover': {
                borderWidth: 2,
                background: 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            Add Another Option
          </Button>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
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
              {submitting ? <CircularProgress size={28} sx={{ color: 'white' }} /> : 'Create Poll'}
            </Button>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="large"
              sx={{
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
                minWidth: { sm: 140 },
                borderWidth: 2,
                borderColor: 'text.secondary',
                color: 'text.secondary',
                '&:hover': {
                  borderWidth: 2,
                  background: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreatePollPage;
