import React from 'react'
import { PencilIcon, CheckIcon } from 'lucide-react'

const ProfileHeader = ({ user, isEditing, onEditToggle, onDataChange, onProfilePictureChange }) => {
  // Ensure user exists with default values
  const userWithDefaults = user || { name: '', location: '', profilePicture: '', memberSince: '' }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a preview for immediate display
      const reader = new FileReader()
      reader.onloadend = () => {
        onDataChange('profilePicture', reader.result)
      }
      reader.readAsDataURL(file)
      
      // Pass the actual file for upload
      if (onProfilePictureChange) {
        onProfilePictureChange(file)
      }
    }
  }
  
  const handleNameChange = (e) => {
    onDataChange('name', e.target.value)
  }
  
  const handleLocationChange = (e) => {
    onDataChange('location', e.target.value)
  }
  
  return (
    <div className="profile-header">
      <div className="profile-picture-container">
        <img 
          src={userWithDefaults.profilePicture || 'https://via.placeholder.com/150'} 
          alt={userWithDefaults.name || 'User'}
          className="profile-picture"
        />
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full"></div>
            <label
              htmlFor="profile-picture"
              className="relative z-10 flex items-center justify-center bg-[#28a745] hover:bg-[#218838] text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110"
              title="Change profile picture"
            >
              <PencilIcon size={18} />
              <input 
                type="file" 
                id="profile-picture" 
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        {isEditing ? (
          <input 
            type="text" 
            value={userWithDefaults.name} 
            onChange={handleNameChange} 
            className="text-3xl font-bold text-[#343a40] mb-2 w-full border-b-2 border-[#28a745] focus:outline-none bg-transparent"
          />
        ) : (
          <h1 className="text-3xl font-bold text-[#343a40] mb-2">{userWithDefaults.name}</h1>
        )}
        {isEditing ? (
          <input 
            type="text" 
            value={userWithDefaults.location} 
            onChange={handleLocationChange} 
            className="text-gray-600 mb-1 w-full border-b-2 border-[#28a745] focus:outline-none bg-transparent"
          />
        ) : (
          <p className="text-gray-600 mb-1">{userWithDefaults.location}</p>
        )}
        <p className="text-gray-500">Member since {userWithDefaults.memberSince}</p>
      </div>
      
      <button 
        onClick={onEditToggle} 
        className="edit-profile-button"
      >
        {isEditing ? (
          <>
            <CheckIcon size={18} />
            Save Changes
          </>
        ) : (
          <>
            <PencilIcon size={18} />
            Edit Profile
          </>
        )}
      </button>
    </div>
  )
}

export default ProfileHeader