import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, CssBaseline, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PieChartIcon from '@mui/icons-material/PieChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
    { text: 'Add PG', icon: <AddBoxIcon />, path: '/owner/add-pg' },
    { text: 'Manage PGs', icon: <ManageAccountsIcon />, path: '/owner/manage-pgs' },
    { text: 'Room Details', icon: <BedroomParentIcon />, path: '/owner/rooms' },
    { text: 'Availability Updates', icon: <EventAvailableIcon />, path: '/owner/availability' },
    { text: 'Visualizations', icon: <PieChartIcon />, path: '/owner/visualizations' },
];

export default function OwnerLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1a1a2e', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                <Toolbar>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/owner/dashboard')}
                    >
                        <Box sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            width: 36, height: 36, borderRadius: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 'bold', fontSize: '1rem'
                        }}>
                            MS
                        </Box>
                        <Box sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                            MOVStay Owner
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <List sx={{ flexGrow: 1 }}>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    mx: 1, mb: 0.5, borderRadius: 2,
                                    backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
                                    color: location.pathname === item.path ? '#fff' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: location.pathname === item.path ? 'primary.main' : 'action.hover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: location.pathname === item.path ? '#fff' : 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 400 }} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem
                            button
                            onClick={handleLogout}
                            sx={{
                                mx: 1, mb: 1, borderRadius: 2,
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: '#fff',
                                    '& .MuiListItemIcon-root': { color: '#fff' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'error.main' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
