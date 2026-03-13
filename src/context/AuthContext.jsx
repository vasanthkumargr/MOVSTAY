import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Convenience hook used by student-side components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Failed to parse user from local storage');
            }
        }
        setLoading(false);
    }, []);

    /**
     * login(userData, token?)
     * - Student OTP login: pass only userData (no token)
     * - Owner JWT login:   pass both userData and token
     */
    const login = (userData, token = null) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
