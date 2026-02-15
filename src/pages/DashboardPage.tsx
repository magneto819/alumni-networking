import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  MessageCircle,
  TrendingUp,
  UserPlus,
  Activity,
  Bell,
  Star,
  Loader2,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalEvents: 0,
    totalNews: 0,
    myRegistrations: 0
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [alumniResult, eventsResult, newsResult, registrationsResult, upcomingEventsResult, latestNewsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('event_registrations').select('id', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3),
        supabase.from('news').select('*, author:profiles!author_id(full_name)').order('published_at', { ascending: false }).limit(3)
      ]);

      setStats({
        totalAlumni: alumniResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalNews: newsResult.count || 0,
        myRegistrations: registrationsResult.count || 0
      });

      setRecentEvents(upcomingEventsResult.data || []);
      setRecentNews(latestNewsResult.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statsData = [
    {
      name: t('dashboard.totalAlumni'),
      value: stats.totalAlumni.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: t('dashboard.totalEvents'),
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: t('dashboard.myRegistrations'),
      value: stats.myRegistrations.toString(),
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: t('dashboard.totalNews'),
      value: stats.totalNews.toString(),
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
            <p className="mt-1 text-blue-100">
              今天是 {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="hidden sm:block">
            <Bell className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Moved to top */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-blue-600 mr-2" />
          {t('dashboard.quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/app/alumni"
            className="group flex flex-col items-center p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 hover:shadow-md border border-blue-100"
          >
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{t('dashboard.searchAlumni')}</span>
          </Link>
          <Link
            to="/app/events"
            className="group flex flex-col items-center p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-300 hover:shadow-md border border-green-100"
          >
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow mb-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{t('dashboard.browseEvents')}</span>
          </Link>
          <Link
            to="/app/news"
            className="group flex flex-col items-center p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 hover:shadow-md border border-purple-100"
          >
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{t('dashboard.viewNews')}</span>
          </Link>
          <Link
            to="/app/profile"
            className="group flex flex-col items-center p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl transition-all duration-300 hover:shadow-md border border-orange-100"
          >
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow mb-3">
              <UserPlus className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{t('dashboard.editProfile')}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{t('dashboard.upcomingEvents')}</h3>
              </div>
              <Link to="/app/events" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                {t('dashboard.viewAll')}
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(event.event_date).toLocaleDateString('zh-CN')}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{event.location}</p>
                    {event.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                {t('dashboard.noEvents')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{t('dashboard.latestNews')}</h3>
              </div>
              <Link to="/app/news" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                {t('dashboard.viewAll')}
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentNews.length > 0 ? (
              recentNews.map((news) => (
                <div key={news.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{news.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{news.author?.full_name || t('common.anonymous')}</span>
                      <span className="mx-2">·</span>
                      <span>{new Date(news.published_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                    {news.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {news.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                {t('dashboard.noNews')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
