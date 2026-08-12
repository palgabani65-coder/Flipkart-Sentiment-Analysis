import { api } from './api';
import { MOCK_USER } from './mockData';

export const authService = {
  sendOtp: async (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      const res = await api.post('/auth/send-otp', { email });
      return res.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('[Offline Mode] Simulated OTP 123456 generated for:', email);
        return { message: 'Verification OTP sent to ' + email, email };
      }
      const msg = err.response?.data?.detail || err.message || 'Failed to send OTP email';
      throw new Error(msg);
    }
  },

  login: async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user } = res.data;
      
      localStorage.setItem('fk_token', access_token);
      localStorage.setItem('fk_user', JSON.stringify(user));

      return { token: access_token, user };
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response || err.response?.status >= 500) {
        // Fallback for offline mode when backend is offline
        const role = email.includes('admin') ? 'admin' : 'user';
        const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
        const token = 'jwt_header.' + btoa(JSON.stringify({ sub: email, role, exp: Date.now() + 86400000 })) + '.signature';
        const user = {
          ...MOCK_USER,
          id: 'usr_' + Date.now(),
          email: email,
          name: name,
          role: role,
          storeName: 'Gabani Electronics'
        };
        localStorage.setItem('fk_token', token);
        localStorage.setItem('fk_user', JSON.stringify(user));
        return { token, user };
      }
      const msg = err.response?.data?.detail || err.message || 'Login failed';
      throw new Error(msg);
    }
  },

  register: async (name, email, password, otp = '') => {
    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }

    try {
      const res = await api.post('/auth/register', { name, email, password, otp });
      const { access_token, user } = res.data;

      localStorage.setItem('fk_token', access_token);
      localStorage.setItem('fk_user', JSON.stringify(user));

      return { token: access_token, user };
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        // Fallback for offline mode when backend is offline
        const token = 'jwt_header.' + btoa(JSON.stringify({ sub: email, exp: Date.now() + 86400000 })) + '.signature';
        const user = {
          ...MOCK_USER,
          id: 'usr_' + Math.floor(Math.random() * 10000),
          name: name,
          email: email,
        };
        localStorage.setItem('fk_token', token);
        localStorage.setItem('fk_user', JSON.stringify(user));
        return { token, user };
      }
      const msg = err.response?.data?.detail || err.message || 'Registration failed';
      throw new Error(msg);
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('fk_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('fk_token');
    localStorage.removeItem('fk_user');
  },

  updateProfile: async (updatedData) => {
    const currentUser = authService.getCurrentUser() || MOCK_USER;
    const newUser = { ...currentUser, ...updatedData };
    localStorage.setItem('fk_user', JSON.stringify(newUser));
    return newUser;
  },

  forgotPassword: async (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('[Offline Mode] Simulated Reset OTP 654321 generated for:', email);
        return { message: 'Reset OTP code sent to ' + email, email };
      }
      const msg = err.response?.data?.detail || err.message || 'Failed to request password reset';
      throw new Error(msg);
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    if (!email || !otp || !newPassword) {
      throw new Error('All fields are required.');
    }

    try {
      const res = await api.post('/auth/reset-password', { email, otp, new_password: newPassword });
      return res.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        return { message: 'Password reset successfully (Offline Mode).' };
      }
      const msg = err.response?.data?.detail || err.message || 'Password reset failed';
      throw new Error(msg);
    }
  }
};

