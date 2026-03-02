import api from './axios';

export const getMembers = (wsId) => api.get(`/api/workspaces/${wsId}/members`).then(r => r.data);
