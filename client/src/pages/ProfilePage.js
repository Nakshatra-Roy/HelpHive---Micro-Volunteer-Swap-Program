import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader';
import ProfileDetails from '../components/ProfileDetails';
import ProfileStats from '../components/ProfileStats';

function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    skills: '',
    following: {
      offer: [],
      receive: []
    },
    availability: '',
    contactInfo: {
      phone: '',
      publicEmail: ''
    },
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        following: Array.isArray(user.following) ? user.following.join(', ') : user.following || '',
        availability: user.availability || '',
        contactInfo: {
          phone: user.contactInfo?.phone || '',
          publicEmail: user.contactInfo?.publicEmail || ''
        },
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || ''
        }
      });
      setPreviewUrl(user.profilePicture || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (contactInfo and socialLinks)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert comma-separated strings to arrays and format nested objects
    const formattedData = {
      ...profileData,
      skills: profileData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      following: profileData.following.split(',').map(item => item.trim()).filter(Boolean),
      contactInfo: profileData.contactInfo,
      socialLinks: profileData.socialLinks
    };
    
    const success = await updateProfile(formattedData, profilePicture);
    if (success) {
      setIsEditing(false);
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
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={profileData.firstName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={profileData.lastName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              name="bio" 
              value={profileData.bio} 
              onChange={handleInputChange} 
              rows={4} 
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={profileData.location} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={profileData.skills} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Following (comma separated)</label>
            <input 
              type="text" 
              name="following" 
              value={profileData.following} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Availability</label>
            <input 
              type="text" 
              name="availability" 
              value={profileData.availability} 
              onChange={handleInputChange} 
            />
          </div>

          <h3>Contact Information</h3>
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="text" 
              name="contactInfo.phone" 
              value={profileData.contactInfo.phone} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Public Email</label>
            <input 
              type="email" 
              name="contactInfo.publicEmail" 
              value={profileData.contactInfo.publicEmail} 
              onChange={handleInputChange} 
            />
          </div>

          <h3>Social Links</h3>
          <div className="form-group">
            <label>GitHub</label>
            <input 
              type="url" 
              name="socialLinks.github" 
              value={profileData.socialLinks.github} 
              onChange={handleInputChange} 
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className="form-group">
            <label>LinkedIn</label>
            <input 
              type="url" 
              name="socialLinks.linkedin" 
              value={profileData.socialLinks.linkedin} 
              onChange={handleInputChange} 
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className="form-group">
            <label>Twitter</label>
            <input 
              type="url" 
              name="socialLinks.twitter" 
              value={profileData.socialLinks.twitter} 
              onChange={handleInputChange} 
              placeholder="https://twitter.com/username"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn primary">Save Changes</button>
            <button type="button" className="btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <ProfileDetails user={user} />
          <ProfileStats user={user} />
        </>
      )}
    </div>
  );
}

export default ProfilePage;