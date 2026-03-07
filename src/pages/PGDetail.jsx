import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Wind, Shield, Monitor as MonitorPlay, CheckCircle2, ArrowLeft } from 'lucide-react';

const PGDetail = () => {
    const { id } = useParams();
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [bookingData, setBookingData] = useState({ name: '', phone: '', moveInDate: '' });

    // Mock data for the specific PG based on ID or fallback
    const pg = {
        id: id || "1",
        name: "Sunrise Premium Hostel",
        location: "Koramangala, Bangalore",
        price: "₹12,000/mo",
        rating: 4.8,
        reviews: 124,
        gender: "Boys",
        description: "Experience premium co-living with state-of-the-art facilities. Sunrise Premium Hostel offers a perfect blend of comfort, community, and convenience. Ideal for students and young professionals who want a hassle-free stay with top-tier amenities.",
        amenities: ["High-Speed WiFi", "3 Meals Included", "AC Rooms", "24/7 Security", "Washing Machine", "Power Backup", "Gym Access", "Lounge Area"],
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1e52ab0645?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ],
        rules: ["No smoking indoors", "Visitors allowed until 10 PM", "1 month notice period"]
    };

    const handleBook = (e) => {
        e.preventDefault();
        // Simulate booking API call
        setTimeout(() => setIsBookingSuccess(true), 1000);
    };

    return (
        <div className="container py-8 animate-fade-in">
            <Link to="/listings" className="text-muted flex items-center gap-1 mb-6 hover:text-white transition-colors" style={{ textDecoration: 'none', width: 'fit-content' }}>
                <ArrowLeft size={18} /> Back to Listings
            </Link>

            {/* Header section */}
            <div className="flex justify-between items-start" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-4xl" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{pg.name}</h1>
                    <div className="flex gap-4 items-center flex-wrap">
                        <span className="flex items-center gap-1 text-muted"><MapPin size={18} /> {pg.location}</span>
                        <span className="flex items-center gap-1" style={{ color: 'var(--secondary)', fontWeight: 600 }}><Star fill="currentColor" size={18} /> {pg.rating} ({pg.reviews} reviews)</span>
                        <span style={{ background: 'var(--bg-glass)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>{pg.gender}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl text-gradient" style={{ fontWeight: 800 }}>{pg.price}</div>
                    <div className="text-muted">per month</div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gridTemplateRows: '200px 200px', marginBottom: '3rem' }}>
                <div style={{ gridRow: 'span 2', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={pg.images[0]} alt="PG Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={pg.images[1]} alt="PG Secondary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={pg.images[2]} alt="PG Tertiary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            {/* Details & Booking Layout */}
            <div className="grid gap-8" style={{ gridTemplateColumns: '1fr', '@media (min-width: 992px)': { gridTemplateColumns: '2fr 1fr' } }} id="details-layout">

                {/* Responsive CSS applied to an ID for layout change */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @media (min-width: 992px) {
            #details-layout { grid-template-columns: 2fr 1fr !important; }
          }
        `}} />

                {/* Left Column: Info */}
                <div className="flex-col gap-8 flex">
                    <section>
                        <h2 className="text-2xl" style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>About this place</h2>
                        <p className="text-muted" style={{ lineHeight: 1.6 }}>{pg.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl" style={{ fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>What this place offers</h2>
                        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                            {pg.amenities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div style={{ background: 'var(--bg-glass)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                        <CheckCircle2 className="text-accent" size={20} />
                                    </div>
                                    <span style={{ fontSize: '1.1rem' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl" style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>House Rules</h2>
                        <ul className="text-muted flex-col gap-2 flex" style={{ listStylePosition: 'inside' }}>
                            {pg.rules.map((rule, idx) => (
                                <li key={idx} style={{ fontSize: '1.05rem' }}>{rule}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Right Column: Booking Widget */}
                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 className="text-2xl" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Book a Room</h3>
                        <p className="text-muted mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Reserve your spot today.</p>

                        {!isBookingSuccess ? (
                            <form onSubmit={handleBook} className="flex-col gap-4 flex mt-4">
                                <div className="input-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="John Doe"
                                        required
                                        value={bookingData.name}
                                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        placeholder="+91 98765 43210"
                                        required
                                        value={bookingData.phone}
                                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Expected Move-in Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        required
                                        value={bookingData.moveInDate}
                                        onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-full mt-4" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                                    Request to Book
                                </button>
                                <div className="text-center text-muted text-sm mt-2">You won't be charged yet.</div>
                            </form>
                        ) : (
                            <div className="text-center py-8 animate-fade-in flex-col items-center flex gap-4">
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                    <CheckCircle2 size={40} className="text-accent" />
                                </div>
                                <h3 className="text-2xl text-gradient-accent" style={{ fontWeight: 700 }}>Booking Requested!</h3>
                                <p className="text-muted">
                                    Thanks for choosing {pg.name}. The owner will contact you shortly at {bookingData.phone}.
                                </p>
                                <button onClick={() => setIsBookingSuccess(false)} className="btn btn-outline mt-4">
                                    Book Another Spot
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PGDetail;
