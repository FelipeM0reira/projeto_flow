# Guia de Início Rápido

## Configuração Inicial (5 minutos)

### 1. Pré-requisitos
- Docker Desktop instalado e rodando
- Git instalado

### 2. Clone e Execute

```bash
# Clone o repositório
git clone <repository-url>
cd my-project

# Inicie os containers
cd infra
docker-compose up --build
```

**Aguarde** a mensagem de que todos os serviços estão rodando (~2-3 minutos na primeira vez).

### 3. Inicialize o Banco de Dados

Em um novo terminal:

```bash
cd my-project/infra
docker-compose exec backend python manage.py migrate
```

### 4. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api/users/
- **Documentação**: http://localhost:8000/swagger/

## Testando a Aplicação

### Usuários Pré-cadastrados

O banco de dados já vem com 3 usuários de exemplo:
- `admin` - tema escuro
- `user1` - tema claro
- `user2` - tema escuro

### Fluxo de Teste

1. Abra http://localhost:3000
2. Clique em um usuário na lista à esquerda
3. Use o botão de alternância de tema no topo
4. Crie um novo usuário com o formulário
5. Experimente deletar um usuário

## Executando Testes

### Backend (Python/Django)

```bash
# Todos os testes
docker-compose exec backend pytest

# Com cobertura
docker-compose exec backend pytest --cov=src

# Teste específico
docker-compose exec backend pytest src/tests/test_models.py::TestUserModel::test_create_user
```

### Frontend (React/Jest)

```bash
# Modo interativo
docker-compose exec frontend npm test

# Todos os testes uma vez
docker-compose exec frontend npm test -- --watchAll=false

# Com cobertura
docker-compose exec frontend npm run test:coverage
```

## Comandos Úteis

### Parar e Limpar

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpa o banco)
docker-compose down -v
```

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Acessar Shell dos Containers

```bash
# Backend (Python)
docker-compose exec backend bash

# Frontend (Node)
docker-compose exec frontend sh

# Database (PostgreSQL)
docker-compose exec db psql -U local_user -d local_db
```

### Django Admin

```bash
# Criar superusuário
docker-compose exec backend python manage.py createsuperuser

# Acessar admin
# http://localhost:8000/admin
```

## Desenvolvimento

### Modificar Código

Os volumes Docker estão configurados para hot-reload:

- **Backend**: Modifique arquivos em `backend/src/` - o Django recarrega automaticamente
- **Frontend**: Modifique arquivos em `frontend/src/` - o React recarrega automaticamente

### Adicionar Dependências

#### Backend (Python)

```bash
# Adicione ao requirements.txt
echo "nova-biblioteca==1.0.0" >> backend/requirements.txt

# Reinstale
docker-compose exec backend pip install -r requirements.txt

# Ou reconstrua
docker-compose up --build backend
```

#### Frontend (Node)

```bash
# Instale no container
docker-compose exec frontend npm install nova-biblioteca

# Ou adicione ao package.json e reconstrua
docker-compose up --build frontend
```

## Troubleshooting

### Porta já em uso

```bash
# Modifique as portas em infra/docker-compose.yml
# Exemplo: mudar de 3000:3000 para 3001:3000
```

### Erro de conexão com banco

```bash
# Verifique se o banco está rodando
docker-compose ps

# Verifique logs do banco
docker-compose logs db

# Recrie o banco
docker-compose down -v
docker-compose up -d db
docker-compose exec backend python manage.py migrate
```

### Módulos não encontrados

```bash
# Reconstrua os containers
docker-compose down
docker-compose up --build
```

## Próximos Passos

1. Explore a [documentação da API](http://localhost:8000/swagger/)
2. Leia o [README.md](./README.md) completo
3. Adicione novas funcionalidades seguindo TDD
4. Contribua com melhorias!
