// authProvider.js

const API_URL = 'http://localhost:8080/api';

const authProvider = {
    login: ({ username, password }) => {
        return fetch(`${API_URL}/login_check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }
            return response.json();
        })
        .then(({ token }) => {
            localStorage.setItem('token', token);
            console.log('Login successful, token stored');
        })
        .catch(error => {
            console.error('Login error:', error);
            throw error;
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        console.log('Logout successful');
        return Promise.resolve();
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        return token ? Promise.resolve() : Promise.reject();
    },

    getPermissions: () => Promise.resolve(),

    checkError: error => {
        console.log('Auth error check:', error);
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
};

export default authProvider;