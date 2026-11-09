export const API_ROOT_URL = "http://localhost:5000/api";
export const API_BASE_URL = `${API_ROOT_URL}/auth`;

export function authenticatedFetch(path, options = {}, baseUrl = API_BASE_URL) {
    const token = localStorage.getItem("token");

    return fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });
}
