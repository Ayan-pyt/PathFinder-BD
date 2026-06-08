import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { newsApi } from '../../services/api/newsApi';
import { useAuthStore } from '../../store/authStore';

export default function AdminNewsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '', link: '' });

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getNews
  });

  const createMutation = useMutation({
    mutationFn: () => newsApi.createNews(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setNewPost({ title: '', content: '', imageUrl: '', link: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsApi.deleteNews(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] })
  });

  if (user?.role !== 'admin') {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied. Admin only.</div>;
  }

  const news = newsData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Admin News Dashboard</h1>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-12">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18} /> Create News Post</h2>
          <div className="space-y-4">
            <input 
              type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <textarea 
              placeholder="Content..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" placeholder="Image URL (optional)" value={newPost.imageUrl} onChange={e => setNewPost({...newPost, imageUrl: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" placeholder="Link URL (optional)" value={newPost.link} onChange={e => setNewPost({...newPost, link: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button 
              onClick={() => createMutation.mutate()}
              disabled={!newPost.title || !newPost.content || createMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-blue-700"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : 'Publish News'}
            </button>
          </div>
        </div>

        <h2 className="font-bold text-slate-800 mb-4">Manage Existing News</h2>
        {isLoading ? <Loader2 className="animate-spin text-blue-600 mx-auto" /> : (
          <div className="space-y-4">
            {news.map((item: any) => (
              <div key={item._id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.content}</p>
                </div>
                <button 
                  onClick={() => deleteMutation.mutate(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-4 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
