import React, { useState } from 'react';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDetails from '../../components/profile/ProfileDetails';
import SkillsSection from '../../components/profile/SkillsSection';
import StatsSummary from '../../components/profile/StatsSummary';
import VolunteerHistory from '../../components/profile/VolunteerHistory';
// Mock data for the user profile
const mockUserData = {
  id: "1234",
  name: "Sarah Johnson",
  profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  location: "Portland, OR",
  memberSince: "January 2023",
  bio: "I'm a retired teacher who loves gardening and community service. I believe in the power of helping others and building strong communities. I have experience in education, gardening, and basic home repairs.",
  contact: {
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567"
  },
  skillsToOffer: ["Gardening", "Tutoring", "Basic Home Repairs", "Pet Sitting", "Cooking"],
  skillsToReceive: ["Computer Help", "Heavy Lifting", "Home Organization", "Transportation"],
  stats: {
    creditsEarned: 120,
    creditsSpent: 85,
    rating: 4.8
  },
  volunteerHistory: [{
    id: "task1",
    description: "Helped with garden cleanup at community center",
    date: "2023-06-15",
    credits: 15,
    type: "earned"
  }, {
    id: "task2",
    description: "Received computer setup assistance",
    date: "2023-05-22",
    credits: 10,
    type: "spent"
  }, {
    id: "task3",
    description: "Tutored high school student in math",
    date: "2023-04-10",
    credits: 20,
    type: "earned"
  }, {
    id: "task4",
    description: "Pet sitting for neighbor's cat",
    date: "2023-03-05",
    credits: 25,
    type: "earned"
  }, {
    id: "task5",
    description: "Received help with furniture moving",
    date: "2023-02-18",
    credits: 30,
    type: "spent"
  }]
};
const ProfilePage = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing and toggling off, we'd normally save changes to the backend
      // For now, we just toggle the state
    }
    setIsEditing(!isEditing);
  };
  const handleDataChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  const handleContactChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        [field]: value
      }
    }));
  };
  const handleSkillsChange = (type, skills) => {
    setUserData(prevData => ({
      ...prevData,
      [type]: skills
    }));
  };
  return <div className="container mx-auto px-4 py-8 max-w-5xl">
      <ProfileHeader user={userData} isEditing={isEditing} onEditToggle={handleEditToggle} onDataChange={handleDataChange} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 space-y-6">
          <ProfileDetails user={userData} isEditing={isEditing} onDataChange={handleDataChange} onContactChange={handleContactChange} />
          <SkillsSection skillsToOffer={userData.skillsToOffer} skillsToReceive={userData.skillsToReceive} isEditing={isEditing} onSkillsChange={handleSkillsChange} />
          <VolunteerHistory history={userData.volunteerHistory} />
        </div>
        <div className="md:col-span-1">
          <StatsSummary stats={userData.stats} />
        </div>
      </div>
    </div>;
};
export default ProfilePage;