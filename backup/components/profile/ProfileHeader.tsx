import React from 'react';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';
const ProfileHeader = ({
  user,
  isEditing,
  onEditToggle,
  onDataChange
}) => {
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we'd upload the file to a server and get back a URL
      // For this mock, we'll use a FileReader to create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onDataChange('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleNameChange = e => {
    onDataChange('name', e.target.value);
  };
  const handleLocationChange = e => {
    onDataChange('location', e.target.value);
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#28a745]">
            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
          </div>
          {isEditing && <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full"></div>
              <label htmlFor="profile-picture" className="relative z-10 flex items-center justify-center bg-[#28a745] hover:bg-[#218838] text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110" title="Change profile picture">
                <PencilIcon size={18} />
                <input type="file" id="profile-picture" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>}
        </div>
        <div className="flex-1 text-center md:text-left">
          {isEditing ? <input type="text" value={user.name} onChange={handleNameChange} className="text-3xl font-bold text-[#343a40] mb-2 w-full border-b-2 border-[#28a745] focus:outline-none" /> : <h1 className="text-3xl font-bold text-[#343a40] mb-2">
              {user.name}
            </h1>}
          {isEditing ? <input type="text" value={user.location} onChange={handleLocationChange} className="text-gray-600 mb-1 w-full border-b-2 border-[#28a745] focus:outline-none" /> : <p className="text-gray-600 mb-1">{user.location}</p>}
          <p className="text-gray-500">Member since {user.memberSince}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={onEditToggle} className={`flex items-center px-4 py-2 rounded-md ${isEditing ? 'bg-white text-[#28a745] border border-[#28a745]' : 'bg-[#28a745] text-white'}`}>
            {isEditing ? <>
                <CheckIcon size={18} className="mr-1" />
                Save Changes
              </> : <>
                <PencilIcon size={18} className="mr-1" />
                Edit Profile
              </>}
          </button>
          {isEditing && <button onClick={onEditToggle} className="flex items-center px-4 py-2 rounded-md bg-white text-red-500 border border-red-500 mt-2">
              <XIcon size={18} className="mr-1" />
              Cancel
            </button>}
        </div>
      </div>
    </div>;
};
export default ProfileHeader;