import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            
            if (!token) {
                setStatus('error');
                setMessage('Token di verifica mancante');
                return;
            }

            try {
                await axios.get(`/api/users/verify-email/${token}`);
                setStatus('success');
                setMessage('Email verificata con successo!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Errore durante la verifica dell\'email');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {status === 'verifying' && (
                    <>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Verifica dell'email in corso...
                        </Typography>
                    </>
                )}

                {status === 'success' && (
                    <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                        {message}
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default VerifyEmail; 