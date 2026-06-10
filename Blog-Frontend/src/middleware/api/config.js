const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log(BASE_URL);

/**
 * Helper to retrieve authentication headers
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('TOKS');
    return token ? { 'Authorization': `Bearer ${token}`} : {};
};

/**
 * Core request wrapper
 * @param {string} endpoint - The target endpoint
 * @param {Object} options - Fetch options
 */
async function request(endpoint = '', options = {}) {
    const cleanBase = BASE_URL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };

    // If body is FormData (e.g., uploading files), delete Content-Type to let the browser set boundary
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Handle 204 No Content
        if (response.status === 204) {
            return { success: true, status: response.status };
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // Extract error message from API response if present
            const errorMsg = data?.message || data?.error || `HTTP error! status: ${response.status}`;
            const error = new Error(errorMsg);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
        throw error;
    }
}

/**
 * Custom API client middleware
 */
export const api = {
    /**
     * Perform a GET request
     * @param {string} endpoint 
     * @param {Object} options 
     */
    get: (endpoint, options = {}) => 
        request(endpoint, { ...options, method: 'GET' }),

    /**
     * Perform a POST request
     * @param {string} endpoint 
     * @param {Object} body 
     * @param {Object} options 
     */
    post: (endpoint, body, options = {}) => 
        request(endpoint, { 
            ...options, 
            method: 'POST', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),

    /**
     * Perform a PUT request
     * @param {string} endpoint 
     * @param {Object} body 
     * @param {Object} options 
     */
    put: (endpoint, body, options = {}) => 
        request(endpoint, { 
            ...options, 
            method: 'PUT', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),

    /**
     * Perform a DELETE request
     * @param {string} endpoint 
     * @param {Object} options 
     */
    delete: (endpoint, options = {}) => 
        request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
