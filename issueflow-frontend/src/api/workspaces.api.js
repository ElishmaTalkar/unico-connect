import api from './axios';

export const getUserWorkspaces = () => api.get('/api/workspaces').then(r => r.data);
export const createWorkspace = (data) => api.post('/api/workspaces', data).then(r => r.data);
export const joinWorkspace = (data) => api.post('/api/workspaces/join', data).then(r => r.data);
export const getWorkspace = (workspaceId) => api.get(`/api/workspaces/${workspaceId}`).then(r => r.data);
