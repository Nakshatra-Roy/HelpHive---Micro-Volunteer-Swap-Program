import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSummary from '../components/AdminSummary';
import AdminGlobalActivity from '../components/AdminGlobalActivity';
import ShowAdmins from '../components/ShowAdmins';
import AdminRecentActivity from '../components/AdminRecentActivity';
import './AdminDashboardPage.css'; // Import the new stylesheet

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes, adminsRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/my-activity'),
                    axios.get('/api/admin/all-admins')
                ]);
                // --- THIS IS THE FIX --- 
                // This REPLACES the state, it doesn't add to it. 
                // Even if this function runs 100 times, the state will always be 
                // just the 4 unique admins from the last API call. 
                setStats(statsRes.data); 
                setActivity(activityRes.data); 
                setAdmins(adminsRes.data); 
            } catch (error) {
                console.error('Error fetching admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-indicator">Loading Admin Dashboard...</div>;
    }
    
    return (
        <div className="admin-dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="dashboard-grid">
                {/* Platform Summary Card */}
                <div className="dashboard-card">
                    <AdminSummary stats={stats} />
                </div>

                {/* Global Activity Card */}
                <div className="dashboard-card">
                    <AdminGlobalActivity stats={stats?.activityStats} />
                </div>

                {/* Recent Activity Card - Spans full width if possible */}
                <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
                    <AdminRecentActivity activity={activity} />
                </div>

                {/* Administrators Card - Spans full width */}
                <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
                    <ShowAdmins admins={admins} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;