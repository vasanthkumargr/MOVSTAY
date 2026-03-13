import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    LinearProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import HotelIcon from '@mui/icons-material/Hotel';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import api from '../services/api';

const OwnerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/owner-stats');
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError('Failed to load dashboard statistics.');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    const statCards = [
        { title: 'Total PGs', value: stats.totalPgs, icon: <HomeIcon fontSize="large" color="primary" />, color: '#e3f2fd' },
        { title: 'Total Rooms', value: stats.totalRooms, icon: <BedroomParentIcon fontSize="large" color="secondary" />, color: '#f3e5f5' },
        { title: 'Available Beds', value: stats.availableBeds, icon: <HotelIcon fontSize="large" color="success" />, color: '#e8f5e9' },
        { title: 'Visit Requests', value: stats.visitRequests, icon: <ContactPageIcon fontSize="large" color="warning" />, color: '#fff3e0' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Owner Dashboard
            </Typography>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: stat.color,
                            boxShadow: 3,
                            borderRadius: 3,
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                <Typography variant="h3" fontWeight="bold" color="text.primary">
                                    {stat.value}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Occupancy Rate Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Overall Occupancy Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Number(stats.occupancyRate)}
                            sx={{ height: 12, borderRadius: 6 }}
                            color={stats.occupancyRate > 80 ? 'success' : stats.occupancyRate > 50 ? 'warning' : 'error'}
                        />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${stats.occupancyRate}%`}</Typography>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
                            Recent Activity
                        </Typography>
                        {stats.recentActivity.length > 0 ? (
                            <List>
                                {stats.recentActivity.map((activity, index) => (
                                    <React.Fragment key={activity.id || index}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={String(activity.description)}
                                                secondary={new Date(activity.date).toLocaleDateString()}
                                                primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                            />
                                        </ListItem>
                                        {index < stats.recentActivity.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No recent activity found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Listings */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
                            Recent Listings Added
                        </Typography>
                        {stats.recentListings.length > 0 ? (
                            <List>
                                {stats.recentListings.map((listing, index) => (
                                    <React.Fragment key={listing._id}>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={listing.pgName}
                                                secondary={`Location: ${listing.location} | Rent: ₹${listing.rent}`}
                                                primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                                            />
                                        </ListItem>
                                        {index < stats.recentListings.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No recent listings to display.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OwnerDashboard;
