import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      setLoading(true);
      // Set the auth token in headers
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const res = await axios.get('http://localhost:5001/api/profile');
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error('Error loading user:', err);
      
      // Handle specific error cases
      if (err.response) {
        // Server responded with an error status
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(err.response.data?.message || 'Failed to load user data');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Server not responding. Please try again later.');
      } else {
        // Error in setting up the request
        setError(err.message || 'Failed to load user data');
      }
      
      // Clear authentication data
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please provide both email and password');
        return false;
      }
      
      setLoading(true);
      setError(null); // Clear previous errors
      
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
      
      // Verify token exists in response
      if (!res.data.token) {
        throw new Error('No authentication token received');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Load user data
      await loadUser(res.data.token);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        // Request made but no response
        setError('Server not responding. Please try again later.');
      } else {
        // Error setting up request
        setError(err.message || 'Login failed');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData, profilePicture) => {
    try {
      setLoading(true);
      
      let data;
      let headers = {};
      
      if (profilePicture) {
        // With profile picture: use FormData
        data = new FormData();
        for (const key in profileData) {
          if (key === 'contactInfo' || key === 'socialLinks') {
            data.append(key, JSON.stringify(profileData[key]));
          } else {
            data.append(key, profileData[key]);
          }
        }
        data.append('profilePicture', profilePicture);
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // Without profile picture: use JSON but ensure nested objects are properly handled
        data = {
          ...profileData,
          contactInfo: profileData.contactInfo || {},
          socialLinks: profileData.socialLinks || {}
        };
        headers = { 'Content-Type': 'application/json' };
      }
      
      const res = await axios.put('http://localhost:5001/api/profile', data, { headers });
      
      setUser(res.data);
      setError(null);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};