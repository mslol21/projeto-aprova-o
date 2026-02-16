-- ============================================
-- Row Level Security (RLS) Configuration
-- Projeto Aprovação - Supabase PostgreSQL
-- ============================================

-- IMPORTANTE: Como estamos usando JWT próprio (não Supabase Auth),
-- vamos configurar políticas que permitem acesso via service role.
-- A segurança é garantida pela nossa API com validação JWT.

-- ============================================
-- Opção 1: DESENVOLVIMENTO (Sem RLS)
-- ============================================
-- Use isso durante desenvolvimento para facilitar testes

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "StudySession" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyGoal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyNote" DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Opção 2: PRODUÇÃO (Com RLS)
-- ============================================
-- Use isso em produção para maior segurança
-- Descomente as linhas abaixo quando for para produção:

/*
-- Habilitar RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudySession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyNote" ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Enable all for service role" ON "User";
DROP POLICY IF EXISTS "Enable all for service role" ON "Subject";
DROP POLICY IF EXISTS "Enable all for service role" ON "StudySession";
DROP POLICY IF EXISTS "Enable all for service role" ON "WeeklyGoal";
DROP POLICY IF EXISTS "Enable all for service role" ON "DailyNote";

-- Criar políticas que permitem acesso via service role
-- Nossa API usa o service role key para acessar o banco
CREATE POLICY "Enable all for service role" ON "User"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for service role" ON "Subject"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for service role" ON "StudySession"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for service role" ON "WeeklyGoal"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for service role" ON "DailyNote"
  FOR ALL
  USING (true)
  WITH CHECK (true);
*/

-- ============================================
-- Índices para Performance
-- ============================================

-- Índice para buscar sessões por usuário e data (query mais comum)
CREATE INDEX IF NOT EXISTS idx_study_session_user_date 
  ON "StudySession"("userId", "createdAt" DESC);

-- Índice para buscar matérias por usuário
CREATE INDEX IF NOT EXISTS idx_subject_user 
  ON "Subject"("userId");

-- Índice para buscar metas por usuário
CREATE INDEX IF NOT EXISTS idx_weekly_goal_user 
  ON "WeeklyGoal"("userId");

-- Índice para buscar notas por usuário e data
CREATE INDEX IF NOT EXISTS idx_daily_note_user_date 
  ON "DailyNote"("userId", "date");

-- Índice para email único (já existe via @unique, mas garantindo)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email 
  ON "User"("email");

-- ============================================
-- Verificação
-- ============================================

-- Execute isso para verificar se tudo está OK:
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
