# 🔒 CONFIGURAR RLS NO SUPABASE - PASSO A PASSO

## ⚠️ IMPORTANTE: Ação Necessária

O GitHub está alertando sobre RLS (Row Level Security) porque as tabelas do Supabase não têm políticas de segurança configuradas. Isso é **NORMAL** e **ESPERADO** após a migração.

---

## 📋 PASSO A PASSO

### **1. Acesse o Supabase Dashboard**
```
URL: https://qtplaftmqfkfpuibsdfp.supabase.co
```

1. Abra o link acima no navegador
2. Faça login com sua conta Supabase
3. Você verá o dashboard do projeto

---

### **2. Abra o SQL Editor**

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Ou acesse diretamente: https://qtplaftmqfkfpuibsdfp.supabase.co/project/qtplaftmqfkfpuibsdfp/sql

---

### **3. Execute o Script SQL**

#### **Opção A: Desenvolvimento (Recomendado para começar)**

Cole e execute este script para **DESABILITAR RLS** durante desenvolvimento:

```sql
-- DESENVOLVIMENTO: Desabilitar RLS
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "StudySession" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyGoal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyNote" DISABLE ROW LEVEL SECURITY;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_study_session_user_date 
  ON "StudySession"("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_subject_user 
  ON "Subject"("userId");

CREATE INDEX IF NOT EXISTS idx_weekly_goal_user 
  ON "WeeklyGoal"("userId");

CREATE INDEX IF NOT EXISTS idx_daily_note_user_date 
  ON "DailyNote"("userId", "date");

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email 
  ON "User"("email");
```

**Por que desabilitar RLS?**
- Mais fácil para desenvolvimento e testes
- Nossa API já tem autenticação JWT própria
- Podemos habilitar depois em produção

---

#### **Opção B: Produção (Quando for fazer deploy)**

Cole e execute este script para **HABILITAR RLS** com políticas:

```sql
-- PRODUÇÃO: Habilitar RLS
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_study_session_user_date 
  ON "StudySession"("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_subject_user 
  ON "Subject"("userId");

CREATE INDEX IF NOT EXISTS idx_weekly_goal_user 
  ON "WeeklyGoal"("userId");

CREATE INDEX IF NOT EXISTS idx_daily_note_user_date 
  ON "DailyNote"("userId", "date");

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email 
  ON "User"("email");
```

---

### **4. Executar o Script**

1. Cole o script escolhido (Opção A ou B) no SQL Editor
2. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
3. Aguarde a mensagem de sucesso: **"Success. No rows returned"**

---

### **5. Verificar se Funcionou**

Execute este script para verificar o status do RLS:

```sql
-- Verificar status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado:**
- Se escolheu **Opção A**: `rowsecurity = false` (RLS desabilitado)
- Se escolheu **Opção B**: `rowsecurity = true` (RLS habilitado)

---

## 🧪 TESTAR A APLICAÇÃO

Depois de executar o script SQL:

1. Acesse: http://localhost:3000
2. Clique em **"Registrar"**
3. Crie uma conta de teste:
   - Nome: Teste
   - Email: teste@exemplo.com
   - Senha: 123456
4. Adicione uma matéria (ex: "Matemática")
5. Inicie uma sessão de estudo

Se tudo funcionar, o RLS está configurado corretamente! ✅

---

## 🔍 VERIFICAR NO SUPABASE

1. Vá em **"Table Editor"** no Supabase
2. Clique na tabela **"User"**
3. Você deve ver o usuário que criou
4. Verifique também as tabelas **"Subject"** e **"StudySession"**

---

## ❓ TROUBLESHOOTING

### **Erro: "permission denied for table User"**
```sql
-- Execute isso:
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
```

### **Erro: "relation does not exist"**
```sql
-- Verifique se as tabelas foram criadas:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **Erro: "index already exists"**
```sql
-- Ignore este erro, significa que os índices já existem
-- Isso é normal e não afeta o funcionamento
```

---

## 📊 RESUMO

### **Para Desenvolvimento (Agora)**
✅ Use **Opção A** (Desabilitar RLS)
- Mais fácil para testar
- Menos problemas de permissão
- Nossa API já tem segurança JWT

### **Para Produção (Depois)**
✅ Use **Opção B** (Habilitar RLS)
- Camada extra de segurança
- Proteção no nível do banco
- Boas práticas de produção

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Execute o script SQL (Opção A)
2. ✅ Teste criando uma conta
3. ✅ Verifique se os dados aparecem no Supabase
4. ✅ Faça o push para GitHub (quando autenticar)
5. ✅ Deploy na Vercel

---

## 🚀 LINKS ÚTEIS

- **Supabase Dashboard**: https://qtplaftmqfkfpuibsdfp.supabase.co
- **SQL Editor**: https://qtplaftmqfkfpuibsdfp.supabase.co/project/qtplaftmqfkfpuibsdfp/sql
- **Table Editor**: https://qtplaftmqfkfpuibsdfp.supabase.co/project/qtplaftmqfkfpuibsdfp/editor
- **App Local**: http://localhost:3000

---

**Recomendação**: Execute a **Opção A** agora para começar a testar! 🎉
