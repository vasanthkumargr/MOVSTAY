import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const Requirements = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="container py-16 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl" style={{ fontWeight: 800, marginBottom: '1rem' }}>Tell us what you <span className="text-gradient">Need</span></h1>
                <p className="text-xl text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Can't find the perfect place? Submit your specific requirements and our team will find the ideal match for you.
                </p>
            </div>

            <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="grid gap-6">

                        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Full Name *</label>
                                <input type="text" className="input" placeholder="Enter your full name" required />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Phone Number *</label>
                                <input type="tel" className="input" placeholder="Enter your phone number" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Preferred Location *</label>
                                <input type="text" className="input" placeholder="e.g. Indiranagar, Bangalore" required />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Max Monthly Budget (₹) *</label>
                                <input type="number" className="input" placeholder="e.g. 15000" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Accommodation Type</label>
                                <select className="input" style={{ appearance: 'none' }}>
                                    <option value="pg">PG / Paying Guest</option>
                                    <option value="hostel">Hostel</option>
                                    <option value="colive">Co-Living Space</option>
                                    <option value="flat">Independent Flat</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Occupancy</label>
                                <select className="input" style={{ appearance: 'none' }}>
                                    <option value="single">Single Room</option>
                                    <option value="double">Double Sharing</option>
                                    <option value="triple">Triple Sharing</option>
                                    <option value="any">Any</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Additional Requirements / Amenities</label>
                            <textarea
                                className="input"
                                rows="4"
                                placeholder="E.g., I need a place with high-speed WiFi, attached bathroom, and home-cooked meals..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary mt-4 w-full" style={{ padding: '1rem', fontSize: '1.2rem', gap: '0.5rem' }}>
                            Submit Requirements <Send size={20} />
                        </button>
                        <p className="text-center text-muted text-sm mt-2">
                            We take your privacy seriously. Your data is secure with us.
                        </p>
                    </form>
                ) : (
                    <div className="text-center py-8 animate-fade-in flex-col items-center flex gap-6">
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <CheckCircle2 size={50} className="text-primary" />
                        </div>
                        <h2 className="text-4xl text-gradient" style={{ fontWeight: 800 }}>Requirements Received!</h2>
                        <p className="text-xl text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            Thank you for sharing your needs. Our team is actively searching for the best matches and will contact you within 24 hours.
                        </p>
                        <button onClick={() => setIsSubmitted(false)} className="btn btn-outline mt-4">
                            Submit Another Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requirements;
