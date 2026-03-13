import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function VisualizationsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        pgsByLocation: [],
        roomsByType: [],
        availabilityStatus: [],
        acVsNonAc: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch data from all three modules concurrently
                const [pgResponse, roomResponse, availabilityResponse] = await Promise.all([
                    api.get('/pg'),
                    api.get('/rooms'),
                    api.get('/availability')
                ]);

                const pgs = pgResponse.data;
                const rooms = roomResponse.data;
                const availability = availabilityResponse.data;

                // If the owner has no PGs, all lists should theoretically be empty or not renderable for charts
                if (!pgs.length) {
                    setData({
                        pgsByLocation: [],
                        roomsByType: [],
                        availabilityStatus: [],
                        acVsNonAc: []
                    });
                    setLoading(false);
                    return;
                }

                // Process PG Data: Count PGs by Location
                const locationCounts = pgs.reduce((acc, pg) => {
                    const loc = pg.location || 'Unknown';
                    acc[loc] = (acc[loc] || 0) + 1;
                    return acc;
                }, {});
                const pgsByLocation = Object.keys(locationCounts).map(loc => ({
                    name: loc,
                    count: locationCounts[loc]
                }));

                // Process Room Data: Count Rooms by Type and AC/Non-AC
                const typeCounts = rooms.reduce((acc, room) => {
                    acc[room.roomType] = (acc[room.roomType] || 0) + 1;
                    return acc;
                }, {});
                const roomsByType = Object.keys(typeCounts).map(type => ({
                    name: type,
                    count: typeCounts[type]
                }));

                const acCounts = rooms.reduce((acc, room) => {
                    const type = room.acAvailable ? 'AC' : 'Non-AC';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {});
                const acVsNonAc = Object.keys(acCounts).map(type => ({
                    name: type,
                    value: acCounts[type]
                }));

                // Process Availability Data: Count by Status
                const statusCounts = availability.reduce((acc, record) => {
                    acc[record.status] = (acc[record.status] || 0) + 1;
                    return acc;
                }, {});
                const availabilityStatus = Object.keys(statusCounts).map(status => ({
                    name: status,
                    value: statusCounts[status]
                }));

                setData({
                    pgsByLocation,
                    roomsByType,
                    availabilityStatus,
                    acVsNonAc
                });
                setError('');
            } catch (err) {
                console.error("Error fetching visualization data:", err);
                setError('Failed to load visualization data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const hasData = Object.values(data).some(arr => arr.length > 0);

    if (!hasData) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    No Data Available
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Add a PG listing and room details to view analytics.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 6, mt: 2, color: 'text.primary', textAlign: 'center' }}>
                System Visualizations & Analytics
            </Typography>
            <Grid container spacing={6}>

                {/* Chart 1: PGs by Location (Bar Chart) */}
                <Grid item xs={12}>
                    <Card sx={{ height: 500, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom align="left" color="primary.main" sx={{ mb: 3 }}>
                                PGs by Location
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                {data.pgsByLocation.length > 0 ? (
                                    <BarChart data={data.pgsByLocation}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#8884d8" name="Number of PGs" />
                                    </BarChart>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">Not enough data to display graph.</Typography>
                                    </Box>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Chart 2: Rooms by Type (Bar Chart) */}
                <Grid item xs={12}>
                    <Card sx={{ height: 500, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom align="left" color="primary.main" sx={{ mb: 3 }}>
                                Rooms by Type
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                {data.roomsByType.length > 0 ? (
                                    <BarChart data={data.roomsByType}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#82ca9d" name="Number of Rooms" />
                                    </BarChart>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">Not enough data to display graph.</Typography>
                                    </Box>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Chart 3: AC vs Non-AC Rooms (Pie Chart) */}
                <Grid item xs={12}>
                    <Card sx={{ height: 500, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom align="left" color="primary.main" sx={{ mb: 3 }}>
                                AC vs Non-AC Rooms
                            </Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                {data.acVsNonAc.length > 0 ? (
                                    <PieChart>
                                        <Pie
                                            data={data.acVsNonAc}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.acVsNonAc.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">Not enough data to display graph.</Typography>
                                    </Box>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Chart 4: Availability Status (Pie Chart) */}
                <Grid item xs={12}>
                    <Card sx={{ height: 500, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom align="left" color="primary.main" sx={{ mb: 3 }}>
                                Overall Availability Status
                            </Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                {data.availabilityStatus.length > 0 ? (
                                    <PieChart>
                                        <Pie
                                            data={data.availabilityStatus}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#82ca9d"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.availabilityStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">Not enough data to display graph.</Typography>
                                    </Box>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
}
