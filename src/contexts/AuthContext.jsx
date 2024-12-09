import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState(null);

  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginRedirect = () => {
    const dovuchchaLoginUrl = 'https://accounts.dovuchcha.uz/login';
    const redirectUrl = `${window.location.origin}/`;

    const fullLoginUrl = `${dovuchchaLoginUrl}?redirection=${encodeURIComponent(redirectUrl)}`;
    console.log('Redirecting to:', fullLoginUrl);

    window.location.href = fullLoginUrl;
  };

  const handleRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('refresh_token');

    if (token) {
      setRefreshToken(token);
      localStorage.setItem('refresh_token', token);

      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setEmail(decoded.email);
      setId(decoded.user_id)
      setIsAuthenticated(true);

      window.history.replaceState({}, document.title, '/');
    }
  };

  const fetchAccessToken = async (token) => {
    try {
      const response = await axios.post('https://behzod.pythonanywhere.com/api/token/refresh/', {
        refresh: token,
      });
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
      localStorage.setItem('access_token', newAccessToken);
    } catch (error) {
      console.error('Failed to fetch access token:', error);
      handleLogout();
    }
  };

  const setupTokenRenewal = (token) => {
    setInterval(() => {
      fetchAccessToken(token);
    }, 240000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setEmail('');
    setId(null)
    setRefreshToken('');
    setAccessToken('');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
  };

  useEffect(() => {
    handleRedirect();

    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);

      const decoded = jwtDecode(storedRefreshToken);
      setUsername(decoded.username);
      setEmail(decoded.email);
      setId(decoded.user_id)
      setIsAuthenticated(true);

      fetchAccessToken(storedRefreshToken);

      setupTokenRenewal(storedRefreshToken);
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        email,
        id,
        accessToken,
        handleLoginRedirect,
        handleLogout,
        setIsAuthenticated,
        setUsername,
        setEmail,
        setAccessToken,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};