import api from './axios';

export const getProjects = (wsId) => api.get(`/api/workspaces/${wsId}/projects`).then(r => r.data);
export const createProject = (wsId, data) => api.post(`/api/workspaces/${wsId}/projects`, data).then(r => r.data);
