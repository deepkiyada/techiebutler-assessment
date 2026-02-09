import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PollIcon from '@mui/icons-material/Poll';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home';

function Header() {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: 2,
            p: 1,
            mr: 2,
          }}
        >
          <PollIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all 0.3s ease',
            '&:hover': {
              opacity: 0.8,
              transform: 'translateY(-1px)',
            },
          }}
        >
          PollVerse
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              color: 'text.primary',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                color: 'primary.main',
              },
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/create"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              borderRadius: 2,
              px: 2.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create Poll
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
