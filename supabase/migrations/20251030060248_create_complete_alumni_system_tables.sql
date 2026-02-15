/*
  # 完整校友管理系统数据库架构

  1. 新增表
    - `events` - 活动表
      - `id` (uuid, primary key)
      - `title` (text) - 活动标题
      - `description` (text) - 活动描述
      - `event_date` (timestamptz) - 活动日期
      - `location` (text) - 活动地点
      - `max_attendees` (int) - 最大参与人数
      - `image_url` (text) - 活动图片
      - `category` (text) - 活动类别
      - `organizer_id` (uuid) - 组织者ID
      - `status` (text) - 状态
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `event_registrations` - 活动报名表
      - `id` (uuid, primary key)
      - `event_id` (uuid) - 活动ID
      - `user_id` (uuid) - 用户ID
      - `status` (text) - 报名状态
      - `created_at` (timestamptz)

    - `news` - 新闻表
      - `id` (uuid, primary key)
      - `title` (text) - 标题
      - `content` (text) - 内容
      - `summary` (text) - 摘要
      - `image_url` (text) - 封面图片
      - `category` (text) - 分类
      - `author_id` (uuid) - 作者ID
      - `view_count` (int) - 浏览次数
      - `published_at` (timestamptz) - 发布时间
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `news_comments` - 新闻评论表
      - `id` (uuid, primary key)
      - `news_id` (uuid) - 新闻ID
      - `user_id` (uuid) - 用户ID
      - `content` (text) - 评论内容
      - `created_at` (timestamptz)

    - `news_likes` - 新闻点赞表
      - `id` (uuid, primary key)
      - `news_id` (uuid) - 新闻ID
      - `user_id` (uuid) - 用户ID
      - `created_at` (timestamptz)

  2. 安全策略
    - 所有表启用 RLS
    - 认证用户可以查看所有内容
    - 用户只能修改自己创建的内容
    - 活动组织者可以管理自己的活动

  3. 重要说明
    - 使用 CASCADE 删除关联数据
    - 添加合适的默认值
    - 创建必要的索引提高查询性能
*/

-- 活动表
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date timestamptz NOT NULL,
  location text DEFAULT '',
  max_attendees int DEFAULT 0,
  image_url text DEFAULT '',
  category text DEFAULT '',
  organizer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 活动报名表
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'registered',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- 新闻表
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  summary text DEFAULT '',
  image_url text DEFAULT '',
  category text DEFAULT '',
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  view_count int DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 新闻评论表
CREATE TABLE IF NOT EXISTS news_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid REFERENCES news(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 新闻点赞表
CREATE TABLE IF NOT EXISTS news_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid REFERENCES news(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(news_id, user_id)
);

-- 启用 RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;

-- 活动表策略
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- 活动报名表策略
CREATE POLICY "Anyone can view registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 新闻表策略
CREATE POLICY "Anyone can view news"
  ON news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own news"
  ON news FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own news"
  ON news FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- 新闻评论表策略
CREATE POLICY "Anyone can view comments"
  ON news_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON news_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON news_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON news_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 新闻点赞表策略
CREATE POLICY "Anyone can view likes"
  ON news_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like news"
  ON news_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike news"
  ON news_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_comments_news ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_news ON news_likes(news_id);