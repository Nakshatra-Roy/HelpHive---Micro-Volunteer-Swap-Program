import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileHeader from '../components/ProfileHeader'
import ProfileDetails from '../components/ProfileDetails'
import SkillsSection from '../components/SkillSection'
import StatsSummary from '../components/StatsSummary'
import VolunteerHistory from '../components/VolunteerHistory'
import './ProfilePage.css' // Import the new stylesheet
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
  volunteerHistory: [
    { id: "task1", description: "Helped with garden cleanup at community center", date: "2023-06-15", credits: 15, type: "earned" },
    { id: "task2", description: "Received computer setup assistance", date: "2023-05-22", credits: 10, type: "spent" },
    { id: "task3", description: "Tutored high school student in math", date: "2023-04-10", credits: 20, type: "earned" },
    { id: "task4", description: "Pet sitting for neighbor's cat", date: "2023-03-05", credits: 25, type: "earned" },
    { id: "task5", description: "Received help with furniture moving", date: "2023-02-18", credits: 30, type: "spent" }
  ]
}
const ProfilePage = () => {
  const { user, loading, updateProfile } = useAuth()
  const [userData, setUserData] = useState(user || mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!loading && !user && !localStorage.getItem('token')) {
      navigate('/login')
    }
    if (user) {
      setUserData(user)
    }
  }, [user, loading, navigate])
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes to the backend
      const success = await updateProfile(userData, profilePicture)
      if (success) {
        setProfilePicture(null)
      }
    }
    setIsEditing(!isEditing)
  }
  const handleDataChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }))
  }
  
  const handleProfilePictureChange = (file) => {
    setProfilePicture(file)
  }
  const handleContactChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        [field]: value
      }
    }))
  }
  const handleSkillsChange = (type, skills) => {
    setUserData(prevData => ({
      ...prevData,
      [type]: skills
    }))
  }
  return (
    <div className="profile-page-container">
      <ProfileHeader 
        user={userData} 
        isEditing={isEditing} 
        onEditToggle={handleEditToggle} 
        onDataChange={handleDataChange}
        onProfilePictureChange={handleProfilePictureChange}
      />
      <div className="grid-layout">
        <div className="main-column">
          <ProfileDetails 
            user={userData} 
            isEditing={isEditing} 
            onDataChange={handleDataChange}
            onContactChange={handleContactChange}
          />
          <SkillsSection 
            skillsToOffer={userData.skillsToOffer}
            skillsToReceive={userData.skillsToReceive}
            isEditing={isEditing}
            onSkillsChange={handleSkillsChange}
          />
          <VolunteerHistory history={userData.volunteerHistory} />
        </div>
        <div className="side-column">
          <StatsSummary stats={userData.stats} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage