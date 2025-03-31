import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = ({ width = '150', height = '40' }) => {
    return (
        <Box 
            component={Link}
            to="/"
            sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none'
            }}
        >
            <img 
                src="/images/logo.png" 
                alt="" 
                style={{ 
                    height: '32px',
                    width: 'auto'
                }} 
            />
            <Typography
                variant="h6"
                sx={{
                    color: '#fff',
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'block' }
                }}
            >
                EdilConnect
            </Typography>
        </Box>
    );
};

export default Logo; 