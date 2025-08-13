import React from 'react';
import './ProfileComponents.css';

function ProfileHeader({ user, isEditing, setIsEditing, previewUrl, handleFileChange }) {
  // Helper function to get user initials
  const getInitials = (firstName = '', lastName = '') => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const userInitials = getInitials(user?.firstName, user?.lastName);
  
  // Construct the correct image URL
  let imageUrl = '';
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (previewUrl) {
    // If there's a preview URL (during image upload), use it
    imageUrl = previewUrl;
  } else if (user?.profilePicture) {
    // Check if the profilePicture is a full URL
    if (user.profilePicture.startsWith('http')) {
      // If yes, it's from Cloudinary. Use it directly.
      imageUrl = user.profilePicture;
    } else {
      // If no, it's the default avatar filename. Construct the full URL.
      imageUrl = `${backendUrl}/images/${user.profilePicture}`;
    }
  } else {
    // A final fallback in case profilePicture is missing entirely
    imageUrl = `${backendUrl}/images/${user.profilePicture}`;
  }
  console.log('Final computed imageUrl for <img> src:', imageUrl);
  return (
    <div className="profile-header">
      <div className="profile-cover">
        <div className="profile-avatar-container">
          <div className="profile-picture-container">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Profile" 
                className="profile-avatar" 
              />
            ) : (
              <div className="initials-avatar">
                <span>{userInitials}</span>
              </div>
            )}
            {isEditing && (
              <label htmlFor="profile-picture" className="profile-picture-overlay">
                <span>📷 Change</span>
                <input 
                  type="file" 
                  id="profile-picture" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </label>
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-header-content">
        <div className="profile-name-container">
          <div className="profile-name-info">
            <h1 className="profile-name">{`${user.firstName} ${user.lastName}`}</h1>
            <div className="profile-details-row">
              <div className="profile-location-header">
                <span className="location-icon">📍</span>
                <span>{user.location || 'Location not specified'}</span>
              </div>
              <div className="profile-member-since-header">
                <span className="member-icon">🗓️</span>
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button 
              className="btn edit-profile-btn" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        <p className="profile-email">{user.email}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;