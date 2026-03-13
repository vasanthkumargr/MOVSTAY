import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const N8N_PROXY = 'http://localhost:5000/api/requirements/shortlist';

const Requirements = () => {
    const [step, setStep] = useState('form'); // 'form' | 'loading' | 'results' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const [scoredPGs, setScoredPGs] = useState([]);

    const [form, setForm] = useState({
        location: '',
        budget: '',
        accommodationType: 'pg',
        occupancy: 'any',
        gender: 'any',
        additionalRequirements: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStep('loading');
        setErrorMsg('');

        try {
            // Step 1: Fetch all PGs from backend
            const pgRes = await fetch('http://localhost:5000/api/hostels');
            const allPGs = await pgRes.json();

            // Step 2: Filter by core requirements only (NOT additional requirements/amenities textarea)
            const budget = parseInt(form.budget) || 0;
            const locationKeyword = form.location.toLowerCase().trim();

            const filtered = allPGs.filter(pg => {
                // Location match
                const pgLocation = (pg.location || '').toLowerCase();
                const locationMatch = locationKeyword === '' || pgLocation.includes(locationKeyword);

                // Budget match: extract numeric value from price string e.g. "₹12,000/mo"
                let pgPrice = 0;
                if (pg.price) {
                    const priceMatch = pg.price.replace(/[₹,]/g, '').match(/\d+/);
                    if (priceMatch) pgPrice = parseInt(priceMatch[0]);
                }
                const budgetMatch = budget === 0 || pgPrice === 0 || pgPrice <= budget;

                // Gender match
                const pgGender = (pg.gender || '').toLowerCase();
                const genderMatch = form.gender === 'any' || pgGender === 'any' ||
                    pgGender.includes(form.gender.toLowerCase()) || pgGender === 'co-ed';

                return locationMatch && budgetMatch && genderMatch;
            });

            if (filtered.length === 0) {
                setErrorMsg('No PGs found matching your location and budget. Try adjusting your criteria.');
                setStep('error');
                return;
            }

            // Step 3: Send user requirements + filtered PG amenities/description to n8n
            const payload = {
                userRequirements: {
                    location: form.location,
                    maxBudget: form.budget,
                    accommodationType: form.accommodationType,
                    occupancy: form.occupancy,
                    gender: form.gender,
                    additionalRequirements: form.additionalRequirements
                },
                pgListings: filtered.map(pg => ({
                    id: String(pg._id),
                    name: pg.name || 'Unknown PG',
                    location: pg.location || '',
                    price: pg.price || '',
                    rating: pg.rating || 0,
                    gender: pg.gender || '',
                    amenities: pg.amenities || [],
                    description: pg.description || ''
                }))
            };

            const n8nRes = await fetch(N8N_PROXY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Step 4: Parse n8n response
            const contentType = n8nRes.headers.get('content-type');
            let n8nData = null;
            if (contentType && contentType.includes('application/json')) {
                n8nData = await n8nRes.json();
            }

            // Merge scores from n8n back into filtered PGs
            // Expected n8n response: { scores: [{ id, score, reason }] } or flat array
            let scoresMap = {};
            if (n8nData) {
                const scoresArr = Array.isArray(n8nData) ? n8nData : (n8nData.scores || []);
                scoresArr.forEach(s => {
                    if (s.id) scoresMap[String(s.id)] = s;
                });
            }

            const merged = filtered.map(pg => ({
                ...pg,
                score: scoresMap[String(pg._id)]?.score ?? null,
                reason: scoresMap[String(pg._id)]?.reason ?? ''
            }));

            // Sort by score descending if scores exist
            merged.sort((a, b) => {
                if (a.score === null && b.score === null) return 0;
                if (a.score === null) return 1;
                if (b.score === null) return -1;
                return b.score - a.score;
            });

            setScoredPGs(merged);
            setStep('results');

        } catch (err) {
            console.error('Error:', err);
            setErrorMsg(`Something went wrong: ${err.message}`);
            setStep('error');
        }
    };

    return (
        <div className="container py-16 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl" style={{ fontWeight: 800, marginBottom: '1rem' }}>
                    Tell us what you <span className="text-gradient">Need</span>
                </h1>
                <p className="text-xl text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Fill in your requirements and our AI will find and score the best matching PGs for you.
                </p>
            </div>

            {/* FORM */}
            {step === 'form' && (
                <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Preferred Location *</label>
                                <input type="text" name="location" className="input" placeholder="e.g. Koramangala, Bangalore" required value={form.location} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Max Monthly Budget (₹) *</label>
                                <input type="number" name="budget" className="input" placeholder="e.g. 15000" required value={form.budget} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Accommodation Type</label>
                                <select name="accommodationType" className="input" style={{ appearance: 'none' }} value={form.accommodationType} onChange={handleChange}>
                                    <option value="pg">PG / Paying Guest</option>
                                    <option value="hostel">Hostel</option>
                                    <option value="colive">Co-Living Space</option>
                                    <option value="flat">Independent Flat</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Occupancy</label>
                                <select name="occupancy" className="input" style={{ appearance: 'none' }} value={form.occupancy} onChange={handleChange}>
                                    <option value="any">Any</option>
                                    <option value="single">Single Room</option>
                                    <option value="double">Double Sharing</option>
                                    <option value="triple">Triple Sharing</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Gender Preference</label>
                                <select name="gender" className="input" style={{ appearance: 'none' }} value={form.gender} onChange={handleChange}>
                                    <option value="any">Any</option>
                                    <option value="boys">Boys</option>
                                    <option value="girls">Girls</option>
                                    <option value="co-ed">Co-Ed</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Additional Requirements <span className="text-muted" style={{ fontWeight: 400 }}>(optional — used by AI for scoring)</span></label>
                            <textarea
                                name="additionalRequirements"
                                className="input"
                                rows="3"
                                placeholder="e.g. I need high-speed WiFi, attached bathroom, vegetarian food, quiet environment..."
                                style={{ resize: 'vertical' }}
                                value={form.additionalRequirements}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mt-4 w-full" style={{ padding: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Find & Score My PGs <Send size={20} />
                        </button>
                        <p className="text-center text-muted text-sm">We take your privacy seriously. Your data is secure with us.</p>
                    </form>
                </div>
            )}

            {/* LOADING */}
            {step === 'loading' && (
                <div className="text-center py-24">
                    <Loader2 size={60} className="text-primary" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
                    <h2 className="text-3xl" style={{ fontWeight: 700, marginBottom: '1rem' }}>Finding & Scoring PGs...</h2>
                    <p className="text-muted">Our AI is analysing available listings against your requirements. This may take a few seconds.</p>
                </div>
            )}

            {/* ERROR */}
            {step === 'error' && (
                <div className="glass-panel text-center py-16" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <p style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{errorMsg}</p>
                    <button onClick={() => setStep('form')} className="btn btn-outline">Try Again</button>
                </div>
            )}

            {/* RESULTS */}
            {step === 'results' && (
                <div>
                    <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 className="text-3xl" style={{ fontWeight: 800 }}>
                                <span className="text-gradient">{scoredPGs.length} Matching</span> PGs Found
                            </h2>
                            <p className="text-muted mt-1">Sorted by AI compatibility score</p>
                        </div>
                        <button onClick={() => setStep('form')} className="btn btn-outline">Search Again</button>
                    </div>

                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                        {scoredPGs.map((pg, idx) => (
                            <div key={pg._id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', height: '180px' }}>
                                    <img
                                        src={pg.images && pg.images[0] ? pg.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                                        alt={pg.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {pg.score !== null && (
                                        <div style={{
                                            position: 'absolute', top: '1rem', right: '1rem',
                                            background: pg.score >= 75 ? 'rgba(16,185,129,0.9)' : pg.score >= 50 ? 'rgba(245,158,11,0.9)' : 'rgba(239,68,68,0.9)',
                                            backdropFilter: 'blur(4px)', padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-full)', fontWeight: 800, color: 'white', fontSize: '0.9rem'
                                        }}>
                                            🎯 {pg.score}/100
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                                        #{idx + 1}
                                    </div>
                                </div>

                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{pg.name}</h3>
                                    <div className="flex items-center gap-1 text-muted" style={{ fontSize: '0.875rem' }}>
                                        <MapPin size={14} /> {pg.location}
                                    </div>
                                    <div className="flex items-center gap-3" style={{ fontSize: '0.875rem' }}>
                                        <span className="text-gradient" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{pg.price}</span>
                                        {pg.rating && (
                                            <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Star size={14} fill="currentColor" /> {pg.rating}
                                            </span>
                                        )}
                                        {pg.gender && (
                                            <span style={{ background: 'var(--bg-glass)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>{pg.gender}</span>
                                        )}
                                    </div>

                                    {pg.amenities && pg.amenities.length > 0 && (
                                        <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                                            {pg.amenities.slice(0, 4).map((a, i) => (
                                                <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a}</span>
                                            ))}
                                            {pg.amenities.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{pg.amenities.length - 4} more</span>}
                                        </div>
                                    )}

                                    {pg.reason && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                                            💬 {pg.reason}
                                        </p>
                                    )}

                                    <Link to={`/pg/${pg._id}`} className="btn btn-primary" style={{ marginTop: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem', textAlign: 'center', textDecoration: 'none', fontSize: '0.875rem' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Requirements;
