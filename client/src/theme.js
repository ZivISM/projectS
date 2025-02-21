import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Coral pink
      light: '#FF8E8E',
      dark: '#E85555',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4ECDC4', // Turquoise
      light: '#6ED7D0',
      dark: '#3BA89F',
      contrastText: '#fff',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
}); 