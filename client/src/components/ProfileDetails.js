import React from 'react';
import './ProfileComponents.css';

function ProfileDetails({ user }) {
  return (
    <div className="profile-details">
      <h2 className="section-title">About Me</h2>
      <p className="profile-bio">{user.bio || 'No bio provided yet.'}</p>
      
      <div className="profile-info-grid">
        <div className="profile-info-item">
          <h3>Location</h3>
          <p>{user.location || 'Not specified'}</p>
        </div>
        
        <div className="profile-info-item">
          <h3>Contact Information</h3>
          <p>Phone: {user.contactInfo?.phone || 'Not provided'}</p>
          <p>Public Email: {user.contactInfo?.publicEmail || 'Not provided'}</p>
        </div>

        <div className="profile-info-item">
          <h3>Skills</h3>
          <div className="tags-container">
            {Array.isArray(user.skills) && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))
            ) : (
              <p>No skills listed</p>
            )}
          </div>
        </div>

        <div className="profile-info-item">
          <h3>Following</h3>
          <div className="tags-container">
            {Array.isArray(user.following) && user.following.length > 0 ? (
              user.following.map((following) => (
                <span key={following} className="tag">{following}</span>
              ))
            ) : (
              <p>No Following skills listed</p>
            )}
          </div>
        </div>
                
        <div className="profile-info-item">
          <h3>Availability</h3>
          <p>{user.availability || 'Not specified'}</p>
        </div>

        <div className="profile-info-item">
          <h3>Credits</h3>
          <p>Earned: {user.credits?.earned || 0}</p>
          <p>Spent: {user.credits?.spent || 0}</p>
        </div>

        <div className="profile-info-item">
          <h3>Rating</h3>
          <p>Average: {user.ratingSummary?.average || 0}/5</p>
          <p>Total Ratings: {user.ratingSummary?.count || 0}</p>
        </div>

        <div className="profile-info-item">
          <h3>Social Links</h3>
          <div className="social-links">
            {user.socialLinks?.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            )}
            {user.socialLinks?.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
            )}
            {user.socialLinks?.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
            )}
            {(!user.socialLinks?.github && !user.socialLinks?.linkedin && !user.socialLinks?.twitter) && (
              <p>No social links provided</p>
            )}
          </div>
        </div>

        <div className="profile-info-item">
          <h3>Member Since</h3>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;