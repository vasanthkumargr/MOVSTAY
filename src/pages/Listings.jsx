import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import PGCard from '../components/PGCard';

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const mockPGs = [
        {
            id: "1",
            name: "Sunrise Premium Hostel",
            location: "Koramangala, Bangalore",
            price: "₹12,000/mo",
            rating: 4.8,
            gender: "Boys",
            amenities: ["WiFi", "Food", "AC", "Laundry"],
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "2",
            name: "Urban Nest PG",
            location: "HSR Layout, Bangalore",
            price: "₹15,000/mo",
            rating: 4.6,
            gender: "Girls",
            amenities: ["WiFi", "AC", "Security"],
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "3",
            name: "The Co-Living Space",
            location: "Indiranagar, Bangalore",
            price: "₹18,000/mo",
            rating: 4.9,
            gender: "Co-ed",
            amenities: ["WiFi", "Food", "AC", "Security", "Gym"],
            image: "https://images.unsplash.com/photo-1502672260266-1c1e52ab0645?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "4",
            name: "Cozy Stay PG",
            location: "BTM Layout, Bangalore",
            price: "₹9,000/mo",
            rating: 4.2,
            gender: "Boys",
            amenities: ["WiFi", "Food"],
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "5",
            name: "Elite Girls Hostel",
            location: "Koramangala, Bangalore",
            price: "₹14,500/mo",
            rating: 4.7,
            gender: "Girls",
            amenities: ["WiFi", "Food", "Security", "Laundry"],
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
    ];

    const filteredPGs = mockPGs.filter(pg =>
        pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pg.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    {filteredPGs.length > 0 ? (
                        filteredPGs.map(pg => <PGCard key={pg.id} pg={pg} />)
                    ) : (
                        <div className="col-span-full py-16 text-center text-muted">
                            <h3 className="text-2xl mb-2">No results found</h3>
                            <p>Try adjusting your search criteria or explore other locations.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Listings;
