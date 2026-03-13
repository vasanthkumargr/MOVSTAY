import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Grid,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditPgPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        pgName: '',
        address: '',
        location: '',
        rent: '',
        genderPreference: '',
        description: '',
        images: '',
        isActive: true
    });

    const [amenities, setAmenities] = useState({
        wifi: false,
        food: false,
        laundry: false,
        parking: false,
        powerBackup: false,
        cctv: false,
        gym: false,
        studyRoom: false
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPgData = async () => {
            try {
                const response = await api.get(`/pg/${id}`);
                const data = response.data;

                setFormData({
                    pgName: data.pgName || '',
                    address: data.address || '',
                    location: data.location || '',
                    rent: data.rent || '',
                    genderPreference: data.genderPreference || '',
                    description: data.description || '',
                    // We keep existing images in state to merge later
                    existingImages: data.images || [],
                    isActive: data.isActive !== undefined ? data.isActive : true
                });

                if (data.amenities) {
                    setAmenities({
                        wifi: !!data.amenities.wifi,
                        food: !!data.amenities.food,
                        laundry: !!data.amenities.laundry,
                        parking: !!data.amenities.parking,
                        powerBackup: !!data.amenities.powerBackup,
                        cctv: !!data.amenities.cctv,
                        gym: !!data.amenities.gym,
                        studyRoom: !!data.amenities.studyRoom
                    });
                }
            } catch (err) {
                console.error("Failed to fetch PG data", err);
                setError('Failed to load PG listing data.');
            } finally {
                setLoadingData(false);
            }
        };

        fetchPgData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAmenityChange = (event) => {
        setAmenities({
            ...amenities,
            [event.target.name]: event.target.checked,
        });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError('');

        try {
            let uploadedImageUrls = [];

            // 1. Upload New Images to Cloudinary via Backend
            if (selectedFiles.length > 0) {
                const imageFormData = new FormData();
                selectedFiles.forEach(file => {
                    imageFormData.append('images', file);
                });

                const uploadResponse = await api.post('/upload', imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                uploadedImageUrls = uploadResponse.data.imageUrls;
            }

            // Merge existing URLs with newly uploaded URLs
            const finalImages = [...(formData.existingImages || []), ...uploadedImageUrls];

            const submitData = {
                ...formData,
                rent: Number(formData.rent),
                amenities: amenities,
                images: finalImages
            };

            await api.put(`/pg/${id}`, submitData);
            navigate('/owner/manage-pgs');
        } catch (err) {
            console.error("Failed to update PG", err);
            setError(err.response?.data?.message || 'Failed to update PG listing. Please try again.');
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Edit PG Listing
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="PG Name"
                                name="pgName"
                                value={formData.pgName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Location (Area/City)"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Monthly Rent (Base)"
                                name="rent"
                                type="number"
                                value={formData.rent}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Gender Preference</InputLabel>
                                <Select
                                    name="genderPreference"
                                    value={formData.genderPreference}
                                    label="Gender Preference"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Boys">Boys</MenuItem>
                                    <MenuItem value="Girls">Girls</MenuItem>
                                    <MenuItem value="Co-ed">Co-ed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                                Amenities
                            </Typography>
                            <FormGroup row>
                                {Object.keys(amenities).map((amenityKey) => (
                                    <FormControlLabel
                                        key={amenityKey}
                                        control={
                                            <Checkbox
                                                checked={amenities[amenityKey]}
                                                onChange={handleAmenityChange}
                                                name={amenityKey}
                                            />
                                        }
                                        label={amenityKey.charAt(0).toUpperCase() + amenityKey.slice(1).replace(/([A-Z])/g, ' $1')}
                                    />
                                ))}
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Upload Additional Images (Will be added to existing ones)
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            >
                                {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "Choose Files..."}
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                        color="primary"
                                    />
                                }
                                label="Active Status (Visible to users)"
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/owner/manage-pgs')}
                                disabled={loadingSubmit}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loadingSubmit}
                            >
                                {loadingSubmit ? 'Updating...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default EditPgPage;
