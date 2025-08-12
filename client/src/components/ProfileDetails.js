import React from 'react'

const ProfileDetails = ({ user, isEditing, onDataChange, onContactChange }) => {
  // Ensure user and contact exist with default values
  const userWithDefaults = user || { bio: '', contact: { email: '', phone: '' } }
  
  const handleBioChange = (e) => {
    onDataChange('bio', e.target.value)
  }
  
  const handleContactChange = (field) => (e) => {
    onContactChange(field, e.target.value)
  }
  
  return (
    <div className="profile-section">
      <h2 className="text-xl font-bold text-[#343a40] mb-4">About Me</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#343a40] mb-2">Bio</h3>
        {isEditing ? (
          <textarea
            value={userWithDefaults.bio || ''}
            onChange={handleBioChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745] min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-[#343a40]">{userWithDefaults.bio || 'No bio available'}</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-[#343a40] mb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={userWithDefaults.contact?.email || ''}
                onChange={handleContactChange('email')}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              />
            ) : (
              <p className="text-[#343a40]">{userWithDefaults.contact?.email || 'No email available'}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={userWithDefaults.contact?.phone || ''}
                onChange={handleContactChange('phone')}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              />
            ) : (
              <p className="text-[#343a40]">{userWithDefaults.contact?.phone || 'No phone available'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDetails