import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ActivityStats from '../components/ActivityStats';
import UserTasks from '../components/UserTasks';
import LeaveReviewModal from '../components/LeaveReviewModal';
import SeeReviewModal from '../components/SeeReviewModal';


function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeChatTaskId, setActiveChatTaskId] = useState(null);
  const [reviewTask, setReviewTask] = useState(null);
  const [viewingReview, setViewingReview] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  
  useEffect(() => {
  if (loading || !user) return;

  reset({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: Array.isArray(user?.skills) ? user?.skills.join(', ') : '',
    following: Array.isArray(user?.following) ? user?.following.join(', ') : '',
    availability: user?.availability || '',
    'contactInfo_phone': user?.contactInfo?.phone || '',
    'contactInfo_publicEmail': user?.contactInfo?.publicEmail || '',
    'socialLinks_github': user?.socialLinks?.github || '',
    'socialLinks_linkedin': user?.socialLinks?.linkedin || '',
    'socialLinks_twitter': user?.socialLinks?.twitter || '',
    'socialLinks_website': user?.socialLinks?.website || '',
  });
}, [user, loading, reset]);

  const handleReviewSubmitted = (reviewedUsers) => { // Now expects an array
    // Check if the reviewedUsers is an array and not empty
    if (Array.isArray(reviewedUsers) && reviewedUsers.length > 0) {
        alert(`Your reviews for ${reviewedUsers.map(u => u.fullName).join(', ')} have been submitted successfully!`);
    } else if (reviewedUsers && reviewedUsers.fullName) {
        // Handle the single review case
        alert(`Your review for ${reviewedUsers.fullName} has been submitted successfully!`);
    }

    // Trigger the refetch in UserTasks.js
    setRefetchTrigger(prev => prev + 1); 
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSeeReviewClick = async (task, reviewee) => {
  try {
    const token = localStorage.getItem('token');
    // This now correctly uses BOTH the task and the reviewee to find the specific review
    const response = await axios.get(
      `/api/reviews/task/${task._id}/for/${reviewee._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // This sets the FULL review object into state
    setViewingReview(response.data.data);
  } catch (error) {
    console.error("Error fetching review:", error);
    alert('Could not load the review.');
  }
};

  const handleSubmitForm = async (formData) => {
    const contactInfo = {
      phone: formData['contactInfo_phone'] || '',
      publicEmail: formData['contactInfo_publicEmail'] || ''
    };

    const socialLinks = {
      github: formData['socialLinks_github'] || '',
      linkedin: formData['socialLinks_linkedin'] || '',
      twitter: formData['socialLinks_twitter'] || '',
      website: formData['socialLinks_website'] || ''
    };

    const {
      ['contactInfo_phone']: _1,
      ['contactInfo_publicEmail']: _2,
      ['socialLinks_github']: _3,
      ['socialLinks_linkedin']: _4,
      ['socialLinks_twitter']: _5,
      ['socialLinks_website']: _6,
      ...rest
    } = formData;

    const formattedData = {
      ...rest,
      skills: rest.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      following: rest.following.split(',').map(following => following.trim()).filter(Boolean),
      contactInfo,
      socialLinks
    };

    const success = await updateProfile(formattedData, profilePicture);

    if (success) {
      handleCancel();
    } else {
      console.error('Failed to update profile');
    }
  };


  // Handle canceling edit mode
  const handleCancel = () => {
    setIsEditing(false);
    setProfilePicture(null);
    setPreviewUrl('');
    // Reset form to original user data
    if (user) {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        skills: Array.isArray(user?.skills) ? user?.skills.join(', ') : '',
        following: Array.isArray(user?.following) ? user?.following.join(', ') : '',
        availability: user?.availability || '',
        'contactInfo_phone': user?.contactInfo?.phone || '',
        'contactInfo_publicEmail': user?.contactInfo?.publicEmail || '',
        'socialLinks_github': user?.socialLinks?.github || '',
        'socialLinks_linkedin': user?.socialLinks?.linkedin || '',
        'socialLinks_twitter': user?.socialLinks?.twitter || '',
        'socialLinks_website': user?.socialLinks?.website || ''
      });
    }
  };


  if (loading) {
    return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
    <div className="backdrop">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="grid-overlay" />
    </div>  
    <div className="card glass">Loading profile. Please wait...</div>
    </div>
    )
  }

  if (!user) {
    navigate("/login");
    return;
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
      
      <ProfileHeader 
        user={user} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        previewUrl={previewUrl} 
        handleFileChange={handleFileChange} 
      />
      

      {/* EDIT PROFILE FORM BEGINS */}
      {isEditing ? (
        <form className="profile-edit-form" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="card">
            <p>First Name</p>
            <input 
              type="text" 
              className = "card input-full"
              {...register('firstName', { required: true })} 
            />
          </div>
          
          <div className="card">
            <p>Last Name</p>
            <input 
              type="text" 
              className = "card input-full"
              {...register('lastName', { required: true })} 
            />
          </div>
          
          <div className="card">
            <p>Bio</p>
            <textarea 
              className = "card input-full"
              {...register('bio')} 
              rows={4} 
            />
          </div>
          
          <div className="card">
            <p>Location</p>
            <input 
              className = "card input-full"
              type="text" 
              {...register('location')} 
            />
          </div>
          
          <div className="card">
            <p>Skills (comma separated)</p>
            <input 
              className = "card input-full"
              type="text" 
              {...register('skills')} 
            />
          </div>
          
          <div className="card">
            <p>Skills Following (comma separated)</p>
            <input 
              className = "card input-full"
              type="text" 
              {...register('following')} 
            />
          </div>
          
          <div className="card">
            <p>Availability</p>
            <input 
              className = "card input-full"
              type="text" 
              {...register('availability')} 
            />
          </div>

          <div className="section-wrapper">
            <h3>Contact Information (visible to everyone)</h3>
            <div className="contact-info-grid">
              <div className="card">
                <p>Phone</p>
                <input 
                  className = "card input-full"
                  type="text" 
                  {...register('contactInfo_phone')} 
                />
              </div>
              
              <div className="card">
                <p>Email</p>
                <input 
                  className = "card input-full"
                  type="email" 
                  {...register('contactInfo_publicEmail')} 
                />
              </div>
            </div>
          </div>

          <div className="section-wrapper">
            <h3>Social Links</h3>
            <div className="social-links-grid">
              <div className="card">
                <p>GitHub</p>
                <input 
                  className = "card input-full"
                  type="url" 
                  {...register('socialLinks_github')} 
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="card">
                <p>LinkedIn</p>
                <input 
                  className = "card input-full"
                  type="url" 
                  {...register('socialLinks_linkedin')} 
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="card">
                <p>Twitter</p>
                <input 
                  className = "card input-full"
                  type="url" 
                  {...register('socialLinks_twitter')} 
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div className="card">
                <p>Website</p>
                <input 
                  className = "card input-full"
                  type="url" 
                  {...register('socialLinks_website')} 
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn glossy primary">Save Changes</button>
            <button type="button" className="btn glossy tiny" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-view-mode">
          <div className="profile-content-grid">
            <div className="profile-main-content">

               {/* EDIT PROFILE FORM ENDS */}

              {/* About Me Card */}
              <div className="card">
                <h2 className="card-title">About Me</h2>
                <p className="profile-bio">{user?.bio || 'No bio provided yet.'}</p>
                <div className="profile-location">
                  <span className="location-icon">📍</span>
                  <span>{user?.location || 'Location not specified'}</span>
                </div>
                <div className="profile-member-since">
                  <span className="member-icon">🗓️</span>
                  <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Skills Card */}
              <div className="card">
                <h2 className="card-title">Skills</h2>
                <div className="skills-container">
                  <div className="skills-section">
                    <h3 className="skills-subtitle">Skills I'm Offering</h3>
                    <div className="skills-pills">
                      {Array.isArray(user?.skills) && user?.skills?.length > 0 ? (
                        user?.skills.map((skill, index) => (
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
                      {Array.isArray(user?.following) && user?.following.length > 0 ? (
                        user?.following.map((following, index) => (
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
              <ActivityStats user={user} />
              
              {/* My Tasks History Card */}
              <UserTasks 
                userId={user?._id} 
                onStartChat={setActiveChatTaskId} 
                onLeaveReview={setReviewTask}
                onSeeReview={handleSeeReviewClick}
                refetchTrigger={refetchTrigger}
              />
              {activeChatTaskId && (
                <div className="chat-overlay">
                  <ChatBox taskId={activeChatTaskId} onClose={() => setActiveChatTaskId(null)} />
                </div>
              )}

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
                      <div className="stat-value">{user?.credits?.earned || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon spent-icon">🛒</div>
                    <div className="stat-details">
                      <div className="stat-label">Credits Spent</div>
                      <div className="stat-value">{user?.credits?.spent || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon rating-icon">⭐</div>
                    <div className="stat-details">
                      <div className="stat-label">Average Rating</div>
                          
                      <div className="stat-value">
                        {(user?.ratingSummary?.average || 0).toFixed(2)}/5 ({user?.ratingSummary?.count || 0})
                      </div>

  
                    </div>
                  </div>
                </div>
                
                <div className="credit-balance">
                  <div className="balance-label">Credits Balance</div>
                  <div className="balance-value">{(user?.credits?.balance|| 0)}</div>
                </div>
                
                <div className="social-links-container">
                  {user?.socialLinks?.github && (
                    <a href={user?.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                  )}
                  {user?.socialLinks?.linkedin && (
                    <a href={user?.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  )}
                  {user?.socialLinks?.twitter && (
                    <a href={user?.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}    
    </div>
    </div>

      {/* LeaveReviewModal */}
      {reviewTask && (
        <LeaveReviewModal
          task={reviewTask}
          onClose={() => setReviewTask(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      {viewingReview && (
      <SeeReviewModal 
        review={viewingReview} // Pass the 'viewingReview' state as the 'review' prop
        onClose={() => setViewingReview(null)} 
      />
    )}
    </>
  );
}

export default ProfilePage;