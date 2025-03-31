import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Button,
    Menu,
    MenuItem,
    Paper,
    Card,
    CardContent,
    CardActions,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [documents, setDocuments] = useState([]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Carica progetti
            const projectsResponse = await api.get('/api/projects');
            console.log('Projects data:', projectsResponse.data);
            setProjects(projectsResponse.data);

            // Carica documenti
            const documentsResponse = await api.get('/api/documents');
            console.log('Documents data:', documentsResponse.data);
            setDocuments(documentsResponse.data);

            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Errore nel caricamento dei dati. Riprova più tardi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
                <Toolbar>
                    <Logo />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                        Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/projects')}>
                            Progetti
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/documents')}>
                            Documenti
                        </Button>
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                                Profilo
                            </MenuItem>
                            {user?.isAdmin && (
                                <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                                    Admin Panel
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Benvenuto, {user?.name || 'Utente'}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Da qui puoi gestire i tuoi progetti e documenti
                    </Typography>
                </Box>
                
                <Grid container spacing={4}>
                    {/* Progetti recenti */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%', minHeight: 350 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        I Tuoi Progetti
                                    </Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => navigate('/projects')}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Vedi tutti
                                </Button>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            {projects.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Non hai ancora creato nessun progetto
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate('/projects/new')}
                                    >
                                        Nuovo Progetto
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <List>
                                        {projects.slice(0, 5).map((project) => (
                                            <ListItem 
                                                key={project._id}
                                                button
                                                onClick={() => navigate(`/projects/edit/${project._id}`)}
                                            >
                                                <ListItemText
                                                    primary={project.name}
                                                    secondary={`Stato: ${project.status} | Creato: ${new Date(project.createdAt).toLocaleDateString()}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton 
                                                        edge="end" 
                                                        onClick={() => navigate(`/projects/edit/${project._id}`)}
                                                    >
                                                        <ArrowForwardIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                    
                                    {projects.length > 0 && (
                                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => navigate('/projects/new')}
                                            >
                                                Nuovo Progetto
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Paper>
                    </Grid>
                    
                    {/* Documenti recenti */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%', minHeight: 350 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Documenti Recenti
                                    </Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => navigate('/documents')}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Vedi tutti
                                </Button>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            {documents.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Non hai ancora caricato nessun documento
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate('/documents')}
                                    >
                                        Carica Documento
                                    </Button>
                                </Box>
                            ) : (
                                <List sx={{ py: 1 }}>
                                    {documents.slice(0, 5).map((document) => (
                                        <ListItem 
                                            key={document._id}
                                            button
                                            sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                            <ListItemText
                                                primary={document.name}
                                                secondary={`Caricato il: ${new Date(document.uploadDate).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                    
                    {/* Statistiche o altre informazioni */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Riepilogo Attività
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {projects.length}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Progetti Totali
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {documents.length}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Documenti Caricati
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {projects.filter(p => p.status === 'In corso').length}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Progetti in Corso
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard; 