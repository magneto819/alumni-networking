import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Filter,
  Search,
  Loader2,
  X,
  Check,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees: number;
  image_url: string;
  category: string;
  organizer_id: string;
  status: string;
  organizer?: {
    full_name: string;
  };
  registrations?: any[];
}

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_attendees: 50,
    category: '',
    image_url: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!organizer_id(full_name),
          registrations:event_registrations(count)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          organizer_id: user?.id,
          status: 'upcoming'
        }]);

      if (error) throw error;

      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_attendees: 50,
        category: '',
        image_url: ''
      });
      await loadEvents();
    } catch (err: any) {
      alert('创建活动失败: ' + err.message);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user?.id,
          status: 'registered'
        }]);

      if (error) {
        if (error.code === '23505') {
          alert('您已经报名过此活动');
        } else {
          throw error;
        }
      } else {
        alert('报名成功');
        await loadEvents();
      }
    } catch (err: any) {
      alert('报名失败: ' + err.message);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user?.id);

      if (error) throw error;
      alert('取消报名成功');
      await loadEvents();
    } catch (err: any) {
      alert('取消失败: ' + err.message);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

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
          <h1 className="text-3xl font-bold text-gray-900">活动中心</h1>
          <p className="mt-2 text-gray-600">
            参与校友活动，拓展人脉网络
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          创建活动
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索活动..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有类别</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  {event.category && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{event.description}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{new Date(event.event_date).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{event.registrations?.[0]?.count || 0} / {event.max_attendees} 人</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => handleRegister(event.id)}
                  className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  立即报名
                </button>
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
                <h2 className="text-2xl font-bold text-gray-900">创建活动</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动标题 *
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
                    活动描述 *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      活动日期 *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      最大人数 *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.max_attendees}
                      onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
                      className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动地点 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动类别 *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="聚会">聚会</option>
                    <option value="讲座">讲座</option>
                    <option value="技术">技术</option>
                    <option value="职业发展">职业发展</option>
                    <option value="体育">体育</option>
                    <option value="其他">其他</option>
                  </select>
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
                    创建活动
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
