-- 获客系统数据库表

-- 线索表
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL DEFAULT '未知',
  phone TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT '未知渠道',
  note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT '新线索',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- RLS 策略
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能看自己的线索"
  ON leads FOR ALL
  USING (auth.uid() = user_id);
