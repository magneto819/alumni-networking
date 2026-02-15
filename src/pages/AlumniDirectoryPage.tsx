import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building,
  Calendar,
  Mail,
  MessageCircle,
  UserPlus,
  Loader2,
  User
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AlumniProfile {
  id: string;
  email: string;
  full_name: string;
  graduation_year: string;
  major: string;
  company: string;
  position: string;
  location: string;
  industry: string;
  bio: string;
}

export const AlumniDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlumni(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch =
      person.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.major?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !selectedYear || person.graduation_year === selectedYear;
    const matchesIndustry = !selectedIndustry || person.industry === selectedIndustry;
    const matchesLocation = !selectedLocation || person.location === selectedLocation;

    return matchesSearch && matchesYear && matchesIndustry && matchesLocation;
  });

  const graduationYears = [...new Set(alumni.map(p => p.graduation_year).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const industries = [...new Set(alumni.map(p => p.industry).filter(Boolean))].sort();
  const locations = [...new Set(alumni.map(p => p.location).filter(Boolean))].sort();

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
          <h1 className="text-3xl font-bold text-gray-900">校友目录</h1>
          <p className="mt-2 text-gray-600">
            发现和联系优秀的校友们
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            共找到 {filteredAlumni.length} 位校友
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索姓名、公司、职位或专业..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有年份</option>
              {graduationYears.map(year => (
                <option key={year} value={year}>{year}届</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有行业</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有地区</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="md:col-start-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedYear('');
                setSelectedIndustry('');
                setSelectedLocation('');
              }}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              清除筛选
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <div
            key={person.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {person.full_name || '未设置姓名'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {person.graduation_year ? `${person.graduation_year}届` : ''}
                    {person.graduation_year && person.major ? ' · ' : ''}
                    {person.major || ''}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {person.company && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{person.company}</span>
                  </div>
                )}
                {person.position && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{person.position}</span>
                  </div>
                )}
                {person.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span>{person.location}</span>
                  </div>
                )}
                {person.industry && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {person.industry}
                    </span>
                  </div>
                )}
              </div>

              {person.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{person.bio}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  私信
                </button>
                <button className="bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <UserPlus className="h-4 w-4" />
                </button>
                <button className="bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到匹配的校友</h3>
          <p className="mt-1 text-sm text-gray-500">
            尝试调整搜索条件或筛选器
          </p>
        </div>
      )}
    </div>
  );
};
