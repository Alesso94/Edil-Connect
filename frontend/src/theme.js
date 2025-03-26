import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0'
        },
        secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#c51162'
        },
        background: {
            default: '#f5f5f5'
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 500
        },
        h2: {
            fontWeight: 500
        },
        h3: {
            fontWeight: 500
        },
        h4: {
            fontWeight: 500
        },
        h5: {
            fontWeight: 500
        },
        h6: {
            fontWeight: 500
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12
                }
            }
        }
    }
});

export default theme; 