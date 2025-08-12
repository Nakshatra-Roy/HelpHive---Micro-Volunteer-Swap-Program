import React from 'react';
import './ProfileComponents.css';

function ProfileHeader({ user, isEditing, setIsEditing, previewUrl, handleFileChange }) {
  return (
    <div className="profile-header">
      <div className="profile-cover">
        <div className="profile-avatar-container">
          {isEditing ? (
            <div className="profile-avatar-edit">
              <img 
                src={previewUrl || 'https://via.placeholder.com/150?text=Profile'} 
                alt="Profile" 
                className="profile-avatar" 
              />
              <label htmlFor="profile-picture" className="avatar-edit-label">
                <span>Change Photo</span>
                <input 
                  type="file" 
                  id="profile-picture" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          ) : (
            <img 
              src={'https://via.placeholder.com/150?text=Profile'} 
              alt="Profile" 
              className="profile-avatar" 
            />
          )}
        </div>
      </div>
      
      <div className="profile-header-content">
        <div className="profile-name-container">
          <h1 className="profile-name">{`${user.firstName} ${user.lastName}`}</h1>
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