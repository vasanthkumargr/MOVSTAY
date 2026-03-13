import React from 'react';
import { MapPin, Star, Wifi, Coffee, Wind, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PGCard = ({ pg }) => {
    return (
        <Link to={`/pg/${pg._id}`} style={{ textDecoration: 'none' }}>
            <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                    <img src={pg.images && pg.images.length > 0 ? pg.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={14} color="var(--secondary)" fill="var(--secondary)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{pg.rating}</span>
                    </div>
                    {pg.gender && (
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--gradient-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                            {pg.gender}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                        <h3 className="text-xl" style={{ color: 'white', fontWeight: 700 }}>{pg.name}</h3>
                    </div>

                    <div className="flex items-center gap-1 text-muted text-sm" style={{ marginBottom: '1rem' }}>
                        <MapPin size={14} /> {pg.location}
                    </div>

                    <div className="flex gap-2" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {(pg.amenities || ["WiFi", "Water"]).map((amenity, index) => {
                            let Icon = Wifi;
                            if (amenity === 'Food') Icon = Coffee;
                            if (amenity === 'AC') Icon = Wind;
                            if (amenity === 'Security') Icon = Shield;

                            return (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Icon size={12} /> {amenity}
                                </div>
                            );
                        })}
                        {(pg.amenities || []).length > 3 && (
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                +{(pg.amenities || []).length - 3} more
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                        <div>
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Starts from</span>
                            <div className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{pg.price}</div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PGCard;
