-- Kuki AI Supabase Database Schema
-- 在 Supabase SQL Editor 中运行此文件来初始化数据库

-- ============================================
-- 1. 店铺表
-- ============================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('美团', '大众点评', '携程', '抖音', '小红书', '淘宝', '京东', '拼多多', '抖音小店', '其他')),
  platform_store_id TEXT,
  access_token TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'expired')),
  review_count INTEGER DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: 用户只能访问自己的店铺
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stores" ON stores
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 2. 评论表
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_review_id TEXT,
  buyer_name TEXT NOT NULL,
  buyer_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  product_name TEXT,
  product_id TEXT,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'ignored')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. AI 回复表
-- ============================================
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'edited')),
  is_ai_generated BOOLEAN DEFAULT true,
  edited_by_user BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own replies" ON replies
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 6. 口碑周报表
-- ============================================
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT,
  total_reviews INTEGER DEFAULT 0,
  good_reviews INTEGER DEFAULT 0,
  bad_reviews INTEGER DEFAULT 0,
  top_issues JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  reply_examples JSONB DEFAULT '[]',
  invite_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own weekly reports" ON weekly_reports
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 4. 用户订阅表
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired')),
  daily_reply_limit INTEGER DEFAULT 3,
  store_limit INTEGER DEFAULT 1,
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 month'),
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  payment_method TEXT DEFAULT 'wechat' CHECK (payment_method IN ('wechat', 'alipay', 'none')),
  payment_note TEXT,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 5. 用户配置表
-- ============================================
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  default_tone TEXT DEFAULT 'professional' CHECK (default_tone IN ('professional', 'friendly', 'apologetic', 'enthusiastic')),
  auto_publish_good BOOLEAN DEFAULT true,
  auto_publish_medium BOOLEAN DEFAULT false,
  auto_publish_bad BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'zh' CHECK (language IN ('zh', 'en')),
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_replies_review_id ON replies(review_id);
CREATE INDEX idx_replies_user_id ON replies(user_id);

-- ============================================
-- 触发器: 自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tg_replies_updated_at
  BEFORE UPDATE ON replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 新用户注册时自动创建订阅和配置
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id) VALUES (NEW.id);
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. 会议纪要表
-- ============================================
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  raw_content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'audio')),
  audio_url TEXT,
  summary TEXT DEFAULT '',
  decisions JSONB DEFAULT '[]'::jsonb,
  key_points JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'deleted')),
  duration_minutes INTEGER,
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own meetings" ON meetings
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_status ON meetings(status);

-- ============================================
-- 7. 会议待办事项表
-- ============================================
CREATE TABLE meeting_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  assignee TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMPTZ,
  category TEXT DEFAULT '餐饮' CHECK (category IN ('餐饮', '酒店/民宿', '美容美发', '口腔诊所', '休闲娱乐', '奶茶/咖啡', '其他')),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meeting_action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own action items" ON meeting_action_items
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_action_items_meeting_id ON meeting_action_items(meeting_id);
CREATE INDEX idx_action_items_user_id ON meeting_action_items(user_id);

CREATE TRIGGER tg_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tg_meeting_action_items_updated_at
  BEFORE UPDATE ON meeting_action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- MVP: Paid phones whitelist (for WeChat Pay manual activation)
-- No auth required — users verify by phone number
-- ============================================
CREATE TABLE IF NOT EXISTS paid_phones (
  phone TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  duration_days INT NOT NULL DEFAULT 14,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paid_phones_expires ON paid_phones(expires_at);

-- ============================================
-- CRM: Leads tracking (for sales pipeline)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  store_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  platform TEXT DEFAULT '大众点评',
  rating DECIMAL(2,1),
  industry TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','demoed','negotiating','won','lost')),
  notes TEXT,
  source TEXT DEFAULT 'manual',
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_updated ON leads(updated_at DESC);

-- ============================================
-- Migration: Remove hardcoded platform CHECK for global scalability
-- Run these after adding the application-level validation:
--
-- ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_platform_check;
-- ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_platform_check;
-- ============================================
