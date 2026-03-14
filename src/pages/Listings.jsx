import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import PGCard from '../components/PGCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pgs, setPGs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await fetch(`${API_BASE}/hostels`);
                const data = await res.json();
                setPGs(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch PGs:", err);
                setLoading(false);
            }
        };
        fetchPGs();
    }, []);

    const filteredPGs = pgs.filter(pg => {
        const nameMatch = pg.name ? pg.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const locationMatch = pg.location ? pg.location.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        return nameMatch || locationMatch;
    });

    return (
        <div className="animate-fade-in py-8">
            {/* Search Header */}
            <div className="glass-panel" style={{ padding: '2rem', margin: '0 2rem 2rem 2rem', borderLeft: '4px solid var(--primary)' }}>
                <h1 className="text-3xl" style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Find Your Next Stay</h1>

                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0 1rem', border: '1px solid var(--border-glass)' }}>
                        <Search size={20} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', padding: '1rem', color: 'white', outline: 'none' }}
                        />
                    </div>

                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>

                {/* Results Counter */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl" style={{ fontWeight: 600 }}>Showing {filteredPGs.length} Results</h2>
                    <select className="glass-panel" style={{ padding: '0.5rem 1rem', color: 'white', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', outline: 'none' }}>
                        <option value="recommended">Recommended</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {/* Listings Grid */}
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {loading ? (
                        <div className="col-span-full py-16 text-center text-muted">Loading spaces...</div>
                    ) : (
                        filteredPGs.length > 0 ? (
                            filteredPGs.map(pg => <PGCard key={pg._id} pg={pg} />)
                        ) : (
                            <div className="col-span-full py-16 text-center text-muted">
                                <h3 className="text-2xl mb-2">No results found</h3>
                                <p>Try adjusting your search criteria or explore other locations.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Listings;
