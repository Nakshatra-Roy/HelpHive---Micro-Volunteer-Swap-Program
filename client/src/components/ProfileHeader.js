import React from 'react';

function ProfileHeader({ user, isEditing, setIsEditing, previewUrl, handleFileChange }) {
  const getInitials = (firstName = '', lastName = '') => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const userInitials = getInitials(user?.firstName, user?.lastName);
  
  let imageUrl = '';
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (previewUrl) {
    imageUrl = previewUrl;
  } else if (user?.profilePicture) {
    if (user?.profilePicture.startsWith('http')) {
      imageUrl = user?.profilePicture;
    } else {
      imageUrl = `${backendUrl}/images/${user?.profilePicture}`;
    }
  } else {
    imageUrl = `${backendUrl}/images/${user?.profilePicture}`;
  }
  console.log('Final computed imageUrl for <img> src:', imageUrl);


  return (
    <div className="card">
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
            <h1 className="profile-name">{`${user?.fullName}`}</h1>
            <div className="profile-details-row">
              <div className="profile-location-header">
                <span className="location-icon">📍</span>
                <span>{user?.location || 'Location not specified'}</span>
              </div>
              <div className="profile-member-since-header">
                <span className="member-icon">🗓️</span>
                <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button 
              className="btn glossy primary" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        <p className="profile-email">{user?.email}</p>
        <br/>
        <p className="profile-section-title">Public Information</p>
        <div className="profile-pill-container">
          <div className="profile-pill">📞 Phone: {user?.contactInfo?.phone || "Not set"}</div>
          <div className="profile-pill">📧 Email: {user?.contactInfo?.publicEmail || "Not set"}</div>
          <div style={{ flexBasis: '100%', height: 0 }} />
          <div className="profile-pill">🐙 GitHub: {user?.socialLinks?.github || "Not set"}</div>
          <div className="profile-pill">💼 LinkedIn: {user?.socialLinks?.linkedin || "Not set"}</div>
          <div className="profile-pill">🐦 Twitter: {user?.socialLinks?.twitter || "Not set"}</div>
          <div className="profile-pill">🌐 Website: {user?.socialLinks?.website || "Not set"}</div>
        </div>

      </div>
    </div>
  );
}

export default ProfileHeader;