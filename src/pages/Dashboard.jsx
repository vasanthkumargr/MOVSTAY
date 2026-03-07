import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Wallet, Home, CalendarCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    // Mock Data
    const monthlyExpenses = [
        { name: 'Jan', rent: 12000, utilities: 1500, food: 3000 },
        { name: 'Feb', rent: 12000, utilities: 1600, food: 3200 },
        { name: 'Mar', rent: 12000, utilities: 1400, food: 2900 },
        { name: 'Apr', rent: 12500, utilities: 1800, food: 3400 },
        { name: 'May', rent: 12500, utilities: 2000, food: 3600 },
        { name: 'Jun', rent: 12500, utilities: 2200, food: 3100 },
    ];

    const categoryBreakdown = [
        { name: 'Rent', value: 12500 },
        { name: 'Utilities', value: 2000 },
        { name: 'Food/Meals', value: 3500 },
        { name: 'Laundry', value: 800 },
        { name: 'Others', value: 1200 },
    ];

    const bookingHistory = [
        { name: 'Jan', bookings: 1, views: 15 },
        { name: 'Feb', bookings: 0, views: 24 },
        { name: 'Mar', bookings: 2, views: 42 },
        { name: 'Apr', bookings: 1, views: 30 },
        { name: 'May', bookings: 0, views: 18 },
        { name: 'Jun', bookings: 1, views: 38 },
    ];

    const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold">{value}</div>
                </div>
                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <Icon className="text-primary" size={24} />
                </div>
            </div>
            <div className="text-sm">
                <span className="text-accent flex items-center gap-1 font-medium">
                    <TrendingUp size={14} /> {trend}
                </span>
                <span className="text-muted ml-2">vs last month</span>
            </div>
        </div>
    );

    return (
        <div className="container py-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
                    User <span className="text-gradient">Analytics</span>
                </h1>
                <p className="text-muted">Track your expenses, bookings, and platform activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <StatCard title="Total Spent (YTD)" value="₹84,500" icon={Wallet} trend="+12.5%" />
                <StatCard title="Active Bookings" value="1" icon={Home} trend="0%" />
                <StatCard title="Properties Viewed" value="167" icon={CalendarCheck} trend="+42.3%" />
                <StatCard title="Saved Listings" value="12" icon={TrendingUp} trend="+5.2%" />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: '1fr', '@media (min-width: 1024px)': { gridTemplateColumns: '2fr 1fr' } }} id="charts-layout">
                <style dangerouslySetInnerHTML={{
                    __html: `
          @media (min-width: 1024px) {
            #charts-layout { grid-template-columns: 2fr 1fr !important; }
            #history-layout { grid-template-columns: 1fr 1fr !important; }
          }
        `}} />

                {/* Bar Chart - Expense Trends */}
                <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
                    <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>Monthly Spending Trends</h3>
                    <div style={{ height: '320px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="rent" name="Rent" stackId="a" fill="var(--primary)" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="utilities" name="Utilities" stackId="a" fill="var(--secondary)" />
                                <Bar dataKey="food" name="Food" stackId="a" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Expense Breakdown */}
                <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>Current Month Breakdown</h3>
                    <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}
                                    itemStyle={{ color: 'white' }}
                                    formatter={(value) => [`₹${value}`, 'Amount']}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Chart - Activity */}
            <div className="glass-panel mt-6" style={{ padding: '1.5rem', minHeight: '350px' }}>
                <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>Platform Activity (Views vs Bookings)</h3>
                <div style={{ height: '280px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bookingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}
                            />
                            <Legend iconType="circle" />
                            <Line type="monotone" dataKey="views" name="Property Views" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="bookings" name="Booking Requests" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
