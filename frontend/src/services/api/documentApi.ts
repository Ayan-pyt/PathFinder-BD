import apiClient from './client';

export interface Document {
  _id: string;
  user: string;
  category: 'student_vault' | 'academic' | 'financial' | 'visa' | 'custom';
  customCategoryName?: string;
  documentType: string;
  displayName: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  notes?: string;
  documentDate?: string;
  expiryDate?: string;
  uploadedAt: string;
  createdAt: string;
  isActive: boolean;
}

export const documentApi = {
  // Vault methods
  getUserVault: async () => {
    const res = await apiClient.get('/documents/vault');
    return res.data.data;
  },
  
  uploadDocument: async (formData: FormData) => {
    const res = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },
  
  getDocument: async (id: string) => {
    const res = await apiClient.get(`/documents/${id}`);
    return res.data.data;
  },
  
  updateDocument: async (id: string, data: Partial<Document>) => {
    const res = await apiClient.put(`/documents/${id}`, data);
    return res.data.data;
  },
  
  deleteDocument: async (id: string) => {
    const res = await apiClient.delete(`/documents/${id}`);
    return res.data;
  },
  
  // Keep for compatibility (can be deprecated)
  getChecklist: async (universityId: string) => {
    const res = await apiClient.get(`/documents/checklist/${universityId}`);
    return res.data;
  },
};


// import apiClient from './client';

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
// }

// export interface DocumentChecklistItem {
//   name: string;
//   required: boolean;
//   status?: string;
//   category: string;
// }

// export interface DocumentChecklistResponse {
//   universityId: string;
//   checklist: DocumentChecklistItem[];
//   completedCount: number;
//   totalCount: number;
// }

// export const documentApi = {
//   getChecklist: async (universityId: string) => {
//     const res = await apiClient.get<ApiResponse<DocumentChecklistResponse>>(`/documents/checklist/${universityId}`);
//     return res.data.data;
//   },
//   getUserDocuments: async () => {
//     const res = await apiClient.get('/documents');
//     return res.data.data;
//   },
//   createDocument: async (payload: object) => {
//     const res = await apiClient.post('/documents', payload);
//     return res.data.data;
//   },
//   updateDocument: async (id: string, payload: object) => {
//     const res = await apiClient.put(`/documents/${id}`, payload);
//     return res.data.data;
//   },
//   deleteDocument: async (id: string) => {
//     const res = await apiClient.delete(`/documents/${id}`);
//     return res.data;
//   },
// };
