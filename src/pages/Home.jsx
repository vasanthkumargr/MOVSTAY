import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/listings');
    };

    const [featuredPGs, setFeaturedPGs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/hostels');
                const data = await res.json();
                // Just take first 3 for featured on home
                setFeaturedPGs(data.slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch PGs:", err);
                setLoading(false);
            }
        };
        fetchPGs();
    }, []);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="container py-24 text-center">
                <h1 className="text-5xl" style={{ marginBottom: '1.5rem', fontWeight: 800 }}>
                    Find Your Perfect <span className="text-gradient">Stay</span>
                </h1>
                <p className="text-xl text-muted" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                    Discover premium PGs, hostels, and co-living spaces tailored to your comfort and budget.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="glass-panel" style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0 1rem' }}>
                        <MapPin size={20} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Enter location (e.g. Koramangala)"
                            style={{ border: 'none', background: 'transparent', width: '100%', padding: '1rem', color: 'white', outline: 'none' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, height: '100%', padding: '1rem 2rem' }}>
                        <Search size={20} style={{ marginRight: '0.5rem' }} /> Search
                    </button>
                </form>
            </section>

            {/* Featured PGs Section */}
            <section className="container py-16">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl" style={{ fontWeight: 700 }}>Featured Spaces</h2>
                    <Link to="/listings" className="text-gradient flex items-center gap-1" style={{ textDecoration: 'none', fontWeight: 600 }}>
                        View All <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '3rem' }}>
                    {loading ? (
                        <div className="col-span-full py-16 text-center text-muted">Loading featured spaces...</div>
                    ) : (
                        featuredPGs.map(pg => (
                            <Link to={`/pg/${pg._id}`} key={pg._id} style={{ textDecoration: 'none' }}>
                                <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ position: 'relative', height: '200px' }}>
                                        <img src={pg.image} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Star size={14} color="var(--secondary)" fill="var(--secondary)" />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{pg.rating}</span>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 className="text-xl" style={{ marginBottom: '0.5rem', color: 'white' }}>{pg.name}</h3>
                                        <div className="flex items-center gap-1 text-muted text-sm" style={{ marginBottom: '1rem' }}>
                                            <MapPin size={14} /> {pg.location}
                                        </div>
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{pg.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-24 mb-4">
                <div className="glass-panel text-center" style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' }}>
                    <h2 className="text-4xl" style={{ marginBottom: '1rem', fontWeight: 700 }}>Can't find what you're looking for?</h2>
                    <p className="text-lg text-muted" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Tell us your specific requirements and we will find the perfect place that matches your exact needs.
                    </p>
                    <Link to="/requirements" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        Submit Requirements
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
