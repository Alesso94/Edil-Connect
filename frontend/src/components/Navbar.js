import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import '../styles/UserButton.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();

    const hiddenPaths = ['/dashboard'];

    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    const getInitials = () => {
        if (user?.name) {
            return user.name.charAt(0).toUpperCase();
        } else if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return '';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    EdilConnect
                </Typography>

                {user ? (
                    <>
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            className="user-button"
                            aria-label="menu utente"
                        >
                            <Avatar className="avatar">
                                {getInitials()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem component={RouterLink} to="/dashboard">Dashboard</MenuItem>
                            <MenuItem component={RouterLink} to="/documents">Documenti</MenuItem>
                            <MenuItem component={RouterLink} to="/projects">Progetti</MenuItem>
                            <MenuItem component={RouterLink} to="/profile">Profilo</MenuItem>
                            <MenuItem component={RouterLink} to="/subscription">Piani Tariffari</MenuItem>
                            {(user.role === 'admin' || user.isAdmin) && (
                                <MenuItem component={RouterLink} to="/admin">
                                    Pannello Admin
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    isMobile ? (
                        <>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component={RouterLink} to="/login">Accedi</MenuItem>
                                <MenuItem component={RouterLink} to="/register">Registrati</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component={RouterLink} to="/login">Accedi</MenuItem>
                                <MenuItem component={RouterLink} to="/register">Registrati</MenuItem>
                            </Menu>
                        </>
                    )
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 