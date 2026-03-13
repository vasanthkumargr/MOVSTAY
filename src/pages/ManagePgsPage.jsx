import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ManagePgsPage = () => {
    const navigate = useNavigate();
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pgToDelete, setPgToDelete] = useState(null);

    const fetchPgs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pg');
            // DataGrid requires a unique 'id' property
            const formattedData = response.data.map(pg => ({ ...pg, id: pg._id }));
            setPgs(formattedData);
        } catch (error) {
            console.error('Error fetching PGs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPgs();
    }, []);

    const handleEditClick = (id) => {
        navigate(`/owner/edit-pg/${id}`);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await api.put(`/pg/${id}`, { isActive: !currentStatus });
            fetchPgs(); // Refresh list to get updated status
        } catch (error) {
            console.error('Failed to toggle active status', error);
        }
    };

    const confirmDelete = (id) => {
        setPgToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!pgToDelete) return;

        try {
            await api.delete(`/pg/${pgToDelete}`);
            setDeleteDialogOpen(false);
            setPgToDelete(null);
            fetchPgs(); // Refresh list after deletion
        } catch (error) {
            console.error('Failed to delete PG', error);
        }
    };

    const columns = [
        { field: 'pgName', headerName: 'PG Name', flex: 1, minWidth: 150 },
        { field: 'location', headerName: 'Location', flex: 1, minWidth: 150 },
        {
            field: 'rent',
            headerName: 'Base Rent',
            width: 120,
            renderCell: (params) => (
                <Typography sx={{ mt: 1.5 }}>
                    {params.row.rent ? `₹${params.row.rent}` : 'N/A'}
                </Typography>
            )
        },
        { field: 'genderPreference', headerName: 'Gender', width: 120 },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            type: 'boolean',
            renderCell: (params) => (
                <Typography color={params.value ? 'success.main' : 'error.main'} fontWeight="bold" sx={{ mt: 1.5 }}>
                    {params.value ? 'Active' : 'Inactive'}
                </Typography>
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<Tooltip title="Edit PG"><EditIcon color="primary" /></Tooltip>}
                    label="Edit"
                    onClick={() => handleEditClick(params.id)}
                />,
                <GridActionsCellItem
                    key="room"
                    icon={<Tooltip title="Add Room (Coming Soon)"><AddCircleIcon color="secondary" /></Tooltip>}
                    label="Add Room"
                // onClick={() => navigate(`/owner/add-room/${params.id}`)} // Future integration
                />,
                <GridActionsCellItem
                    key="toggle"
                    icon={
                        <Tooltip title={params.row.isActive ? "Deactivate PG" : "Activate PG"}>
                            {params.row.isActive ? <DoNotDisturbIcon color="warning" /> : <CheckCircleIcon color="success" />}
                        </Tooltip>
                    }
                    label="Toggle Status"
                    onClick={() => handleToggleStatus(params.id, params.row.isActive)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<Tooltip title="Delete PG"><DeleteIcon color="error" /></Tooltip>}
                    label="Delete"
                    onClick={() => confirmDelete(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ p: 3, pt: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Manage PG Listings
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => navigate('/owner/add-pg')}
                >
                    Add New Listing
                </Button>
            </Box>

            <Paper sx={{ height: '70vh', width: '100%', flexGrow: 1 }}>
                <DataGrid
                    rows={pgs}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' }
                    }}
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to completely delete this PG Listing? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManagePgsPage;
