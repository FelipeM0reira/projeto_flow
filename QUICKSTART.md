# ⚡ Quick Start

Comece com ProjetoFlow em 5 minutos!

## 🚀 Opção 1: Docker (Recomendado)

### Pré-requisitos
- Docker instalado
- Docker Compose instalado

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ProjetoFlow.git
cd ProjetoFlow

# 2. Crie arquivo .env (opcional - já vem com defaults)
# cp infra/.env.example infra/.env

# 3. Inicie os containers
docker-compose -f infra/docker-compose.yml up -d

# 4. Aguarde ~30 segundos para inicialização

# 5. Pronto! Acesse:
# Frontend: http://localhost:3000
# API Docs: http://localhost:5000/api/docs
# Admin: http://localhost:5000/admin
```

**Credenciais Demo:**
```
Usuário: admin
Senha: password
```

### Comandos Úteis

```bash
# Ver logs
docker-compose -f infra/docker-compose.yml logs -f

# Parar containers
docker-compose -f infra/docker-compose.yml down

# Limpar dados (reset completo)
docker-compose -f infra/docker-compose.yml down -v
```

---

## 🖥️ Opção 2: Desenvolvimento Local

### Backend (Django)

```bash
cd backend

# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Setup do banco de dados (necessário PostgreSQL local)
# Faça criar um banco com:
# createdb -U postgres local_db

# 4. Executar migrações
python manage.py migrate

# 5. Criar super usuário (opcional)
python manage.py createsuperuser

# 6. Iniciar servidor
python manage.py runserver
# Acesse: http://localhost:8000
```

### Frontend (React)

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Iniciar servidor
npm run dev
# Acesse: http://localhost:5173

# 3. Em outro terminal, build em watch mode
npm run build -- --watch
```

---

## 📝 Tarefas Comuns

### Criar novo projeto

```bash
# Via Frontend (UI)
1. Login
2. Clique em "New Project"
3. Preencha dados
4. Salve

# Via API (curl)
curl -X POST http://localhost:5000/api/v1/projects/ \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto",
    "description": "Descrição"
  }'
```

### Executar testes

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

### Alternar tema

Clique no ícone de lua/sol no canto superior direito da interface.

---

## 🔗 Recursos Importantes

- **Documentação**: [README.md](README.md)
- **Arquitetura**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Contribuindo**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Docs**: http://localhost:5000/api/docs (quando rodando)

---

## 🆘 Problemas Comuns

### Porta já em uso

```bash
# Mude no .env
FRONTEND_PORT=3001
BACKEND_PORT=5001
POSTGRES_PORT=5433

# Ou libere a porta
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows
```

### PostgreSQL não conecta

```bash
# Verifique se está rodando
psql --version

# Crie banco de dados padrão
createdb -U postgres local_db

# Ou use Docker
docker run -d \
  --name projetoflow-db \
  -e POSTGRES_PASSWORD=local_password \
  -e POSTGRES_DB=local_db \
  -p 5432:5432 \
  postgres:15
```

### Erro "Module not found"

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
npm ci  # Força versões exatas
```

---

## 📊 Estrutura de Pastas

```
ProjetoFlow/
├── frontend/        - React SPA
├── backend/         - Django API
├── db/              - Scripts SQL
├── infra/           - Docker config
├── README.md        - Documentação principal
└── Makefile         - Comandos úteis
```

---

## ⚙️ Variáveis de Ambiente

### Principais

```env
# Backend
DATABASE_URL=postgresql://user:pwd@localhost:5432/db
DEBUG=True
SECRET_KEY=dev-key

# Frontend
VITE_API_BASE_URL=http://localhost:5000/api

# Database
POSTGRES_USER=local_user
POSTGRES_PASSWORD=local_password
POSTGRES_DB=local_db
```

Veja [.env.example](.env.example) para todas as opções.

---

## 📚 Próximos Passos

1. ✅ Familiarize-se com a arquitetura em [ARCHITECTURE.md](ARCHITECTURE.md)
2. ✅ Crie seu primeiro projeto
3. ✅ Leia sobre autenticação em [API.md](docs/API.md) (se existir)
4. ✅ Contribua! Veja [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 💬 Precisa de ajuda?

- Abra uma [issue](https://github.com/seu-usuario/ProjetoFlow/issues)
- Verifique [FAQs](docs/FAQs.md) (se existir)
- Email: support@projetoflow.com

---

**Pronto para começar?** Escolha Docker ou local e vá! 🚀
