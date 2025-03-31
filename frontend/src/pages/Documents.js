import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton, CircularProgress, Alert } from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchDocuments = async () => {
        try {
            console.log('Fetching documents with token:', token);
            console.log('Current user:', user);
            
            if (!token || !user) {
                console.log('No token or user found, redirecting to login');
                navigate('/login');
                return;
            }

            const response = await api.get('/api/documents');
            console.log('Documents fetched successfully:', response.data);
            setDocuments(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching documents:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access, checking token validity');
                // Verifica se il token è ancora valido
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                } else {
                    console.log('Token exists but request failed, retrying...');
                    // Prova a ricaricare i documenti
                    fetchDocuments();
                }
            } else {
                setError(error.response?.data?.message || 'Errore nel caricamento dei documenti');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user) {
            fetchDocuments();
        } else {
            console.log('No token or user available, redirecting to login');
            navigate('/login');
        }
    }, [token, user, navigate]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/documents/${id}`);
            setDocuments(documents.filter(doc => doc._id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access during delete, checking token validity');
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                }
            } else {
                setError(error.response?.data?.message || 'Errore nella cancellazione del documento');
            }
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', 'Documento caricato');
        formData.append('category', 'Altro');

        try {
            const response = await api.post('/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDocuments([response.data, ...documents]);
            setError(null);
        } catch (error) {
            console.error('Error uploading document:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access during upload, checking token validity');
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                }
            } else {
                setError(error.response?.data?.message || 'Errore nel caricamento del documento');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                I Miei Documenti
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 3 }}>
                <input
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                    <Button
                        variant="contained"
                        component="span"
                        startIcon={<UploadIcon />}
                    >
                        Carica Documento
                    </Button>
                </label>
            </Box>

            <Grid container spacing={3}>
                {documents.map((doc) => (
                    <Grid item xs={12} sm={6} md={4} key={doc._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {doc.name}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {new Date(doc.uploadDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    {doc.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton
                                    onClick={() => handleDelete(doc._id)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Documents; 