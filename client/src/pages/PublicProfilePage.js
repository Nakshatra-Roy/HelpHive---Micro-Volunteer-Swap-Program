import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';   
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom"; // Also includes useNavigate
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ActivityStats from '../components/ActivityStats';
import TrustDashboard from '../components/TrustDashboard';
import UserTasks from '../components/UserTasks';
import LeaveReviewModal from '../components/LeaveReviewModal';
import SeeReviewModal from '../components/SeeReviewModal';


function PublicProfilePage() {
  const navigate = useNavigate();
  const { id: profileUserId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChatTaskId, setActiveChatTaskId] = useState(null);
  const [reviewTask, setReviewTask] = useState(null);
  const [viewingReview, setViewingReview] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const API = process.env.REACT_APP_BACKEND_URL;
  
  useEffect(() => {
  // If a logged-in user tries to view their own public profile,
  // redirect them to their private, editable one.
  if (currentUser && currentUser._id === profileUserId) {
    navigate("/profile");
    return;
  }

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/users/${profileUserId}`);
      setProfileUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Optional: navigate to a 404 page if the user is not found
    } finally {
      setLoading(false);
    }
  };

  if (profileUserId) {
    fetchUserProfile();
  }
}, [profileUserId, currentUser, navigate]);


  if (loading) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="backdrop"><div className="blob b1" /><div className="blob b2" /><div className="grid-overlay" /></div>
      <div className="card glass">Loading profile...</div>
    </div>
  );
}

if (!profileUser) {
  return <div>User not found.</div>; // Or a proper 404 component
}

  return (
    <>
      <div style={{ position: "relative", minHeight: "100vh" }}>
    <div className="backdrop">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="grid-overlay" />
    </div>
    
    <div className="profile-container">
      
      <ProfileHeader user={profileUser} />
        <div className="profile-view-mode">
          <div className="profile-content-grid">
            <div className="profile-main-content">

                <TrustDashboard userId={profileUser._id} />
                
              {/* About Me Card */}
              <div className="card">
                <h2 className="card-title">About Me</h2>
                <p className="profile-bio">{profileUser?.bio || 'No bio provided yet.'}</p>
                <div className="profile-location">
                  <span className="location-icon">📍</span>
                  <span>{profileUser?.location || 'Location not specified'}</span>
                </div>
                <div className="profile-member-since">
                  <span className="member-icon">🗓️</span>
                  <span>Member since {new Date(profileUser?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Skills Card */}
              <div className="card">
                <h2 className="card-title">Skills</h2>
                <div className="skills-container">
                  <div className="skills-section">
                    <h3 className="skills-subtitle">Skills I'm Offering</h3>
                    <div className="skills-pills">
                      {Array.isArray(profileUser?.skills) && profileUser?.skills?.length > 0 ? (
                        profileUser?.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="skill-pill">🔹 {skill}</span>
                        ))
                      ) : (
                        <p className="empty-skills">No skills listed yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="skills-section">
                    <h3 className="skills-subtitle">Skills I Need Help With</h3>
                    <div className="skills-pills">
                      {Array.isArray(profileUser?.following) && profileUser?.following.length > 0 ? (
                        profileUser?.following.map((following, index) => (
                          <span key={`${following}-${index}`} className="skill-pill need-help">🔸 {following}</span>
                        ))
                      ) : (
                        <p className="empty-skills">No skills listed yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Stats Card */}
              <ActivityStats user={profileUser} />
            </div>
            {/* Summary Card (Right Column) */}
            <div className="profile-summary-column">
              <div className="card">
                <h2 className="card-title">Summary</h2>
                <div className="summary-stats">
                  <div className="summary-stat-item">
                    <div className="stat-icon earned-icon">💰</div>
                    <div className="stat-details">
                      <div className="stat-label">Credits Earned</div>
                      <div className="stat-value">{profileUser?.credits?.earned || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon spent-icon">🛒</div>
                    <div className="stat-details">
                      <div className="stat-label">Credits Spent</div>
                      <div className="stat-value">{profileUser?.credits?.spent || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon rating-icon">⭐</div>
                    <div className="stat-details">
                      <div className="stat-label">Average Rating</div>
                      <div className="stat-value">
                        {(profileUser?.ratingSummary?.average || 0).toFixed(2)}/5 ({profileUser?.ratingSummary?.count || 0})
                        </div>
                    </div>
                  </div>
                </div>
                
                <div className="credit-balance">
                  <div className="balance-label">Credits Balance</div>
                  <div className="balance-value">{(profileUser?.credits?.balance|| 0)}</div>
                </div>
                
                <div className="social-links-container">
                  {profileUser?.socialLinks?.github && (
                    <a href={profileUser?.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                  )}
                  {profileUser?.socialLinks?.linkedin && (
                    <a href={profileUser?.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  )}
                  {profileUser?.socialLinks?.twitter && (
                    <a href={profileUser?.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>  
    </div>
    </div>
    </>
  );
}

export default PublicProfilePage;