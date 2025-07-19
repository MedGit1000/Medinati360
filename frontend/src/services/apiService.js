// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper pour gérer les headers
const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Accept': 'application/json',
    };

    // Ne pas ajouter Content-Type pour FormData (le navigateur le fait automatiquement)
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Helper pour gérer les réponses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
};

// Service API
const apiService = {
    // Auth
    auth: {
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(userData)
            });
            const data = await handleResponse(response);
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        },

        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(credentials)
            });
            const data = await handleResponse(response);
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        },

        logout: async () => {
            // Si vous ajoutez une route logout dans Laravel
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: getHeaders()
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        },

        getCurrentUser: async () => {
            const response = await fetch(`${API_BASE_URL}/user`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        },

        isAuthenticated: () => {
            return !!localStorage.getItem('auth_token');
        },

        getUser: () => {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
    },

    // Incidents


    incidents: {
        getAll: async (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/incidents${queryString ? '?' + queryString : ''}`;

            console.log('🔍 Fetching incidents from:', url);
            console.log('🔍 With headers:', getHeaders());

            const response = await fetch(url, {
                headers: getHeaders()
            });

            console.log('🔍 Response status:', response.status);

            const data = await handleResponse(response);

            console.log('🔍 Raw data from API:', data);
            console.log('🔍 Number of incidents:', data.length);

            // Log each incident's approval status
            data.forEach((incident, index) => {
                console.log(`🔍 Incident ${index + 1}:`, {
                    id: incident.id,
                    title: incident.title,
                    is_approved: incident.is_approved,
                    rejection_reason: incident.rejection_reason,
                    user_id: incident.user_id,
                    created_at: incident.created_at
                });
            });

            // Ensure is_approved is boolean
            const normalizedData = data.map(incident => ({
                ...incident,
                is_approved: incident.is_approved === true || incident.is_approved === 1
            }));

            return normalizedData;
        },

        approve: async (id) => {
            const response = await fetch(`${API_BASE_URL}/incidents/${id}/approve`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({})
            });
            return handleResponse(response);
        },

        reject: async (id, reason) => {
            const response = await fetch(`${API_BASE_URL}/incidents/${id}/reject`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ reason })
            });
            return handleResponse(response);
        },

        updateStatus: async (id, status) => {
            const response = await fetch(`${API_BASE_URL}/incidents/${id}/status`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ status })
            });
            return handleResponse(response);
        }
    }
};

export default apiService;