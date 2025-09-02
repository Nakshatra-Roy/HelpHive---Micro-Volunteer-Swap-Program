// client/src/components/TrustDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend
);

const TrustDashboard = ({ userId }) => {
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!userId) return;

    const fetchTrustData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/api/users/${userId}/trust-score`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // ---
        setTrustData(response.data.data);
      } catch (error) {
        console.error("THE REAL ERROR in Trust Score is:", error);
        console.error("Error fetching trust data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustData();
  }, [userId]);

  if (loading) {
    return <div className="card">Loading Trust Score...</div>;
  }
  if (!trustData) {
    return <div className="card">Could not load Trust Score data.</div>;
  }

  const barChartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Number of Ratings',
      data: Object.values(trustData.ratingDistribution),
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }],
  };
  
  const lineChartData = {
    labels: trustData.ratingHistory.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [{
      label: 'Rating Over Time',
      data: trustData.ratingHistory.map(h => h.rating),
      fill: false,
      borderColor: '#10b981',
      tension: 0.1,
    }],
  };

  return (
    <div className="card">
      <h2 className="card-title">Trust & Reputation</h2>
      <div className="trust-score-container">
        <div className="trust-score-value">{trustData.trustScore}</div>
        <div className="trust-score-label">Trust Score</div>
      </div>
      
      <div className="trust-charts-grid">
        <div className="chart-container">
          <h3>Rating Distribution</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
        <div className="chart-container">
          <h3>Rating History</h3>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default TrustDashboard;