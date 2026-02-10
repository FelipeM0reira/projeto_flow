# ProjetoFlow 🚀

Uma aplicação web moderna para gerenciamento de tarefas e projetos com suporte a temas claro e escuro.

## 📋 Características

- ✅ Autenticação segura com JWT (JSON Web Tokens)
- 🌓 Temas claro e escuro com preferência persistente
- 📱 Interface responsiva com React + TypeScript
- 🔌 API RESTful robusta com Django
- 💾 Banco de dados PostgreSQL
- 🐳 Docker e Docker Compose para fácil deployment
- ✔️ Testes automatizados (Frontend com Vitest, Backend com pytest)
- 📚 Documentação API com Swagger/OpenAPI
- 📊 CI/CD pronto para integração

## 🏗️ Arquitetura do Projeto

```
projetoflow/
├── infra/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_models.py
│   │   ├── test_views.py
│   │   └── test_serializers.py
│   ├── manage.py
│   ├── requirements.txt
│   └── pytest.ini
├── db/
│   └── init.sql
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 1.29
- Node.js >= 18 (para desenvolvimento local sem Docker)
- Python >= 3.11 (para desenvolvimento local sem Docker)

### Usando Docker (Recomendado)

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/ProjetoFlow.git
cd ProjetoFlow
```

2. **Configure as variáveis de ambiente**

```bash
cp infra/.env.example infra/.env
```

3. **Inicie os containers**

```bash
docker-compose -f infra/docker-compose.yml up -d
```

4. **Execute as migrações**

```bash
docker-compose -f infra/docker-compose.yml exec backend python manage.py migrate
```

5. **Crie um super usuário (opcional)**

```bash
docker-compose -f infra/docker-compose.yml exec backend python manage.py createsuperuser
```

A aplicação estará disponível em:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Docs: http://localhost:5000/api/docs
- Admin: http://localhost:5000/admin

### Desenvolvimento Local

#### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver

# Executar testes
pytest

# Executar testes com cobertura
pytest --cov=src --cov-report=html
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm run test

# Build para produção
npm run build
```

## 🔐 Credenciais Demo

Para testar a aplicação, use as credenciais padrão:

- **Usuário**: admin
- **Senha**: password

> ⚠️ Altere as credenciais na primeira utilização em produção!

## 📚 Documentação da API

Acesse a documentação interativa em: `http://localhost:5000/api/docs`

### Endpoints Principais

#### Autenticação

- `POST /api/v1/auth/login/` - Login do usuário
- `POST /api/v1/auth/register/` - Registro de novo usuário

#### Projetos

- `GET /api/v1/projects/` - Listar projetos
- `POST /api/v1/projects/` - Criar novo projeto
- `GET /api/v1/projects/{id}/` - Obter detalhes do projeto
- `PUT /api/v1/projects/{id}/` - Atualizar projeto
- `DELETE /api/v1/projects/{id}/` - Deletar projeto

#### Tarefas

- `GET /api/v1/tasks/` - Listar tarefas
- `POST /api/v1/tasks/` - Criar nova tarefa
- `GET /api/v1/tasks/{id}/` - Obter detalhes da tarefa
- `PUT /api/v1/tasks/{id}/` - Atualizar tarefa
- `DELETE /api/v1/tasks/{id}/` - Deletar tarefa

#### Preferências

- `GET /api/v1/users/preferences/` - Obter preferências do usuário
- `PUT /api/v1/users/preferences/` - Atualizar preferências (tema, idioma)

## 🧪 Testes

### Frontend

```bash
cd frontend

# Executar testes
npm run test

# Modo watch
npm run test -- --watch

# Com cobertura
npm run coverage
```

### Backend

```bash
cd backend

# Executar todos os testes
pytest

# Executar teste específico
pytest tests/test_models.py

# Com cobertura
pytest --cov=src --cov-report=html
```

## 🔄 Workflow Git

1. Crie uma nova branch para sua feature

```bash
git checkout -b feature/sua-feature
```

2. Faça commits com mensagens descritivas

```bash
git commit -m "feat: descrição da feature"
```

3. Push para a branch

```bash
git push origin feature/sua-feature
```

4. Abra um Pull Request

### Convenções de Commit

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, sem mudança lógica
- `refactor:` - Refatoração de código
- `test:` - Adição ou modificação de testes
- `chore:` - Tarefas auxiliares

## 📦 Deployment

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `infra/`:

```env
# Database
POSTGRES_USER=production_user
POSTGRES_PASSWORD=strong_password_here
POSTGRES_DB=projetoflow_db

# Backend
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Frontend
VITE_API_BASE_URL=https://yourdomain.com/api

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Deploy com Docker

```bash
# Build das imagens
docker-compose -f infra/docker-compose.yml build

# Iniciar em produção
docker-compose -f infra/docker-compose.yml up -d
```

## 🛠️ Troubleshooting

### Problema: Erro de conexão com banco de dados

```bash
# Verifique se o container PostgreSQL está rodando
docker-compose -f infra/docker-compose.yml logs db

# Restart dos containers
docker-compose -f infra/docker-compose.yml restart
```

### Problema: Porta já em uso

```bash
# Mude as portas no arquivo .env
# Ou libere as portas:
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :5432  # Database
```

## 📊 Monitoramento

O projeto inclui health checks para todos os serviços. Verifique:

```bash
curl http://localhost:5000/api/v1/health/  # Backend
curl http://localhost:3000/                 # Frontend
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- ProjetoFlow Team

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a [documentação](docs/)
2. Abra uma [issue no GitHub](https://github.com/seu-usuario/ProjetoFlow/issues)
3. Entre em contato via email

## 🗺️ Roadmap

- [ ] Autenticação OAuth2 (Google, GitHub)
- [ ] Colaboração em tempo real
- [ ] Notificações por email
- [ ] Mobile app (React Native)
- [ ] Analytics e relatórios
- [ ] Integração com Slack/Discord
- [ ] Backup automático
- [ ] Rate limiting e throttling

## 📚 Seus links de referência

- [React Docs](https://react.dev/)
- [Django Docs](https://docs.djangoproject.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)
- [JWT Auth](https://jwt.io/)

---

**Desenvolvido com ❤️ pelo time ProjetoFlow**
