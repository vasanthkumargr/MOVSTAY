import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, TextField, Button, Grid, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';

export default function AvailabilityUpdatesPage() {
    const [availabilities, setAvailabilities] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [editingAvailability, setEditingAvailability] = useState(null);
    const [actionDialog, setActionDialog] = useState(false);
    const [formData, setFormData] = useState({ roomId: '', availableBeds: '', status: 'Available' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        try {
            const [availRes, roomsRes] = await Promise.all([
                api.get('/availability'),
                api.get('/rooms')
            ]);

            // Format availabilities for DataGrid
            const formattedData = availRes.data.map(item => ({
                id: item._id,
                roomId: item.roomId?._id,
                pgName: item.roomId?.pgId?.pgName || 'Unknown PG',
                roomType: item.roomId?.roomType || 'Unknown Room',
                totalBeds: item.roomId?.totalBeds || 0,
                availableBeds: item.availableBeds,
                status: item.status,
                lastUpdatedOn: new Date(item.lastUpdatedOn).toLocaleString(),
                originalData: item
            }));

            setAvailabilities(formattedData);
            setRooms(roomsRes.data);
        } catch (err) {
            showSnackbar('Failed to fetch data', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEdit = (row) => {
        setEditingAvailability(row);
        setFormData({
            roomId: row.roomId,
            availableBeds: row.availableBeds,
            status: row.status
        });
        setActionDialog(true);
    };

    const handleNew = () => {
        setEditingAvailability(null);
        setFormData({ roomId: '', availableBeds: '', status: 'Available' });
        setActionDialog(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const confirmAction = async () => {
        if (!formData.roomId || formData.availableBeds === '' || !formData.status) {
            showSnackbar('Please fill all required fields', 'warning');
            return;
        }

        try {
            await api.put(`/availability/${formData.roomId}`, formData);
            showSnackbar('Availability updated successfully!');
            fetchData();
        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Failed to update availability', 'error');
        } finally {
            setActionDialog(false);
        }
    };

    // Derived filtered rows based on search text 
    const filteredRows = availabilities.filter(row => {
        if (!searchText) return true;
        const searchLower = searchText.toLowerCase();
        return (
            row.pgName.toLowerCase().includes(searchLower) ||
            row.roomType.toLowerCase().includes(searchLower) ||
            row.status.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        { field: 'pgName', headerName: 'PG Name', width: 200 },
        { field: 'roomType', headerName: 'Room Type', width: 150 },
        { field: 'totalBeds', headerName: 'Total Beds', width: 100, type: 'number' },
        { field: 'availableBeds', headerName: 'Available Beds', width: 130, type: 'number' },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'lastUpdatedOn', headerName: 'Last Updated', width: 180 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />
            ],
        },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Availability Updates
                </Typography>
                <Button variant="contained" color="primary" onClick={handleNew} sx={{ borderRadius: 2 }}>
                    Update Availability
                </Button>
            </Box>

            <Card>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #f1f5f9">
                    <Typography variant="h6" fontWeight={600}>Current Room Availabilities</Typography>
                    <TextField
                        size="small"
                        label="Search Name, Room or Status"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Box>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ height: 400, width: '100%', '& .MuiDataGrid-root': { border: 'none' }, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc' } }}>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            pageSizeOptions={[5, 10, 20]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5 } },
                            }}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Insert/Update Dialog */}
            <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingAvailability ? 'Edit Availability' : 'Update Room Availability'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    label="Select Room"
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleChange}
                                    disabled={!!editingAvailability}
                                >
                                    {rooms.map(room => (
                                        <MenuItem key={room._id} value={room._id}>
                                            {room.pgId?.pgName || 'Unknown PG'} - {room.roomType} (Sharing: {room.sharingCapacity})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Available Beds"
                                    name="availableBeds"
                                    type="number"
                                    value={formData.availableBeds}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Limited">Limited</MenuItem>
                                    <MenuItem value="Full">Full</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialog(false)}>Cancel</Button>
                    <Button onClick={confirmAction} color="primary" variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
