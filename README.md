# Projeto Aprovação

Sistema web (PWA) minimalista para controle de horas de estudo para concurseiros.

## 🚀 Tecnologias

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes com validação Zod
- **Database**: Prisma ORM + **PostgreSQL (Supabase)** ✨
- **Auth**: JWT com cookies HTTP-only
- **PWA**: next-pwa com cache offline
- **UI**: Recharts, Sonner (toast notifications)
- **Validação**: Zod para todas as APIs
- **Otimização**: next/image, lazy loading, code splitting
- **Hosting**: Supabase (Database) + Vercel (App)

## ✨ Funcionalidades

### Core Features
- ✅ Controle de horas reais de estudo (Timer de 50/25 min ou Livre)
- ✅ Cadastro de matérias (até 6 no plano free, ilimitado no premium)
- ✅ Meta semanal com acompanhamento de progresso
- ✅ Relatórios de desempenho por matéria e histórico
- ✅ Sistema de "Prédio da Aprovação" (gamificação com streak)
- ✅ Calendário de estudos estilo Google
- ✅ Notas diárias por data

### Melhorias Recentes (v2.0)
- 🔒 **Segurança**: Validação Zod em todas as APIs, JWT obrigatório em produção
- 🎨 **UX**: Animações suaves, loading states, error boundaries
- ⚡ **Performance**: Imagens otimizadas com next/image, cache PWA
- 🔔 **Notificações**: Sistema de notificações push para lembretes
- 🔍 **SEO**: Meta tags completas, sitemap, robots.txt
- 📱 **PWA**: Shortcuts, manifest aprimorado, offline-first
- 🗄️ **Database**: **Migrado para PostgreSQL (Supabase)** ✨

## 🛠️ Como rodar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repo-url>
cd Poojeto_Aprovação
```

2. **Instale as dependências**
```bash
npm install --legacy-peer-deps
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env

# Gere um JWT_SECRET seguro
openssl rand -base64 32

# Edite o .env e adicione o secret gerado
```

4. **Inicialize o banco de dados**
```bash
npx prisma db push
```

5. **Rode o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Build de Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes com validação Zod
│   ├── dashboard/         # Dashboard principal
│   ├── reports/           # Página de relatórios
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── ErrorBoundary.tsx  # Tratamento de erros
│   ├── LoadingComponents.tsx
│   └── ...
├── context/               # React Context (Auth, Study)
├── lib/                   # Utilitários
│   ├── validation.ts      # Schemas Zod
│   ├── errors.ts          # Tratamento de erros
│   ├── api-client.ts      # Cliente HTTP tipado
│   ├── auth.ts            # Autenticação JWT
│   └── useNotifications.ts # Hook de notificações
└── middleware.ts          # Middleware de autenticação

prisma/
└── schema.prisma          # Schema do banco de dados

public/
├── manifest.json          # PWA manifest
├── robots.txt             # SEO
└── icons/                 # Ícones do app
```

## 🔐 Segurança

- ✅ Validação de entrada com Zod em todas as APIs
- ✅ JWT com cookies HTTP-only e secure
- ✅ Headers de segurança HTTP (CSP, X-Frame-Options, etc.)
- ✅ Logout completo com limpeza de cookies
- ✅ Verificação de ownership em todas as operações
- ✅ Rate limiting ready (adicionar em produção)

## 📱 PWA

O sistema funciona como Progressive Web App:
- ✅ Instalável em dispositivos móveis e desktop
- ✅ Funciona offline (timer, visualização de dados)
- ✅ Sincronização automática quando online
- ✅ Shortcuts para ações rápidas
- ✅ Cache inteligente de recursos

## 🎯 Planos

### Free
- Até 6 matérias
- Histórico de 7 dias
- Prédio até 3 andares
- Timer persistente

### Premium (R$ 19,90/mês)
- Matérias ilimitadas
- Histórico completo
- Prédio sem limite
- Calendário avançado
- Suporte prioritário

## 📚 Documentação Adicional

- [MELHORIAS_IMPLEMENTADAS.md](./MELHORIAS_IMPLEMENTADAS.md) - Lista completa de melhorias
- [GUIA_RAPIDO.md](./GUIA_RAPIDO.md) - Guia de uso das novas funcionalidades
- [RESUMO_MIGRACAO.md](./RESUMO_MIGRACAO.md) - **Migração para Supabase** ✨
- [MIGRACAO_SUPABASE.md](./MIGRACAO_SUPABASE.md) - Guia completo de migração
- [supabase_setup.sql](./supabase_setup.sql) - Script de configuração do banco

## 🚀 Deploy

### Vercel (Recomendado)
1. Push para GitHub
2. Conecte no Vercel
3. Configure variáveis de ambiente:
   - `JWT_SECRET` (obrigatório)
   - `DATABASE_URL` (quando migrar para Supabase)
4. Deploy automático!

### Variáveis de Ambiente Necessárias
```bash
JWT_SECRET="seu-secret-super-seguro"  # OBRIGATÓRIO
DATABASE_URL="file:./dev.db"          # SQLite local
NODE_ENV="production"                  # Em produção
```

## 🐛 Troubleshooting

### Build falha
```bash
rm -rf .next
npm run build
```

### Erro de peer dependencies
```bash
npm install --legacy-peer-deps
```

### JWT_SECRET não definido
```bash
openssl rand -base64 32
# Adicione ao .env
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🎨 Design Philosophy

O sistema foi desenhado para ser:
- **Sóbrio**: Sem distrações, foco total no estudo
- **Minimalista**: Interface limpa e objetiva
- **Gamificado**: Sistema de prédio e streak para motivação
- **Offline-first**: Funciona sem internet
- **Rápido**: Performance otimizada

---

**"A aprovação é consequência da constância."**
