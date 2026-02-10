# Guia de Solução de Problemas (Troubleshooting)

## Problemas Comuns e Soluções

### 1. ModuleNotFoundError: No module named 'backend'

**Causa**: Configuração incorreta do DJANGO_SETTINGS_MODULE

**Solução**:
```bash
# Pare os containers
cd infra
docker-compose down

# Reconstrua o backend
docker-compose build backend

# Inicie novamente
docker-compose up -d
```

Se persistir, verifique se o arquivo `backend/config/settings.py` existe.

---

### 2. Erro "port is already allocated"

**Causa**: Porta já está em uso

**Solução**:
```bash
# Opção 1: Pare o serviço que está usando a porta
# Descubra qual processo está usando a porta:
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Linux/Mac:
lsof -i :3000
lsof -i :8000

# Opção 2: Mude a porta no docker-compose.yml
# Em infra/docker-compose.yml, altere:
# frontend:
#   ports:
#     - "3001:3000"  # Mude de 3000 para 3001
```

---

### 3. Database connection error

**Causa**: Banco de dados não está pronto

**Solução**:
```bash
# Aguarde mais tempo ou reinicie apenas o DB
docker-compose restart db

# Aguarde 15 segundos
sleep 15

# Execute as migrações manualmente
docker-compose exec backend python manage.py migrate
```

---

### 4. Frontend não conecta ao backend

**Causa**: CORS ou URL incorreta

**Solução**:
```bash
# Verifique se o backend está rodando
docker-compose ps

# Verifique os logs do backend
docker-compose logs backend

# Certifique-se que a variável REACT_APP_API_URL está correta
# Em infra/.env:
REACT_APP_API_URL=http://localhost:8000
```

---

### 5. "npm install" falha no frontend

**Causa**: Problemas com dependências

**Solução**:
```bash
# Reconstrua o container do zero
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

---

### 6. Testes do backend falham

**Causa**: Banco de dados de teste não configurado

**Solução**:
```bash
# Execute os testes com as configurações corretas
docker-compose exec backend pytest --ds=config.settings

# Ou configure o pytest.ini corretamente (já deve estar ok)
```

---

### 7. Migrations error

**Causa**: Migrações desatualizadas ou conflitos

**Solução**:
```bash
# Crie novas migrações se necessário
docker-compose exec backend python manage.py makemigrations

# Execute as migrações
docker-compose exec backend python manage.py migrate

# Se houver erro, limpe e recrie
docker-compose down -v  # Remove volumes
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

---

### 8. Permission denied ao executar setup.sh

**Causa**: Script não tem permissão de execução

**Solução**:
```bash
# Linux/Mac
chmod +x setup.sh
./setup.sh

# Windows (use o .bat)
setup.bat
```

---

### 9. Docker daemon not running

**Causa**: Docker Desktop não está iniciado

**Solução**:
- Inicie o Docker Desktop
- Aguarde até ver o ícone verde
- Tente novamente

---

### 10. Frontend mostra página em branco

**Causa**: Erro no JavaScript

**Solução**:
```bash
# Veja o console do navegador (F12)
# Verifique os logs do frontend
docker-compose logs frontend

# Reconstrua o frontend
docker-compose down
docker-compose build frontend
docker-compose up -d
```

---

## Comandos de Diagnóstico

### Verificar status dos containers
```bash
docker-compose ps
```

### Ver logs em tempo real
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Acessar shell dos containers
```bash
# Backend
docker-compose exec backend bash
# Dentro do container:
python manage.py shell

# Frontend
docker-compose exec frontend sh
# Dentro do container:
npm list

# Database
docker-compose exec db psql -U local_user -d local_db
# Dentro do psql:
\dt  # Listar tabelas
\q   # Sair
```

### Resetar tudo
```bash
# ATENÇÃO: Isso apaga TUDO (inclusive o banco de dados)
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

---

## Verificação de Ambiente

### Pré-requisitos
```bash
# Verificar Docker
docker --version
# Deve mostrar: Docker version 20.x ou superior

# Verificar Docker Compose
docker-compose --version
# Deve mostrar: docker-compose version 1.29.x ou superior

# Verificar espaço em disco
df -h  # Linux/Mac
```

---

## Estrutura de Diretórios Esperada

```
my-project/
├── infra/
│   ├── Dockerfile.backend ✓
│   ├── Dockerfile.frontend ✓
│   ├── docker-compose.yml ✓
│   └── .env ✓
├── backend/
│   ├── manage.py ✓
│   ├── config/
│   │   └── settings.py ✓
│   ├── src/
│   └── requirements.txt ✓
├── frontend/
│   ├── package.json ✓
│   ├── public/
│   └── src/
└── db/
    └── init.sql ✓
```

---

## Contato para Suporte

Se nenhuma dessas soluções resolver seu problema:

1. Verifique a documentação completa no README.md
2. Consulte a documentação do Docker: https://docs.docker.com
3. Abra uma issue detalhando:
   - Sistema operacional
   - Versão do Docker
   - Comando executado
   - Erro completo
   - Logs relevantes

---

## Dicas de Prevenção

1. **Sempre verifique se o Docker está rodando** antes de executar comandos
2. **Aguarde os containers iniciarem** completamente (pode levar 30-60s)
3. **Use docker-compose logs** para investigar problemas
4. **Não edite arquivos dentro dos containers** - edite localmente e reconstrua
5. **Faça backup do .env** antes de alterações
6. **Mantenha o Docker atualizado**

---

**Última atualização**: 2024-02-10
