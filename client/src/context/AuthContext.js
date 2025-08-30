import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token = localStorage.getItem('token')) => {
    if (!token) throw new Error('No authentication token found');
    
    try {
      setLoading(true);
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const res = await axios.get('http://localhost:5001/api/profile');
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error('Error loading user:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(err.response.data?.message || 'Failed to load user data');
        }
      } else if (err.request) {
        setError('Server not responding. Please try again later.');
      } else {
        setError(err.message || 'Failed to load user data');
      }
      
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        setError('Please provide both email and password');
        return false;
      }
      
      setLoading(true);
      setError(null); 
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
      
      if (!res.data.token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('token', res.data.token);
      
      await loadUser(res.data.token);
      return true;
    } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
        setError(err.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('Server not responding. Please try again later.');
      } else {
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
      // Without profile picture: send stringified JSON
      data = JSON.stringify({
        ...profileData,
        contactInfo: profileData.contactInfo || {},
        socialLinks: profileData.socialLinks || {}
      });
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