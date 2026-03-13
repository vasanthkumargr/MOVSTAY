import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OwnerLayout from './components/OwnerLayout';
import OwnerProtectedRoute from './components/OwnerProtectedRoute';

// ── Student Pages ──────────────────────────────────────────────
import Home from './pages/Home';
import Listings from './pages/Listings';
import PGDetail from './pages/PGDetail';
import Requirements from './pages/Requirements';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// ── Owner Pages ────────────────────────────────────────────────
import OwnerLoginPage from './pages/OwnerLoginPage';
import OwnerRegisterPage from './pages/OwnerRegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AddPgPage from './pages/AddPgPage';
import ManagePgsPage from './pages/ManagePgsPage';
import EditPgPage from './pages/EditPgPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import AvailabilityUpdatesPage from './pages/AvailabilityUpdatesPage';
import VisualizationsPage from './pages/VisualizationsPage';

import { AuthProvider } from './context/AuthContext';

// Student routes have Navbar + Footer layout
const StudentLayout = () => {
    const location = useLocation();
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '2rem 1rem' }}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/pg/:id" element={<PGDetail />} />
                    <Route path="/requirements" element={<Requirements />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Owner Portal - MUI sidebar layout, JWT-protected */}
                    <Route path="/owner/login" element={<OwnerLoginPage />} />
                    <Route path="/owner/register" element={<OwnerRegisterPage />} />
                    <Route
                        path="/owner"
                        element={
                            <OwnerProtectedRoute>
                                <OwnerLayout />
                            </OwnerProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<OwnerDashboard />} />
                        <Route path="add-pg" element={<AddPgPage />} />
                        <Route path="manage-pgs" element={<ManagePgsPage />} />
                        <Route path="edit-pg/:id" element={<EditPgPage />} />
                        <Route path="rooms" element={<RoomDetailsPage />} />
                        <Route path="availability" element={<AvailabilityUpdatesPage />} />
                        <Route path="visualizations" element={<VisualizationsPage />} />
                    </Route>

                    {/* Student Portal - Navbar/Footer layout */}
                    <Route path="/*" element={<StudentLayout />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
