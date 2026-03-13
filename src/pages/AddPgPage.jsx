import React, { useState } from 'react';
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
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddPgPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pgName: '',
        address: '',
        location: '',
        rent: '',
        genderPreference: '',
        description: '',
        images: '', // We'll take a comma separated string and convert to array
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        setLoading(true);
        setError('');

        try {
            let uploadedImageUrls = [];

            // 1. Upload Images to Cloudinary via Backend
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

            // 2. Prepare PG Data
            const submitData = {
                ...formData,
                rent: Number(formData.rent),
                amenities: amenities,
                images: uploadedImageUrls
            };

            // 3. Save PG Listing
            await api.post('/pg', submitData);
            navigate('/owner/manage-pgs');
        } catch (err) {
            console.error("Failed to add PG", err);
            setError(err.response?.data?.message || 'Failed to add PG listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Add New PG Listing
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
                                Upload Property Images (Multiple allowed)
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

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add PG Listing'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddPgPage;
