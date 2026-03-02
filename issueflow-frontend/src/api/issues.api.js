import api from './axios';
import { generateQueryString } from '../utils/generateQueryString';

const base = (wsId) => `/api/workspaces/${wsId}/issues`;

export const getIssues = (wsId, filters) => api.get(`${base(wsId)}${generateQueryString(filters)}`).then(r => r.data);
export const getIssue = (wsId, id) => api.get(`${base(wsId)}/${id}`).then(r => r.data);
export const createIssue = (wsId, data) => api.post(base(wsId), data).then(r => r.data);
export const updateIssue = (wsId, id, data) => api.patch(`${base(wsId)}/${id}`, data).then(r => r.data);
export const deleteIssue = (wsId, id) => api.delete(`${base(wsId)}/${id}`);
export const exportCSV = (wsId, filters) =>
    api.get(`${base(wsId)}/export${generateQueryString(filters)}`, { responseType: 'blob' }).then(r => r.data);
