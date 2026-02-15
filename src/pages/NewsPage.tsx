import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  X,
  Loader2,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  image_url: string;
  category: string;
  author_id: string;
  view_count: number;
  published_at: string;
  author?: {
    full_name: string;
  };
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

export const NewsPage: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          author:profiles!author_id(full_name)
        `)
        .order('published_at', { ascending: false });

      if (error) throw error;

      const newsWithCounts = await Promise.all(
        (data || []).map(async (item) => {
          const [likesResult, commentsResult, userLikeResult] = await Promise.all([
            supabase.from('news_likes').select('id', { count: 'exact' }).eq('news_id', item.id),
            supabase.from('news_comments').select('id', { count: 'exact' }).eq('news_id', item.id),
            supabase.from('news_likes').select('id').eq('news_id', item.id).eq('user_id', user?.id).maybeSingle()
          ]);

          return {
            ...item,
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
            user_has_liked: !!userLikeResult.data
          };
        })
      );

      setNews(newsWithCounts);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('news')
        .insert([{
          ...formData,
          author_id: user?.id
        }]);

      if (error) throw error;

      setShowCreateModal(false);
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: ''
      });
      await loadNews();
    } catch (err: any) {
      alert('发布失败: ' + err.message);
    }
  };

  const handleLike = async (newsId: string) => {
    try {
      const newsItem = news.find(n => n.id === newsId);
      if (newsItem?.user_has_liked) {
        await supabase
          .from('news_likes')
          .delete()
          .eq('news_id', newsId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('news_likes')
          .insert([{
            news_id: newsId,
            user_id: user?.id
          }]);
      }
      await loadNews();
    } catch (err: any) {
      alert('操作失败: ' + err.message);
    }
  };

  const loadComments = async (newsId: string) => {
    try {
      const { data, error } = await supabase
        .from('news_comments')
        .select(`
          *,
          user:profiles!user_id(full_name)
        `)
        .eq('news_id', newsId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddComment = async (newsId: string) => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('news_comments')
        .insert([{
          news_id: newsId,
          user_id: user?.id,
          content: newComment
        }]);

      if (error) throw error;

      setNewComment('');
      await loadComments(newsId);
      await loadNews();
    } catch (err: any) {
      alert('评论失败: ' + err.message);
    }
  };

  const handleIncrementView = async (newsId: string) => {
    try {
      const newsItem = news.find(n => n.id === newsId);
      if (newsItem) {
        await supabase
          .from('news')
          .update({ view_count: newsItem.view_count + 1 })
          .eq('id', newsId);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const openComments = (newsId: string) => {
    setSelectedNews(newsId);
    loadComments(newsId);
    handleIncrementView(newsId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">校友动态</h1>
          <p className="mt-2 text-gray-600">
            了解最新的校友资讯和行业动态
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          发布动态
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              {item.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
                  {item.category}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {item.summary || item.content}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{item.author?.full_name || '匿名'}</span>
                <span className="mx-2">·</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(item.published_at).toLocaleDateString('zh-CN')}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${item.user_has_liked ? 'fill-red-600 text-red-600' : ''}`} />
                    <span className="text-sm">{item.likes_count}</span>
                  </button>
                  <button
                    onClick={() => openComments(item.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{item.comments_count}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{item.view_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">发布动态</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateNews} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类 *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="校友成就">校友成就</option>
                    <option value="学校新闻">学校新闻</option>
                    <option value="行业资讯">行业资讯</option>
                    <option value="职业发展">职业发展</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    摘要
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="简要描述..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容 *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="详细内容..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    发布
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">评论</h2>
                <button
                  onClick={() => {
                    setSelectedNews(null);
                    setComments([]);
                    setNewComment('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAddComment(selectedNews)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {comment.user?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.user?.full_name || '匿名'}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 py-8">暂无评论</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
