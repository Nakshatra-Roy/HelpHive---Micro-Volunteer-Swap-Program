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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const res = await axios.get('http://localhost:5001/api/profile');
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user data');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Load user data
      await loadUser(res.data.token);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
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
      
      // Create FormData if there's a profile picture
      let data;
      if (profilePicture) {
        data = new FormData();
        // Add all profile data to FormData
        for (const key in profileData) {
          data.append(key, profileData[key]);
        }
        data.append('profilePicture', profilePicture);
      } else {
        data = profileData;
      }
      
      const res = await axios.put('http://localhost:5001/api/profile', data, {
        headers: {
          'Content-Type': profilePicture ? 'multipart/form-data' : 'application/json'
        }
      });
      
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