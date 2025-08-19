import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader';
import ProfileDetails from '../components/ProfileDetails';
import ProfileStats from '../components/ProfileStats';
import ActivityStats from '../components/ActivityStats';
import UserTasks from '../components/UserTasks';


function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Initialize react-hook-form
  const { register, handleSubmit, reset } = useForm();

  // Synchronize user data with form when user data is available
  useEffect(() => {
    if (user) {
      // Reset form with user data
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        following: Array.isArray(user.following) ? user.following.join(', ') : '',
        availability: user.availability || '',
        'contactInfo.phone': user.contactInfo?.phone || '',
        'contactInfo.publicEmail': user.contactInfo?.publicEmail || '',
        'socialLinks.github': user.socialLinks?.github || '',
        'socialLinks.linkedin': user.socialLinks?.linkedin || '',
        'socialLinks.twitter': user.socialLinks?.twitter || '',
        'socialLinks.website': user.socialLinks?.website || ''
      });
    }
  }, [user, reset]);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmitForm = async (formData) => {
    // Format the data for the API
    const formattedData = {
      ...formData,
      // Convert comma-separated strings to arrays
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      following: formData.following.split(',').map(following => following.trim()).filter(Boolean),
      // Reconstruct nested objects
      contactInfo: {
        phone: formData['contactInfo.phone'] || '',
        publicEmail: formData['contactInfo.publicEmail'] || ''
      },
      socialLinks: {
        github: formData['socialLinks.github'] || '',
        linkedin: formData['socialLinks.linkedin'] || '',
        twitter: formData['socialLinks.twitter'] || '',
        website: formData['socialLinks.website'] || ''
      }
    };
    
    // Remove the flattened properties
    delete formattedData['contactInfo.phone'];
    delete formattedData['contactInfo.publicEmail'];
    delete formattedData['socialLinks.github'];
    delete formattedData['socialLinks.linkedin'];
    delete formattedData['socialLinks.twitter'];
    delete formattedData['socialLinks.website'];
    
    // Add more detailed logging
    console.log('Submitting profile data:', formattedData);
    console.log('Contact Info:', formattedData.contactInfo);
    console.log('Social Links:', formattedData.socialLinks);
    
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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        following: Array.isArray(user.following) ? user.following.join(', ') : '',
        availability: user.availability || '',
        'contactInfo.phone': user.contactInfo?.phone || '',
        'contactInfo.publicEmail': user.contactInfo?.publicEmail || '',
        'socialLinks.github': user.socialLinks?.github || '',
        'socialLinks.linkedin': user.socialLinks?.linkedin || '',
        'socialLinks.twitter': user.socialLinks?.twitter || '',
        'socialLinks.website': user.socialLinks?.website || ''
      });
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">Please log in to view your profile</div>;
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        user={user} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        previewUrl={previewUrl} 
        handleFileChange={handleFileChange} 
      />
      
      {isEditing ? (
        <form className="profile-edit-form" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              {...register('firstName', { required: true })} 
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              {...register('lastName', { required: true })} 
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              {...register('bio')} 
              rows={4} 
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              {...register('location')} 
            />
          </div>
          
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input 
              type="text" 
              {...register('skills')} 
            />
          </div>
          
          <div className="form-group">
            <label>Following (comma separated)</label>
            <input 
              type="text" 
              {...register('following')} 
            />
          </div>
          
          <div className="form-group">
            <label>Availability</label>
            <input 
              type="text" 
              {...register('availability')} 
            />
          </div>

          <div className="section-wrapper">
            <h3>Contact Information</h3>
            <div className="contact-info-grid">
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  {...register('contactInfo.phone')} 
                />
              </div>
              
              <div className="form-group">
                <label>Public Email</label>
                <input 
                  type="email" 
                  {...register('contactInfo.publicEmail')} 
                />
              </div>
            </div>
          </div>

          <div className="section-wrapper">
            <h3>Social Links</h3>
            <div className="social-links-grid">
              <div className="form-group">
                <label>GitHub</label>
                <input 
                  type="url" 
                  {...register('socialLinks.github')} 
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="form-group">
                <label>LinkedIn</label>
                <input 
                  type="url" 
                  {...register('socialLinks.linkedin')} 
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="form-group">
                <label>Twitter</label>
                <input 
                  type="url" 
                  {...register('socialLinks.twitter')} 
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="url" 
                  {...register('socialLinks.website')} 
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn primary">Save Changes</button>
            <button type="button" className="btn secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-view-mode">
          <div className="profile-content-grid">
            <div className="profile-main-content">
              {/* About Me Card */}
              <div className="profile-card">
                <h2 className="card-title">About Me</h2>
                <p className="profile-bio">{user.bio || 'No bio provided yet.'}</p>
                <div className="profile-location">
                  <span className="location-icon">📍</span>
                  <span>{user.location || 'Location not specified'}</span>
                </div>
                <div className="profile-member-since">
                  <span className="member-icon">🗓️</span>
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Skills Card */}
              <div className="profile-card">
                <h2 className="card-title">Skills</h2>
                <div className="skills-container">
                  <div className="skills-section">
                    <h3 className="skills-subtitle">Skills I Can Offer</h3>
                    <div className="skills-pills">
                      {Array.isArray(user.skills) && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="skill-pill">🔹 {skill}</span>
                        ))
                      ) : (
                        <p className="empty-skills">No skills listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="skills-section">
                    <h3 className="skills-subtitle">Skills I Need Help With</h3>
                    <div className="skills-pills">
                      {Array.isArray(user.following) && user.following.length > 0 ? (
                        user.following.map((following, index) => (
                          <span key={`${following}-${index}`} className="skill-pill need-help">🔸 {following}</span>
                        ))
                      ) : (
                        <p className="empty-skills">No skills listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Stats Card */}
              <ActivityStats user={user} />
              
              {/* Volunteer History Card */}
              <UserTasks userId={user._id} />
            </div>
            {/* Summary Card (Right Column) */}
            <div className="profile-summary-column">
              <div className="profile-card summary-card">
                <h2 className="card-title">Summary</h2>
                <div className="summary-stats">
                  <div className="summary-stat-item">
                    <div className="stat-icon earned-icon">💰</div>
                    <div className="stat-details">
                      <div className="stat-label">Credits Earned</div>
                      <div className="stat-value">{user.credits?.earned || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon spent-icon">🛒</div>
                    <div className="stat-details">
                      <div className="stat-label">Credits Spent</div>
                      <div className="stat-value">{user.credits?.spent || 0}</div>
                    </div>
                  </div>
                  
                  <div className="summary-stat-item">
                    <div className="stat-icon rating-icon">⭐</div>
                    <div className="stat-details">
                      <div className="stat-label">Average Rating</div>
                      <div className="stat-value">{user.ratingSummary?.average || 0}/5 ({user.ratingSummary?.count || 0})</div>
                    </div>
                  </div>
                </div>
                
                <div className="credit-balance">
                  <div className="balance-label">Credits Balance</div>
                  <div className="balance-value">{(user.credits?.earned || 0) - (user.credits?.spent || 0)}</div>
                </div>
                
                <div className="social-links-container">
                  {user.socialLinks?.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                  )}
                  {user.socialLinks?.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;