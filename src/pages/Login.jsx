import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_BASE}/auth/login-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();

            if (res.ok) {
                login(data.user);
                navigate('/');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div className="container py-24 flex justify-center items-center h-full">
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 className="text-3xl" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Welcome Back</h2>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Login to your MOVStay account</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Send OTP Let's Go
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0 1rem', border: '1px solid var(--border-glass)' }}>
                            <KeyRound size={18} className="text-muted" />
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ border: 'none', background: 'transparent', width: '100%', padding: '1rem', color: 'white', outline: 'none' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Verify & Login
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '2rem', fontSize: '0.875rem' }} className="text-muted">
                    Don't have an account? <Link to="/register" className="text-gradient hover:opacity-80" style={{ textDecoration: 'none', fontWeight: 600 }}>Sign up here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
