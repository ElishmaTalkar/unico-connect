import api from './axios';

export const getComments = (wsId, issueId) =>
    api.get(`/api/workspaces/${wsId}/issues/${issueId}/comments`).then(r => r.data);

export const addComment = (wsId, issueId, data) =>
    api.post(`/api/workspaces/${wsId}/issues/${issueId}/comments`, data).then(r => r.data);
