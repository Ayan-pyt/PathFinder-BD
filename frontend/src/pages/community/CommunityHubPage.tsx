import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp, Send, Loader2, Users, Search } from 'lucide-react';
import { communityApi } from '../../services/api/communityApi';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityHubPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['communityPosts', category],
    queryFn: () => communityApi.getPosts({ category: category !== 'All' ? category : undefined })
  });

  const createPostMutation = useMutation({
    mutationFn: () => communityApi.createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      setNewPost({ title: '', content: '', category: 'General' });
    }
  });

  const upvoteMutation = useMutation({
    mutationFn: (id: string) => communityApi.toggleUpvote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['communityPosts'] })
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string, content: string }) => communityApi.addComment(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      setCommentText(prev => ({ ...prev, [variables.id]: '' }));
    }
  });

  const posts = postsData?.data || [];
  const filteredPosts = posts.filter((p: any) => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Users size={20} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">BD Study Abroad Community</h1>
        </div>
        <p className="text-slate-500 mb-8 ml-13">Ask questions, share timelines, and help others on their journey.</p>

        {/* Create Post */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <input 
            type="text" 
            placeholder="Post Title..." 
            value={newPost.title}
            onChange={e => setNewPost({...newPost, title: e.target.value})}
            className="w-full font-bold text-lg border-none focus:outline-none focus:ring-0 mb-2 placeholder:text-slate-300"
          />
          <textarea 
            placeholder="Share your timeline, tips, or ask a question..." 
            value={newPost.content}
            onChange={e => setNewPost({...newPost, content: e.target.value})}
            className="w-full text-sm border-none focus:outline-none focus:ring-0 resize-none mb-4 min-h-24 placeholder:text-slate-400"
          />
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <select 
              value={newPost.category} 
              onChange={e => setNewPost({...newPost, category: e.target.value})}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
            >
              <option>General</option>
              <option>Timeline</option>
              <option>Tips</option>
              <option>Documents</option>
              <option>Interview</option>
            </select>
            <button 
              onClick={() => createPostMutation.mutate()}
              disabled={!newPost.title || !newPost.content || createPostMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              {createPostMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Timeline', 'Tips', 'Documents', 'Interview', 'General'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">No posts found. Be the first to post!</div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post: any) => {
              const hasUpvoted = post.upvotes.includes(user?._id);
              return (
                <div key={post._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {post.author?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{post.author?.name}</p>
                      <p className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(post.createdAt))} ago · {post.category}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => upvoteMutation.mutate(post._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${hasUpvoted ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
                    >
                      <ThumbsUp size={14} className={hasUpvoted ? 'fill-blue-600' : ''} /> {post.upvotes.length}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <MessageSquare size={14} /> {post.comments.length}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-3">
                    {post.comments.map((comment: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px] flex-shrink-0">
                          {comment.author?.name?.[0] || 'U'}
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex-1">
                          <p className="text-[10px] font-bold text-slate-800 mb-0.5">{comment.author?.name}</p>
                          <p className="text-xs text-slate-600">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="text" 
                        placeholder="Write a comment..." 
                        value={commentText[post._id] || ''}
                        onChange={e => setCommentText({...commentText, [post._id]: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && commentText[post._id] && commentMutation.mutate({ id: post._id, content: commentText[post._id] })}
                        className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button 
                        onClick={() => commentMutation.mutate({ id: post._id, content: commentText[post._id] })}
                        disabled={!commentText[post._id] || commentMutation.isPending}
                        className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
