import React from 'react';
const ProfileDetails = ({
  user,
  isEditing,
  onDataChange,
  onContactChange
}) => {
  const handleBioChange = e => {
    onDataChange('bio', e.target.value);
  };
  const handleContactChange = field => e => {
    onContactChange(field, e.target.value);
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#343a40] mb-4">About Me</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#343a40] mb-2">Bio</h3>
        {isEditing ? <textarea value={user.bio} onChange={handleBioChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745] min-h-[120px]" placeholder="Tell us about yourself..." /> : <p className="text-[#343a40]">{user.bio}</p>}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#343a40] mb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            {isEditing ? <input type="email" value={user.contact.email} onChange={handleContactChange('email')} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]" /> : <p className="text-[#343a40]">{user.contact.email}</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            {isEditing ? <input type="tel" value={user.contact.phone} onChange={handleContactChange('phone')} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]" /> : <p className="text-[#343a40]">{user.contact.phone}</p>}
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileDetails;