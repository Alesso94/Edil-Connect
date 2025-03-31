import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import { api } from '../context/AuthContext';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    
    const [project, setProject] = useState({
        name: '',
        description: '',
        status: 'In corso',
        location: '',
        estimatedCost: '',
        startDate: '',
        endDate: ''
    });
    
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await api.get(`/api/projects/${id}`);
            const projectData = response.data;
            
            // Formatta le date per il form
            if (projectData.startDate) {
                projectData.startDate = new Date(projectData.startDate).toISOString().split('T')[0];
            }
            if (projectData.endDate) {
                projectData.endDate = new Date(projectData.endDate).toISOString().split('T')[0];
            }
            
            setProject(projectData);
            setLoading(false);
        } catch (error) {
            console.error('Errore nel recupero del progetto:', error);
            setError('Impossibile caricare i dati del progetto');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            if (isEditMode) {
                await api.put(`/api/projects/${id}`, project);
            } else {
                await api.post('/api/projects', project);
            }
            navigate('/projects');
        } catch (error) {
            console.error('Errore nel salvare il progetto:', error);
            setError(error.response?.data?.message || 'Errore nel salvare il progetto');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditMode ? 'Modifica Progetto' : 'Nuovo Progetto'}
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Nome Progetto"
                                name="name"
                                value={project.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="description"
                                label="Descrizione"
                                name="description"
                                multiline
                                rows={4}
                                value={project.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">Stato</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={project.status}
                                    label="Stato"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Non iniziato">Non iniziato</MenuItem>
                                    <MenuItem value="In corso">In corso</MenuItem>
                                    <MenuItem value="Completato">Completato</MenuItem>
                                    <MenuItem value="In pausa">In pausa</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="location"
                                label="Località"
                                name="location"
                                value={project.location || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="estimatedCost"
                                label="Costo Stimato (€)"
                                name="estimatedCost"
                                type="number"
                                value={project.estimatedCost || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="startDate"
                                label="Data Inizio"
                                name="startDate"
                                type="date"
                                value={project.startDate || ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="endDate"
                                label="Data Fine Prevista"
                                name="endDate"
                                type="date"
                                value={project.endDate || ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/projects')}
                            >
                                Annulla
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Salvataggio...
                                    </>
                                ) : (
                                    isEditMode ? 'Aggiorna Progetto' : 'Crea Progetto'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProjectForm; 