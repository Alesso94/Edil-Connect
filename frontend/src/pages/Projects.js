import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            console.log('Fetching projects with token:', token);
            console.log('Current user:', user);
            
            if (!token || !user) {
                console.log('No token or user found, redirecting to login');
                navigate('/login');
                return;
            }

            const response = await api.get('/api/projects');
            console.log('Projects fetched successfully:', response.data);
            setProjects(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching projects:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access, checking token validity');
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                } else {
                    setError('Errore di autenticazione. Riprova più tardi.');
                }
            } else {
                setError(error.response?.data?.message || 'Errore nel caricamento dei progetti');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await api.delete(`/api/projects/${projectId}`);
            setProjects(projects.filter(project => project._id !== projectId));
            console.log('Progetto eliminato con successo');
        } catch (error) {
            console.error('Error deleting project:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access during delete, checking token validity');
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                }
            } else {
                setError(error.response?.data?.message || 'Errore nella cancellazione del progetto');
            }
        }
    };

    useEffect(() => {
        if (token && user) {
            fetchProjects();
        } else {
            console.log('No token or user available, redirecting to login');
            navigate('/login');
        }
    }, [token, user, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    I Miei Progetti
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/projects/new')}
                >
                    Nuovo Progetto
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {projects.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6">
                                Non hai ancora creato nessun progetto
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Clicca su "Nuovo Progetto" per iniziare
                            </Typography>
                        </Paper>
                    </Grid>
                ) : (
                    projects.map((project) => (
                        <Grid item xs={12} md={6} lg={4} key={project._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        {project.name}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        Stato: {project.status}
                                    </Typography>
                                    <Typography variant="body2">
                                        {project.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Tooltip title="Modifica">
                                        <IconButton 
                                            size="small"
                                            onClick={() => navigate(`/projects/edit/${project._id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Elimina">
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteProject(project._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default Projects; 