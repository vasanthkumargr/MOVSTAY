import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    return (
        <div className="container py-24 flex justify-center items-center h-full">
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 className="text-3xl" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Join MOVStay</h2>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Create your account to start booking</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                {success && <div style={{ color: '#10b981', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)' }}>{success}</div>}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0 1rem', border: '1px solid var(--border-glass)' }}>
                        <Mail size={18} className="text-muted" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', padding: '1rem', color: 'white', outline: 'none' }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0 1rem', border: '1px solid var(--border-glass)' }}>
                        <KeyRound size={18} className="text-muted" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', padding: '1rem', color: 'white', outline: 'none' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.875rem' }} className="text-muted">
                    Already have an account? <Link to="/login" className="text-gradient hover:opacity-80" style={{ textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
