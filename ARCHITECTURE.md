# Arquitetura ProjetoFlow

## 🏗️ Visão Geral

ProjetoFlow segue uma arquitetura de três camadas:

```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│    (Single Page Application - SPA)          │
└────────────────────┬────────────────────────┘
                     │
          HTTP/REST  │  JSON
                     │
┌────────────────────▼────────────────────────┐
│      Backend API (Django + DRF)             │
│    (RESTful API com autenticação JWT)       │
└────────────────────┬────────────────────────┘
                     │
        SQL/Psycopg2  │
                     │
┌────────────────────▼────────────────────────┐
│      Database (PostgreSQL)                  │
│    (Dados persistentes)                     │
└─────────────────────────────────────────────┘
```

## 📦 Componentes Principais

### Frontend (React 18 + TypeScript)

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.tsx      # Navegação principal
│   │   └── ThemeToggle.tsx # Alternador de tema
│   ├── pages/              # Componentes de páginas
│   │   ├── Home.tsx        # Página inicial
│   │   ├── Login.tsx       # Login
│   │   ├── Dashboard.tsx   # Dashboard
│   │   └── Projects.tsx    # Listagem de projetos
│   ├── hooks/              # Custom hooks
│   │   ├── useTheme.tsx    # Hook para tema
│   │   ├── useAuth.tsx     # Hook para autenticação
│   │   └── use-mobile.tsx  # Detecção de device mobile
│   ├── services/           # Serviços/APIs
│   │   └── api.ts          # Cliente Axios configurado
│   ├── styles/             # Estilos globais
│   ├── App.tsx             # Componente root
│   └── main.tsx            # Entry point
```

**Tecnologias:**

- React 18 - UI framework
- TypeScript - Type safety
- React Router - Navegação
- Axios - HTTP client
- Zustand - State management (opcional)
- Vite - Build tool
- Tailwind CSS - Estilização
- Lucide React - Icons

**Fluxo de Autenticação:**

```
Component → useAuth() → API Call → JWT Token
                                ↓
                        localStorage.token
                                ↓
                        axios interceptor
```

### Backend (Django 4.2 + DRF)

```
backend/
├── src/
│   ├── api/                    # Aplicação principal
│   │   ├── models.py           # Models ORM
│   │   ├── views.py            # ViewSets (Controllers)
│   │   ├── serializers.py      # Serializadores
│   │   ├── auth_urls.py        # Rotas de auth
│   │   ├── apps.py             # Config da app
│   │   ├── admin.py            # Admin Django
│   │   └── signals.py          # Django signals
│   ├── settings.py             # Configurações Django
│   ├── urls.py                 # Rotas principais
│   └── wsgi.py                 # WSGI application
├── tests/                      # Testes unitários
├── requirements.txt            # Dependências
└── manage.py                   # Django CLI
```

**Modelos de Dados:**

```
User (Django Auth)
├── username
├── email
├── password
└── preferences (FK → UserPreference)

UserPreference
├── user (1-1 User)
├── theme (light/dark/auto)
└── language

Project
├── id (UUID)
├── user (FK)
├── name
├── description
├── status (active/archived/completed)
├── created_at
├── updated_at
└── tasks (1-N Task)

Task
├── id (UUID)
├── project (FK)
├── title
├── description
├── status (pending/in_progress/completed/cancelled)
├── priority (low/medium/high/urgent)
├── due_date
├── created_at
└── updated_at
```

**ViewSets (Controllers):**

- `ProjectViewSet` - CRUD de projetos
- `TaskViewSet` - CRUD de tarefas
- `UserViewSet` - Dados do usuário
- `RegisterView` - Registro
- `LoginView` - Login

### Database (PostgreSQL)

```
Schema: public

Tables:
├── auth_user (Django Auth)
├── auth_group
├── auth_permission
├── api_userpreference
├── api_project
├── api_task
└── [Others]

Índices:
├── projects.user_id
├── projects.created_at
├── tasks.project_id
├── tasks.status
├── tasks.priority
└── users.email, .username
```

## 🔄 Fluxos Principais

### 1. Autenticação

```
1. User submits credentials → Login Form
2. Form validates locally
3. POST /api/v1/auth/login/ → Backend
4. Backend validates credentials
5. Generate JWT token pair (access + refresh)
6. Response: { access_token, refresh_token, user }
7. Frontend stores token → localStorage
8. Axios interceptor adds to headers
```

### 2. Alternância de Tema

```
1. User clicks theme toggle button
2. ThemeToggle component calls useTheme()
3. toggleTheme() changes state
4. Effect watches theme state
5. localStorage.theme = new_theme
6. document.documentElement.classList.add/remove('dark')
7. Tailwind responde com classe dark:* e light:*
```

### 3. Buscar Projetos

```
1. Dashboard mounts → useEffect
2. Calls GET /api/v1/projects/
3. Axios adds JWT token to header
4. Backend validates token → extracts user
5. ProjectViewSet.get_queryset filters by user
6. Returns JSON list
7. Component re-renders with projects
```

## 🔐 Segurança

### Autenticação

- JWT tokens (simplejwt)
- Access token (1h) + Refresh token (7d)
- HTTPS em produção

### Autorização

- Permission classes em viewsets
- User filter nas queries
- User validation em serializers

### Validação

- Django validators
- DRF serializer validation
- Frontend client-side validation

### CORS

- Configurado apenas para origens permitidas
- Credenciais permitidas

## 📊 APIs e Endpoints

### Base URL

```
/api/v1/
```

### Authentication

```
POST   /auth/login/       - Login
POST   /auth/register/    - Registro
```

### Resources

```
GET    /projects/         - List
POST   /projects/         - Create
GET    /projects/{id}/    - Retrieve
PUT    /projects/{id}/    - Update
DELETE /projects/{id}/    - Delete

GET    /tasks/            - List
POST   /tasks/            - Create
GET    /tasks/{id}/       - Retrieve
PUT    /tasks/{id}/       - Update
DELETE /tasks/{id}/       - Delete

GET    /users/me/         - Current user
GET    /users/preferences/ - User preferences
PUT    /users/preferences/ - Update preferences
```

## 🧪 Testes

### Estratégia

```
Frontend:
├── Unit Tests (Vitest)
│   ├── Components
│   ├── Hooks
│   └── Utils
├── Integration Tests
│   └── Page flows
└── E2E Tests (Cypress) - opcional

Backend:
├── Unit Tests (pytest)
│   ├── Models
│   ├── Serializers
│   └── Utils
├── Integration Tests
│   ├── ViewSets
│   ├── Endpoints
│   └── Permissions
└── API Tests
    └── Full request/response cycles
```

### Cobertura

- Backend: Mín 80%
- Frontend: Mín 70%

## 🐳 Containerização

### Docker Compose Stack

```yaml
services:
  db:
    - PostgreSQL 15
    - Port: 5432
    - Volume: db-data

  backend:
    - Django API
    - Port: 5000
    - Depends: db
    - CMD: gunicorn

  frontend:
    - React SPA
    - Port: 3000
    - Depends: backend
    - CMD: serve

networks:
  - projetoflow-network (bridge)

volumes:
  - db-data (postgres persistence)
```

## 📈 Performance

### Otimizações

**Backend:**

- Índices no banco (user_id, created_at, status)
- Pagination (DRF default)
- Select related para FK
- Prefetch related para M2M

**Frontend:**

- Code splitting com React Router
- Image optimization
- CSS-in-JS com Tailwind
- Lazy loading de componentes

## 🚀 Deployment

### Producão

```
1. Environment variables (.env production)
2. Database migrations
3. Secret key generation
4. DEBUG = False
5. HTTPS enabled
6. CORS configurado
7. Static files collected
8. Backups configurados
```

### Health Checks

```
GET /api/v1/health/    - Backend status
GET /                  - Frontend status
```

## 📚 Padrões de Design

### Frontend

- Container/Presentational Components
- Custom Hooks for Logic
- Context API for State
- Higher-Order Components (optional)

### Backend

- ViewSets for CRUD
- Serializers for Validation
- Signals for Auto-actions
- Managers for Complex Queries

## 🔄 CI/CD

Pipeline (GitHub Actions):

```
1. Lint & Format Check
2. Run Tests (Backend + Frontend)
3. Build Docker images
4. Push to registry
5. Deploy to staging
6. Run E2E tests
7. Deploy to production
```

## 📝 Documentação API

Gerada automaticamente com:

- drf-spectacular
- OpenAPI 3.0
- Swagger UI: /api/docs
- ReDoc: /api/redoc

## 🔗 Dependências Principais

### Backend

- Django 4.2
- djangorestframework 3.14
- drf-simplejwt 5.3
- psycopg2-binary 2.9
- gunicorn 21.2
- pytest 7.4
- pytest-django 4.7

### Frontend

- React 18.2
- react-router-dom 6.20
- axios 1.6
- lucide-react 0.294
- vite 5.0
- vitest 1.0

## 🎓 Recursos Adicionais

- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [Docker Docs](https://docs.docker.com/)

---

Última atualização: Fevereiro 2026
