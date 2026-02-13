# 🚀 ProjetoFlow

**Sistema de Gerenciamento de Projetos e Tarefas** — Full-stack application built with Django REST Framework + React.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-4.2-green)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## 📋 Funcionalidades

### Autenticação & Usuários

- Registro e login com JWT (access + refresh tokens)
- Perfil de usuário com troca de tema (claro/escuro)
- Sessão persistente com refresh automático de tokens

  https://github.com/user-attachments/assets/c29c0f5a-71aa-47f2-8c71-79c946cfa744

### Projetos

- CRUD completo de projetos
- Sistema de membros com papéis (admin/membro)
- Colaboração — adicionar e remover membros
- Progresso calculado automaticamente

https://github.com/user-attachments/assets/f0a6ab12-40a3-49b4-ba09-12a5841fc93d

### Tarefas

- CRUD completo de tarefas por projeto
- Status: A Fazer, Em Progresso, Concluída
- Prioridade: Baixa, Média, Alta
- Atribuição a membros do projeto
- Data de vencimento
- Toggle de conclusão rápido

https://github.com/user-attachments/assets/5ac760e8-9649-4f4d-bb35-6c5dd69e049d

### Dashboard

- Estatísticas agregadas (projetos, tarefas, membros)
- Distribuição de tarefas por status
- Projetos recentes
- Barra de progresso global

https://github.com/user-attachments/assets/ee293f97-2765-41b7-ace8-77bbc0483ca7

### Interface

- Design moderno e responsivo
- Tema claro/escuro com transição suave
- Sidebar de navegação colapsável
- Formulários com validação em tempo real
- Notificações toast

https://github.com/user-attachments/assets/b1fc2f2e-daff-4e22-8c31-5348b2329b8d

## 🏗️ Arquitetura

```
projetoflow/
├── backend/                 # Django REST Framework API
│   ├── config/              # Settings, URLs, WSGI
│   └── src/
│       ├── models/          # User, Project, Task, ProjectMembership
│       ├── serializers/     # Auth, Project, Task serializers
│       ├── controllers/     # Auth, Project, Task, Dashboard views
│       ├── routes/          # URL routing
│       └── tests/           # 64 tests, 98% coverage
├── frontend/                # React SPA
│   └── src/
│       ├── components/      # Auth, Layout, Dashboard, Projects
│       ├── contexts/        # AuthContext, ThemeContext
│       ├── services/        # Axios API client with JWT interceptors
│       └── styles/          # CSS Design System (variables, components)
├── db/                      # Database initialization
├── docker-compose.yml       # Orquestração dos 3 containers
├── Dockerfile.backend       # Python 3.12 + Django
└── Dockerfile.frontend      # Node 18 + React
```

---

## 🚀 Quick Start

### Com Docker (recomendado)

```bash
# Clone o repositório
git clone <repo-url>
cd projetoflow

# Inicie todos os serviços
docker-compose up -d

# Acesse:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Swagger Docs: http://localhost:8000/swagger/
```

### Sem Docker (desenvolvimento local)

#### Backend

```bash
# Crie e ative o virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instale dependências
cd backend
pip install -r requirements.txt

# Configure o banco (requer PostgreSQL rodando)
# Edite .env com suas credenciais ou use SQLite para dev
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testes

### Backend (pytest)

```bash
cd backend
source ../venv/bin/activate

# Rodar todos os testes
pytest

# Com cobertura detalhada
pytest --cov=src --cov-report=term-missing

# Resultado: 64 tests passing, 98% coverage
```

### Frontend (Jest)

```bash
cd frontend
npm test -- --watchAll=false

# Resultado: 8 tests passing
```

---

## 📡 API Endpoints

### Autenticação

| Método | Endpoint              | Descrição                   |
| ------ | --------------------- | --------------------------- |
| POST   | `/api/auth/register/` | Registrar novo usuário      |
| POST   | `/api/auth/login/`    | Login (retorna JWT tokens)  |
| GET    | `/api/auth/me/`       | Dados do usuário logado     |
| PATCH  | `/api/auth/profile/`  | Atualizar perfil            |
| PATCH  | `/api/auth/theme/`    | Atualizar tema (light/dark) |

### Projetos

| Método    | Endpoint                            | Descrição                  |
| --------- | ----------------------------------- | -------------------------- |
| GET       | `/api/projects/`                    | Listar projetos do usuário |
| POST      | `/api/projects/`                    | Criar projeto              |
| GET       | `/api/projects/{id}/`               | Detalhes do projeto        |
| PUT/PATCH | `/api/projects/{id}/`               | Atualizar projeto          |
| DELETE    | `/api/projects/{id}/`               | Deletar projeto            |
| GET       | `/api/projects/{id}/members/`       | Listar membros             |
| POST      | `/api/projects/{id}/add_member/`    | Adicionar membro           |
| POST      | `/api/projects/{id}/remove_member/` | Remover membro             |

### Tarefas

| Método    | Endpoint                                              | Descrição                 |
| --------- | ----------------------------------------------------- | ------------------------- |
| GET       | `/api/projects/{id}/tasks/`                           | Listar tarefas do projeto |
| POST      | `/api/projects/{id}/tasks/`                           | Criar tarefa              |
| GET       | `/api/projects/{id}/tasks/{task_id}/`                 | Detalhes da tarefa        |
| PUT/PATCH | `/api/projects/{id}/tasks/{task_id}/`                 | Atualizar tarefa          |
| DELETE    | `/api/projects/{id}/tasks/{task_id}/`                 | Deletar tarefa            |
| POST      | `/api/projects/{id}/tasks/{task_id}/toggle_complete/` | Toggle concluída          |

### Dashboard

| Método | Endpoint          | Descrição              |
| ------ | ----------------- | ---------------------- |
| GET    | `/api/dashboard/` | Estatísticas agregadas |

### Documentação Interativa

| URL         | Descrição               |
| ----------- | ----------------------- |
| `/swagger/` | Swagger UI (interativo) |
| `/redoc/`   | ReDoc (documentação)    |

---

## 🔧 Variáveis de Ambiente

| Variável            | Padrão                  | Descrição                          |
| ------------------- | ----------------------- | ---------------------------------- |
| `SECRET_KEY`        | `django-insecure-...`   | Chave secreta do Django            |
| `DEBUG`             | `True`                  | Modo debug                         |
| `POSTGRES_DB`       | `projetoflow_db`        | Nome do banco                      |
| `POSTGRES_USER`     | `projetoflow_user`      | Usuário do banco                   |
| `POSTGRES_PASSWORD` | `projetoflow_pass`      | Senha do banco                     |
| `POSTGRES_HOST`     | `localhost`             | Host do banco (use `db` no Docker) |
| `POSTGRES_PORT`     | `5432`                  | Porta do banco                     |
| `REACT_APP_API_URL` | `http://localhost:8000` | URL da API para o frontend         |

---

## 🛠️ Tecnologias

### Backend

- **Python 3.12** + **Django 4.2** + **Django REST Framework 3.14**
- **SimpleJWT** — Autenticação JWT (access 2h, refresh 7d)
- **django-filter** — Filtros avançados nas listagens
- **drf-yasg** — Documentação Swagger/ReDoc automática
- **psycopg2** — Driver PostgreSQL
- **pytest** + **factory-boy** — Testes com fixtures

### Frontend

- **React 18** + **React Router 6**
- **Axios** — HTTP client com interceptors JWT
- **react-hot-toast** — Notificações
- **react-icons** — Biblioteca de ícones
- **date-fns** — Formatação de datas
- **CSS Design System** — Variáveis, temas, componentes reutilizáveis

### Infraestrutura

- **Docker Compose** — 3 containers (frontend, backend, db)
- **PostgreSQL 15** — Banco de dados
- **Node 18 Alpine** — Build do frontend

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
