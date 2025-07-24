// src/services/apiService.js

// ------------------------------------------------------------------
//  Base URL
// ------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// ------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------

/**
 * Build headers for fetch requests.
 * @param {boolean} isFormData - if true we skip setting Content‑Type.
 */
const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('auth_token');
    const headers = { Accept: 'application/json' };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

/**
 * Standard response handler: throws on !ok, parses JSON otherwise.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let message = 'Une erreur est survenue';
        try {
            const error = await response.json();
            message = error.message ?? JSON.stringify(error);
        } catch {
            /* empty */
        }
        throw new Error(message);
    }
    if (response.status === 204) return null; // No‑Content
    return response.json();
};

// ------------------------------------------------------------------
//  Auth
// ------------------------------------------------------------------

const auth = {
    register: async (payload) => {
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        if (data.access_token) {
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    login: async (payload) => {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        if (data.access_token) {
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    logout: async () => {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: getHeaders(),
            });
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: async () => {
        const res = await fetch(`${API_BASE_URL}/user`, { headers: getHeaders() });
        return handleResponse(res);
    },

    isAuthenticated: () => !!localStorage.getItem('auth_token'),
    getUser: () => JSON.parse(localStorage.getItem('user') ?? 'null'),
};

export const setAuthToken = (token) => {
    localStorage.setItem('auth_token', token);
};

// ------------------------------------------------------------------
//  Notifications
// ------------------------------------------------------------------

const notifications = {
    list: async () => {
        const res = await fetch(`${API_BASE_URL}/notifications`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    markRead: async (id) => {
        const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ------------------------------------------------------------------
//  Incidents
// ------------------------------------------------------------------

const incidents = {
    getAll: async (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/incidents${qs ? `?${qs}` : ''}`;

        const res = await fetch(url, { headers: getHeaders() });
        const data = await handleResponse(res);

        return data.map((i) => ({
            ...i,
            is_approved: i.is_approved === true || i.is_approved === 1,
        }));
    },

    create: async (payload) => {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });
        const res = await fetch(`${API_BASE_URL}/incidents`, {
            method: 'POST',
            headers: getHeaders(true),
            body: fd,
        });
        return handleResponse(res);
    },

    approve: async (id) => {
        const res = await fetch(`${API_BASE_URL}/incidents/${id}/approve`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    reject: async (id, reason) => {
        const res = await fetch(`${API_BASE_URL}/incidents/${id}/reject`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        return handleResponse(res);
    },

    updateStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/incidents/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(res);
    },
    getAddressFromCoordinates: async ({ lat, lng }) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Medinati360 Incident Reporting App' // Nominatim requires a User-Agent
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch address from Nominatim');
            }

            const data = await response.json();

            // The full address is in the 'display_name' property
            return data.display_name || 'Adresse introuvable';

        } catch (error) {
            console.error("Error in reverse geocoding:", error);
            return 'Impossible de déterminer l\'adresse';
        }
    },
    getCategories: async () => {
        const res = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
        return handleResponse(res);
    },
    getMyIncidents: async () => {
        const res = await fetch(`${API_BASE_URL}/my-incidents`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.map((i) => ({
            ...i,
            is_approved: i.is_approved === true || i.is_approved === 1,
        }));
    },

};

// ------------------------------------------------------------------
//  Users (admin only)
// ------------------------------------------------------------------

const users = {
    getAll: async () => {
        const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
        return handleResponse(res);
    },

    promote: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/users/${userId}/promote`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ------------------------------------------------------------------

export default {
    auth,
    incidents,
    notifications,
    users,
};
