# 🚀 DEPLOY NA VERCEL - GUIA COMPLETO

## ✅ CORREÇÃO APLICADA

O erro de dependências foi corrigido! As seguintes mudanças foram feitas:

```
✅ Removido: react-calendar-heatmap (incompatível com React 19)
✅ Criado: .npmrc com legacy-peer-deps
✅ Atualizado: package-lock.json
✅ Commit e push realizados
```

---

## 🎯 DEPLOY NA VERCEL - PASSO A PASSO

### **1. Acesse a Vercel**
```
🔗 URL: https://vercel.com
```

1. Faça login com sua conta GitHub
2. Clique em **"Add New Project"**

---

### **2. Importe o Repositório**

1. Procure por: **"projeto-aprova-o"**
2. Clique em **"Import"**
3. A Vercel detectará automaticamente que é um projeto Next.js

---

### **3. Configure as Variáveis de Ambiente** 🔴 **IMPORTANTE**

Antes de fazer o deploy, você **DEVE** configurar estas variáveis:

#### **Variáveis Obrigatórias:**

```bash
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.qtplaftmqfkfpuibsdfp:sqdIrWgKVn21@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"

DIRECT_URL="postgresql://postgres.qtplaftmqfkfpuibsdfp:sqdIrWgKVn21@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://qtplaftmqfkfpuibsdfp.supabase.co"

NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0cGxhZnRtcWZrZnB1aWJzZGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQyOTQsImV4cCI6MjA4Njc3MDI5NH0.gV83OtGd0lQjG8YEwsWqbU8saM0iwY9qHAh8FqnRbw4"

# Authentication - GERE UM NOVO SECRET SEGURO!
JWT_SECRET="[GERE UM NOVO AQUI]"

# Environment
NODE_ENV="production"
```

#### **Como gerar JWT_SECRET seguro:**

**Opção 1: Online**
```
🔗 https://generate-secret.vercel.app/32
```

**Opção 2: Terminal (se tiver OpenSSL)**
```bash
openssl rand -base64 32
```

**Opção 3: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### **4. Configurar na Vercel**

1. Na página de configuração do projeto, role até **"Environment Variables"**
2. Para cada variável acima:
   - Cole o **nome** (ex: `DATABASE_URL`)
   - Cole o **valor**
   - Selecione **"Production"**, **"Preview"** e **"Development"**
   - Clique em **"Add"**

**⚠️ ATENÇÃO**: Certifique-se de gerar um **JWT_SECRET novo e seguro**!

---

### **5. Deploy**

1. Depois de adicionar todas as variáveis, clique em **"Deploy"**
2. Aguarde o build (leva ~2-3 minutos)
3. ✅ Deploy concluído!

---

## 🔍 VERIFICAR O DEPLOY

### **1. Acesse a URL**
A Vercel fornecerá uma URL como:
```
https://projeto-aprova-o.vercel.app
```

### **2. Teste a Aplicação**
1. Acesse a URL
2. Clique em **"Registrar"**
3. Crie uma conta de teste
4. Adicione uma matéria
5. Inicie uma sessão de estudo

### **3. Verifique no Supabase**
1. Acesse: https://qtplaftmqfkfpuibsdfp.supabase.co
2. Vá em **"Table Editor"**
3. Verifique se os dados foram salvos

---

## 🐛 TROUBLESHOOTING

### **Erro: "Can't reach database server"**
```
✅ Verifique se DATABASE_URL e DIRECT_URL estão corretos
✅ Certifique-se de que não há espaços extras
✅ Verifique se o RLS está configurado (ver CONFIGURAR_RLS.md)
```

### **Erro: "JWT_SECRET is required"**
```
✅ Gere um JWT_SECRET seguro
✅ Adicione nas variáveis de ambiente
✅ Faça redeploy
```

### **Erro: "Build failed"**
```
✅ Verifique os logs de build na Vercel
✅ O .npmrc deve estar no repositório
✅ Tente fazer redeploy
```

### **Erro: "Module not found"**
```
✅ Verifique se todas as dependências estão no package.json
✅ Limpe o cache da Vercel (Settings > General > Clear Cache)
✅ Faça redeploy
```

---

## ⚙️ CONFIGURAÇÕES ADICIONAIS (Opcional)

### **Domínio Customizado**

1. Vá em **"Settings"** > **"Domains"**
2. Adicione seu domínio
3. Configure o DNS conforme instruções da Vercel

### **Analytics**

1. Vá em **"Analytics"**
2. Ative o Vercel Analytics (grátis)
3. Veja métricas de performance e uso

### **Logs**

1. Vá em **"Logs"**
2. Veja logs em tempo real
3. Filtre por tipo (Build, Runtime, Edge)

---

## 📊 MONITORAMENTO

### **Vercel Dashboard**
```
✅ Deployments: Ver histórico de deploys
✅ Analytics: Métricas de uso
✅ Logs: Logs em tempo real
✅ Settings: Configurações do projeto
```

### **Supabase Dashboard**
```
✅ Table Editor: Ver dados
✅ SQL Editor: Executar queries
✅ Logs: Ver logs de conexão
✅ Database: Monitorar performance
```

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

### **1. Configure RLS no Supabase** (se ainda não fez)
```
📄 Leia: CONFIGURAR_RLS.md
🔗 Execute: Script da Opção B (Produção)
```

### **2. Teste Completo**
```
✅ Criar conta
✅ Adicionar matérias
✅ Iniciar sessões
✅ Verificar relatórios
✅ Testar PWA (instalar no celular)
```

### **3. Monitoramento**
```
✅ Configure alertas na Vercel
✅ Monitore uso no Supabase
✅ Verifique performance
```

### **4. Backup**
```
✅ Configure backup automático no Supabase
✅ Exporte dados regularmente
```

---

## 💰 CUSTOS

### **Vercel Free Tier**
```
✅ 100GB bandwidth/mês
✅ Builds ilimitados
✅ Domínio .vercel.app grátis
✅ Analytics básico
```

### **Supabase Free Tier**
```
✅ 500MB database
✅ 2GB bandwidth/mês
✅ Backup automático (7 dias)
```

**Total**: R$ 0/mês (até ~1.000 usuários)

---

## 🎉 DEPLOY CONCLUÍDO!

Seu sistema agora está:
- ✅ **Online** e acessível globalmente
- ✅ **Escalável** com Vercel + Supabase
- ✅ **Seguro** com HTTPS automático
- ✅ **Rápido** com CDN global
- ✅ **Monitorado** com analytics

---

## 🔗 LINKS ÚTEIS

### **Produção**
- App: https://projeto-aprova-o.vercel.app (sua URL)
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase: https://qtplaftmqfkfpuibsdfp.supabase.co

### **Desenvolvimento**
- GitHub: https://github.com/mslol21/projeto-aprova-o
- App Local: http://localhost:3000

### **Documentação**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

**Parabéns! Seu sistema está em produção! 🚀**
