# 🚀 Guia Rápido - Novas Funcionalidades

## 📦 Instalação e Configuração

### 1. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Gere um JWT_SECRET seguro
openssl rand -base64 32

# Edite o .env e cole o secret gerado
JWT_SECRET="seu-secret-aqui"
```

### 2. Instalar Dependências
```bash
npm install --legacy-peer-deps
```

### 3. Configurar Banco de Dados
```bash
npx prisma db push
```

### 4. Rodar em Desenvolvimento
```bash
npm run dev
```

### 5. Build de Produção
```bash
npm run build
npm start
```

---

## 🔐 Segurança

### Validação de Dados
Todas as APIs agora validam dados automaticamente com Zod:

```typescript
// Exemplo de uso no frontend
try {
  const response = await fetch('/api/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Matemática' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    // error.details contém informações detalhadas de validação
    console.error(error.details)
  }
} catch (error) {
  console.error('Erro na requisição:', error)
}
```

### Logout Seguro
O logout agora limpa o cookie no servidor:

```typescript
// No componente
const { logout } = useAuth()

// Chama a API e limpa o cookie
await logout()
```

---

## 🎨 Componentes de UI

### Error Boundary
Envolva componentes para capturar erros:

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

function MyApp() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### Loading Components
```tsx
import { LoadingSpinner, PageLoader, CardSkeleton } from '@/components/LoadingComponents'

// Spinner pequeno
<LoadingSpinner size="sm" />

// Página inteira
<PageLoader />

// Skeleton de card
<CardSkeleton />
```

---

## 🔔 Notificações

### Usar o Hook de Notificações
```tsx
import { useNotifications } from '@/lib/useNotifications'

function MyComponent() {
  const { requestPermission, sendNotification, scheduleStudyReminder } = useNotifications()

  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      // Agendar lembrete para daqui 2 horas
      scheduleStudyReminder(2)
    }
  }

  const handleSendNotification = () => {
    sendNotification('Título', {
      body: 'Mensagem da notificação',
      tag: 'unique-tag'
    })
  }

  return (
    <div>
      <button onClick={handleEnableNotifications}>
        Ativar Notificações
      </button>
      <button onClick={handleSendNotification}>
        Enviar Notificação Teste
      </button>
    </div>
  )
}
```

---

## 🌐 Cliente de API

### Usar o Cliente Tipado
```tsx
import { apiClient } from '@/lib/api-client'

// Ao invés de fetch manual
const subjects = await apiClient.subjects.list()

// Criar matéria
const newSubject = await apiClient.subjects.create('Português')

// Criar sessão de estudo
const session = await apiClient.sessions.create({
  subjectId: 'subject-id',
  durationMinutes: 50,
  type: '50min'
})

// Atualizar meta
await apiClient.goals.update(20)
```

---

## 🎯 Animações CSS

### Classes Disponíveis
```tsx
// Fade in
<div className="animate-fade-in">
  Conteúdo aparece suavemente
</div>

// Slide in
<div className="animate-slide-in">
  Conteúdo desliza da esquerda
</div>

// Spin (loading)
<div className="animate-spin">
  ⚙️
</div>

// Pulse
<div className="animate-pulse">
  Pulsando...
</div>
```

---

## 📱 PWA

### Shortcuts
O app agora tem atalhos rápidos:
- **Iniciar Estudo** - Vai direto para o dashboard
- **Ver Relatórios** - Abre a página de relatórios

### Instalação
1. Abra o app no navegador
2. Clique em "Instalar" ou menu > "Adicionar à tela inicial"
3. O app funciona offline!

---

## 🔍 SEO

### Meta Tags Automáticas
Cada página pode definir suas próprias meta tags:

```tsx
// Em qualquer page.tsx
export const metadata = {
  title: 'Minha Página',
  description: 'Descrição da página',
  openGraph: {
    title: 'Título para redes sociais',
    description: 'Descrição para redes sociais',
  }
}
```

### Sitemap
Acesse `/sitemap.xml` para ver o sitemap gerado automaticamente.

---

## 🐛 Debugging

### Erros de Validação
Quando uma validação falha, você recebe:

```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "Senha deve ter no mínimo 6 caracteres"
    }
  ]
}
```

### Logs de Erro
Todos os erros são logados no console do servidor com contexto completo.

---

## 🚀 Deploy

### Vercel (Recomendado)
1. Push para GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente:
   - `JWT_SECRET` (obrigatório!)
   - `DATABASE_URL` (quando migrar para Supabase)
4. Deploy automático!

### Variáveis de Ambiente Necessárias
```bash
# Obrigatórias
JWT_SECRET="seu-secret-super-seguro"
DATABASE_URL="postgresql://..." # Quando migrar para Supabase
NODE_ENV="production"

# Opcionais
NEXT_PUBLIC_SENTRY_DSN="..." # Para tracking de erros
NEXT_PUBLIC_GA_ID="..." # Para Google Analytics
```

---

## 📊 Monitoramento

### Adicionar Sentry (Recomendado)
```bash
npm install @sentry/nextjs
```

O ErrorBoundary já está preparado para enviar erros ao Sentry automaticamente.

---

## 💡 Dicas

### Performance
- ✅ Imagens são otimizadas automaticamente
- ✅ PWA cacheia recursos offline
- ✅ Lazy loading automático

### Segurança
- ✅ Nunca commite o `.env` (já está no .gitignore)
- ✅ Use HTTPS em produção
- ✅ Gere um JWT_SECRET único por ambiente

### UX
- ✅ Sempre mostre loading states
- ✅ Use toast notifications (já configurado com Sonner)
- ✅ Trate erros com mensagens amigáveis

---

## 🆘 Troubleshooting

### Build Falha
```bash
# Limpe o cache e rebuild
rm -rf .next
npm run build
```

### Erro de Peer Dependencies
```bash
# Use --legacy-peer-deps
npm install --legacy-peer-deps
```

### JWT_SECRET não definido
```bash
# Gere um novo
openssl rand -base64 32

# Adicione ao .env
echo "JWT_SECRET=seu-secret-aqui" >> .env
```

---

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Dúvidas?** Consulte o arquivo `MELHORIAS_IMPLEMENTADAS.md` para detalhes técnicos completos.
