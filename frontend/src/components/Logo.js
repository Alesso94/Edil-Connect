import React from 'react';
import { Typography, Box } from '@mui/material';

const Logo = ({ width = '150', height = '40' }) => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: width,
                height: height
            }}
        >
            <Typography
                variant="h5"
                component="span"
                sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                EdilConnect
            </Typography>
        </Box>
    );
};

export default Logo; 