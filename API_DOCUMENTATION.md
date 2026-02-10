# Documentação da API

## Base URL
```
http://localhost:8000/api
```

## Autenticação
Atualmente, a API não requer autenticação (desenvolvimento). Em produção, será necessário implementar JWT ou similar.

## Endpoints

### Users

#### Listar Usuários
```http
GET /api/users/
```

**Resposta de Sucesso (200 OK):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "theme_preference": "dark",
      "created_at": "2024-02-10T10:00:00Z",
      "updated_at": "2024-02-10T10:00:00Z"
    }
  ]
}
```

#### Criar Usuário
```http
POST /api/users/
Content-Type: application/json
```

**Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "theme_preference": "light"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": 4,
  "username": "newuser",
  "email": "newuser@example.com",
  "theme_preference": "light",
  "created_at": "2024-02-10T11:00:00Z",
  "updated_at": "2024-02-10T11:00:00Z"
}
```

**Erros:**
- `400 Bad Request` - Dados inválidos ou usuário/email já existente

#### Obter Usuário
```http
GET /api/users/{id}/
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "theme_preference": "dark",
  "created_at": "2024-02-10T10:00:00Z",
  "updated_at": "2024-02-10T10:00:00Z"
}
```

**Erros:**
- `404 Not Found` - Usuário não encontrado

#### Atualizar Usuário (Completo)
```http
PUT /api/users/{id}/
Content-Type: application/json
```

**Body:**
```json
{
  "username": "updateduser",
  "email": "updated@example.com",
  "theme_preference": "dark"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "username": "updateduser",
  "email": "updated@example.com",
  "theme_preference": "dark",
  "created_at": "2024-02-10T10:00:00Z",
  "updated_at": "2024-02-10T12:00:00Z"
}
```

#### Atualizar Usuário (Parcial)
```http
PATCH /api/users/{id}/
Content-Type: application/json
```

**Body:**
```json
{
  "theme_preference": "dark"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "theme_preference": "dark",
  "created_at": "2024-02-10T10:00:00Z",
  "updated_at": "2024-02-10T12:00:00Z"
}
```

#### Deletar Usuário
```http
DELETE /api/users/{id}/
```

**Resposta de Sucesso (204 No Content):**
```
(sem corpo de resposta)
```

**Erros:**
- `404 Not Found` - Usuário não encontrado

### Theme Management

#### Atualizar Preferência de Tema
```http
PATCH /api/users/{id}/theme/
Content-Type: application/json
```

**Body:**
```json
{
  "theme_preference": "dark"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "theme_preference": "dark",
  "created_at": "2024-02-10T10:00:00Z",
  "updated_at": "2024-02-10T12:30:00Z"
}
```

**Erros:**
- `400 Bad Request` - Valor de tema inválido (deve ser 'light' ou 'dark')
- `404 Not Found` - Usuário não encontrado

#### Obter Tema Atual
```http
GET /api/users/{id}/get_theme/
```

**Resposta de Sucesso (200 OK):**
```json
{
  "theme_preference": "dark"
}
```

**Erros:**
- `404 Not Found` - Usuário não encontrado

## Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Recurso deletado com sucesso |
| 400 | Bad Request - Dados inválidos ou erro de validação |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## Validações

### Username
- Obrigatório
- Único no sistema
- Máximo 150 caracteres

### Email
- Obrigatório
- Único no sistema
- Formato de email válido
- Máximo 254 caracteres

### Password
- Obrigatório apenas na criação
- Nunca retornado nas respostas
- Armazenado como hash (PBKDF2)

### Theme Preference
- Valores aceitos: 'light' ou 'dark'
- Padrão: 'light'

## Exemplos de Uso

### cURL

```bash
# Listar usuários
curl http://localhost:8000/api/users/

# Criar usuário
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123",
    "theme_preference": "dark"
  }'

# Atualizar tema
curl -X PATCH http://localhost:8000/api/users/1/theme/ \
  -H "Content-Type: application/json" \
  -d '{"theme_preference": "light"}'

# Deletar usuário
curl -X DELETE http://localhost:8000/api/users/1/
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Listar usuários
const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users/`);
  return response.data;
};

// Criar usuário
const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/`, userData);
  return response.data;
};

// Atualizar tema
const updateTheme = async (userId, theme) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/theme/`,
    { theme_preference: theme }
  );
  return response.data;
};

// Deletar usuário
const deleteUser = async (userId) => {
  await axios.delete(`${API_URL}/users/${userId}/`);
};
```

### Python (requests)

```python
import requests

API_URL = 'http://localhost:8000/api'

# Listar usuários
response = requests.get(f'{API_URL}/users/')
users = response.json()

# Criar usuário
new_user = {
    'username': 'johndoe',
    'email': 'john@example.com',
    'password': 'securepass123',
    'theme_preference': 'dark'
}
response = requests.post(f'{API_URL}/users/', json=new_user)
user = response.json()

# Atualizar tema
response = requests.patch(
    f'{API_URL}/users/1/theme/',
    json={'theme_preference': 'light'}
)
updated_user = response.json()

# Deletar usuário
requests.delete(f'{API_URL}/users/1/')
```

## Swagger UI

Para uma interface interativa e completa da API, acesse:
- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

## Rate Limiting

Atualmente não há rate limiting implementado. Em produção, considere implementar:
- Throttling por IP
- Throttling por usuário autenticado
- Limites diferentes para endpoints sensíveis

## CORS

Durante o desenvolvimento, CORS está configurado para aceitar requisições de:
- http://localhost:3000
- http://127.0.0.1:3000

Em produção, configure apenas os domínios necessários.
