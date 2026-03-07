import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-glass)',
            padding: '3rem 0',
            marginTop: 'auto',
            background: 'rgba(0,0,0,0.2)'
        }}>
            <div className="container grid gap-8" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
                <div className="text-center">
                    <h2 className="text-xl text-gradient" style={{ marginBottom: '1rem' }}>NextStay</h2>
                    <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        Find the perfect PG or hostel with premium aesthetics and dynamic discovery.
                    </p>
                    <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        © 2026 NextStay Platforms. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
