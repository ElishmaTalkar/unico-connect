export const generateQueryString = (filters = {}) => {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(filters)) {
        if (val !== undefined && val !== null && val !== '') {
            params.set(key, val);
        }
    }
    const str = params.toString();
    return str ? `?${str}` : '';
};
