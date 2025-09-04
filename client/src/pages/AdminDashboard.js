import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSummary from '../components/AdminSummary';
import AdminGlobalActivity from '../components/AdminGlobalActivity';
import ShowAdmins from '../components/ShowAdmins';
import AdminRecentActivity from '../components/AdminRecentActivity';
import toast, { Toaster } from 'react-hot-toast';


const AdminDashboard = () => {
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
    return (
      <div className="profile-page">
        <div className="backdrop">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="grid-overlay" />
        </div>
        <div className="container section">
          <div className="skeleton card glass">Loading profile…</div>
        </div>
      </div>
    );
  }
    
    return (
        <div className="admin-dashboard-container">
            <div className="backdrop">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="grid-overlay" />
        </div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="dashboard-grid">
                
                {/* Platform Summary Card */}
                <div className="card glass hover-lift">
                    <AdminSummary stats={stats} />
                </div>

                {/* Global Activity Card */}
                <div className="card glass hover-lift">
                    <AdminGlobalActivity stats={stats?.activityStats} />
                </div>

                {/* Recent Activity Card - Spans full width if possible */}
                <div className="card glass hover-lift" style={{ gridColumn: '1 / -1' }}>
                    <AdminRecentActivity activity={activity} />
                </div>

                {/* Administrators Card - Spans full width */}
                <div className="card glass hover-lift" style={{ gridColumn: '1 / -1' }}>
                    <ShowAdmins admins={admins} loading={loading} />
                </div>
            </div>
            <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
        </div>
    );
};

export default AdminDashboard;