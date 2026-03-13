import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Wallet, Home, CalendarCheck, TrendingUp, User } from 'lucide-react';
import PGCard from '../components/PGCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [pgs, setPGs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // Don't fetch if not logged in

        const fetchPGs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/hostels');
                const data = await res.json();
                setPGs(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch PGs:", err);
                setLoading(false);
            }
        };
        fetchPGs();
    }, [user]);

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold">{value}</div>
                </div>
                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <Icon className="text-primary" size={24} />
                </div>
            </div>
            {trend && (
                <div className="text-sm">
                    <span className="text-accent flex items-center gap-1 font-medium">
                        <TrendingUp size={14} /> {trend}
                    </span>
                    <span className="text-muted ml-2">vs last month</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="container py-8 animate-fade-in">
            <div className="mb-8 p-6 glass-panel flex items-center gap-4">
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
                    <User size={32} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl" style={{ fontWeight: 800, marginBottom: '0.25rem' }}>
                        Welcome to your <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-muted">Logged in as {user.email}</p>
                </div>
            </div>

            {/* Stats Grid - Using real count of DB items as placeholder stats */}
            <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <StatCard title="Active Bookings" value="0" icon={Home} />
                <StatCard title="Total Available Properties" value={loading ? "..." : pgs.length} icon={CalendarCheck} />
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 className="text-2xl mb-6" style={{ fontWeight: 700 }}>Recommended from Database</h2>
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {loading ? (
                        <div className="col-span-full py-16 text-center text-muted">Loading database records...</div>
                    ) : (
                        pgs.length > 0 ? (
                            pgs.slice(0, 3).map(pg => <PGCard key={pg._id} pg={pg} />)
                        ) : (
                            <div className="col-span-full text-center text-muted">No properties found in database.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
