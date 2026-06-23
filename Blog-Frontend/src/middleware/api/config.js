const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Core request wrapper
 */
async function request(endpoint = '', options = {}) {
    const cleanBase = BASE_URL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // If body is FormData (file upload), let browser set Content-Type
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = {
        method: options.method || 'GET',
        credentials: 'include', // CRITICAL: This sends cookies automatically
        headers: headers,
        body: options.body,
    };

    try {
        const response = await fetch(url, config);

        // Handle 204 No Content
        if (response.status === 204) {
            return { success: true, status: response.status };
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
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

export const api = {
    get: (endpoint, options = {}) => 
        request(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) => 
        request(endpoint, { 
            ...options, 
            method: 'POST', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),

    put: (endpoint, body, options = {}) => 
        request(endpoint, { 
            ...options, 
            method: 'PUT', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),

    delete: (endpoint, options = {}) => 
        request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
