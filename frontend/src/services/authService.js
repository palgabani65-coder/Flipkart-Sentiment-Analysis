import { MOCK_USER } from './mockData';

export const authService = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    // Generate simulated JWT
    const token = 'jwt_header.' + btoa(JSON.stringify({ sub: email, role: 'user', exp: Date.now() + 86400000 })) + '.signature';
    const user = {
      ...MOCK_USER,
      email: email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };

    localStorage.setItem('fk_token', token);
    localStorage.setItem('fk_user', JSON.stringify(user));

    return { token, user };
  },

  register: async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }

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
    await new Promise((resolve) => setTimeout(resolve, 600));
    const currentUser = authService.getCurrentUser() || MOCK_USER;
    const newUser = { ...currentUser, ...updatedData };
    localStorage.setItem('fk_user', JSON.stringify(newUser));
    return newUser;
  }
};
