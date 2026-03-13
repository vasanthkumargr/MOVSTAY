import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Grid, MenuItem,
    Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, Switch, Snackbar, Alert, Autocomplete
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';

export default function RoomDetailsPage() {
    const [rooms, setRooms] = useState([]);
    const [pgOptions, setPgOptions] = useState([]);
    const [formData, setFormData] = useState({
        pgId: null, roomType: '', sharingCapacity: '',
        roomRent: '', acAvailable: false, totalBeds: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
    const [actionDialog, setActionDialog] = useState({ open: false, type: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        try {
            const [roomsRes, pgsRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/pg')
            ]);
            setRooms(roomsRes.data.map(item => ({ ...item, id: item._id })));
            setPgOptions(pgsRes.data);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.pgId || !formData.roomType || !formData.sharingCapacity || !formData.roomRent || !formData.totalBeds) {
            showSnackbar('Please fill all required fields', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setActionDialog({ open: true, type: editingId ? 'Update' : 'Insert' });
    };

    const confirmAction = async () => {
        try {
            const payload = {
                ...formData,
                pgId: formData.pgId._id // Extract ObjectId
            };

            if (editingId) {
                await api.put(`/rooms/${editingId}`, payload);
                showSnackbar('Room details updated successfully!');
            } else {
                await api.post('/rooms', payload);
                showSnackbar('Room added successfully!');
            }
            resetForm();
            fetchData();
        } catch (err) {
            showSnackbar('Validation failed or server error', 'error');
        } finally {
            setActionDialog({ open: false, type: '' });
        }
    };

    const handleEdit = (row) => {
        setFormData({
            pgId: row.pgId, // Whole object for Autocomplete
            roomType: row.roomType,
            sharingCapacity: row.sharingCapacity,
            roomRent: row.roomRent,
            acAvailable: row.acAvailable,
            totalBeds: row.totalBeds
        });
        setEditingId(row.id);
    };

    const handleDeleteClick = (id) => {
        setConfirmDialog({ open: true, id });
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/rooms/${confirmDialog.id}`);
            showSnackbar('Room deleted successfully!');
            fetchData();
        } catch (err) {
            showSnackbar('Failed to delete room', 'error');
        } finally {
            setConfirmDialog({ open: false, id: null });
        }
    };

    const resetForm = () => {
        setFormData({
            pgId: null, roomType: '', sharingCapacity: '',
            roomRent: '', acAvailable: false, totalBeds: ''
        });
        setEditingId(null);
    };

    const handleSearch = async () => {
        if (!searchText) return fetchData();
        try {
            const { data } = await api.get(`/rooms/search/${searchText}`);
            setRooms(data.map(item => ({ ...item, id: item._id })));
        } catch (err) {
            showSnackbar('No rooms found', 'warning');
            setRooms([]);
        }
    };

    const columns = [
        { field: 'pgName', headerName: 'Parent PG', width: 200, valueGetter: (value, row) => row?.pgId?.pgName || 'Unknown' },
        { field: 'roomType', headerName: 'Room Type', width: 150 },
        { field: 'sharingCapacity', headerName: 'Sharing Cap.', width: 120, type: 'number' },
        { field: 'totalBeds', headerName: 'Total Beds', width: 100, type: 'number' },
        { field: 'roomRent', headerName: 'Rent (₹)', width: 120, type: 'number' },
        { field: 'acAvailable', headerName: 'AC', width: 100, type: 'boolean' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(params.id)} />,
            ],
        },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
                Room Configuration
            </Typography>

            <Card sx={{ mb: 4, overflow: 'visible' }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Typography variant="h6">
                        {editingId ? 'Update Room Details' : 'Add New Room'}
                    </Typography>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    options={pgOptions}
                                    getOptionLabel={(option) => option.pgName || ''}
                                    value={formData.pgId}
                                    onChange={(e, newValue) => setFormData({ ...formData, pgId: newValue })}
                                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                                    renderInput={(params) => <TextField {...params} label="Select Parent PG Listing" required />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required fullWidth select label="Room Type" name="roomType"
                                    value={formData.roomType} onChange={handleChange}
                                >
                                    <MenuItem value="Single">Single</MenuItem>
                                    <MenuItem value="Double">Double</MenuItem>
                                    <MenuItem value="Triple">Triple</MenuItem>
                                    <MenuItem value="Dormitory">Dormitory</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    required fullWidth label="Sharing Capacity" name="sharingCapacity"
                                    type="number" value={formData.sharingCapacity} onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    required fullWidth label="Total Beds" name="totalBeds"
                                    type="number" value={formData.totalBeds} onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    required fullWidth label="Room Rent" name="roomRent"
                                    type="number" value={formData.roomRent} onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={formData.acAvailable} onChange={handleChange} name="acAvailable" />
                                    }
                                    label="AC Available"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} display="flex" gap={2}>
                                <Button type="submit" variant="contained" color={editingId ? "warning" : "primary"}>
                                    {editingId ? 'Update Room' : 'Insert Room'}
                                </Button>
                                {editingId && (
                                    <Button variant="outlined" onClick={resetForm}>Cancel</Button>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #f1f5f9">
                    <Typography variant="h6" fontWeight={600}>All Rooms</Typography>
                    <Box display="flex" gap={1}>
                        <TextField
                            size="small" label="Search by ID, Room Type, or Details"
                            value={searchText} onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button variant="outlined" onClick={handleSearch}>Search</Button>
                        <Button variant="text" onClick={() => { setSearchText(''); fetchData(); }}>Clear</Button>
                    </Box>
                </Box>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ height: 400, width: '100%', '& .MuiDataGrid-root': { border: 'none' }, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc' } }}>
                        <DataGrid
                            rows={rooms}
                            columns={columns}
                            pageSizeOptions={[5, 10, 20]}
                            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Confirmation Dialogs */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete this Room? This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, id: null })}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '' })}>
                <DialogTitle>Confirm {actionDialog.type}</DialogTitle>
                <DialogContent>Are you sure you want to {actionDialog.type.toLowerCase()} this Room?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialog({ open: false, type: '' })}>Cancel</Button>
                    <Button onClick={confirmAction} color="primary" variant="contained">OK</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
