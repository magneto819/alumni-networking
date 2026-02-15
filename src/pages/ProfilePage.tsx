import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Briefcase,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
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
  avatar_url: string;
  phone?: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    company: '',
    position: '',
    graduation_year: '',
    major: '',
    industry: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          company: data.company || '',
          position: data.position || '',
          graduation_year: data.graduation_year || '',
          major: data.major || '',
          industry: data.industry || '',
          bio: data.bio || ''
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccess('资料更新成功');
      setIsEditing(false);
      await loadProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('保存失败: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        company: profile.company || '',
        position: profile.position || '',
        graduation_year: profile.graduation_year || '',
        major: profile.major || '',
        industry: profile.industry || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('文件大小不能超过 2MB');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('只支持 JPG、PNG 和 WebP 格式的图片');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setUploading(true);
      setError('');

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('头像上传成功');
      await loadProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('上传失败: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
          <p className="mt-2 text-gray-600">
            管理您的个人信息和校友网络档案
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              编辑资料
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                保存
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-600"></div>

        <div className="relative px-6 pb-6">
          <div className="flex items-end -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-white" />
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
            </div>
            <div className="ml-6 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">在线</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-lg font-medium text-gray-900">{profile?.full_name || '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{profile?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电话
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.phone || '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所在地区
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.location || '未设置'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.company || '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.position || '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  毕业年份
                </label>
                {isEditing ? (
                  <select
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.graduation_year ? `${profile.graduation_year}届` : '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  专业
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile?.major || '未设置'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              行业
            </label>
            {isEditing ? (
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择行业</option>
                <option value="科技">科技</option>
                <option value="金融">金融</option>
                <option value="教育">教育</option>
                <option value="医疗">医疗</option>
                <option value="制造业">制造业</option>
                <option value="咨询">咨询</option>
                <option value="房地产">房地产</option>
                <option value="零售">零售</option>
                <option value="媒体">媒体</option>
                <option value="政府机构">政府机构</option>
                <option value="其他">其他</option>
              </select>
            ) : (
              <p className="text-gray-900">{profile?.industry || '未设置'}</p>
            )}
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              个人简介
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="介绍一下自己..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile?.bio || '暂无简介'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
