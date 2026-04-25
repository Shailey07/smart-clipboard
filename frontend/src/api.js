import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const createSession = () => API.post('/sessions');
export const validateSession = (code, password) => API.post('/sessions/validate', { code, password });
export const getSession = (sessionId) => API.get(`/sessions/${sessionId}`);
export const uploadFile = (sessionId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post(`/sessions/${sessionId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const getFiles = (sessionId) => API.get(`/sessions/${sessionId}/files`);
export const deleteFile = (sessionId, fileId) => API.delete(`/sessions/${sessionId}/files/${fileId}`);
export const downloadFileUrl = (sessionId, fileId) => `/api/sessions/${sessionId}/files/${fileId}/download`;