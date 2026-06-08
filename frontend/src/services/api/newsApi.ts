import apiClient from './client';

export const newsApi = {
  getNews: async () => {
    const res = await apiClient.get('/news');
    return res.data;
  },
  createNews: async (data: {
    title: string;
    content: string;
    imageUrl?: string;
    link?: string;
    category?: string;
    isPinned?: boolean;
  }) => {
    const res = await apiClient.post('/news', data);
    return res.data;
  },
  deleteNews: async (id: string) => {
    const res = await apiClient.delete(`/news/${id}`);
    return res.data;
  },
};


// import apiClient from './client';

// export const newsApi = {
//   getNews: async () => {
//     const res = await apiClient.get('/news');
//     return res.data;
//   },
//   createNews: async (data: { title: string; content: string; imageUrl?: string; link?: string }) => {
//     const res = await apiClient.post('/news', data);
//     return res.data;
//   },
//   deleteNews: async (id: string) => {
//     const res = await apiClient.delete(`/news/${id}`);
//     return res.data;
//   }
// };
