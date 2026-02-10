# Guia de Deployment

Documento para guiar o deployment da aplicação ProjetoFlow em produção.

## 📋 Checklist Pré-Deploy

- [ ] Todos os testes passando
- [ ] Código revisado e mergeado para `main`
- [ ] Versão bumped (CHANGELOG.md)
- [ ] Segredos configurados (não em repositório)
- [ ] Banco de dados backup realizado
- [ ] Plano de rollback preparado

## 🔧 Configuração de Produção

### 1. Variáveis de Ambiente

Crie arquivo `.env.production` com:

```env
# Security
DEBUG=False
SECRET_KEY=your-very-secure-key-here
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com,www.yourdomain.com

# Database
POSTGRES_USER=projetoflow_prod
POSTGRES_PASSWORD=strong_random_password
POSTGRES_DB=projetoflow_prod
POSTGRES_HOST=db.service.internal
POSTGRES_PORT=5432

# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com/api
NODE_ENV=production

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (opcional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 2. SSL/TLS (HTTPS)

```bash
# Usando Let's Encrypt com Certbot
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Renovação automática
sudo systemctl enable certbot.timer
```

### 3. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/projetoflow

upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com api.yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API Upstream
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS preflight
        if ($request_method = OPTIONS ) {
            return 200;
        }
    }

    # Admin
    location /admin {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;

        # Cache busting para arquivos
        location ~* \.(js|css)$ {
            expires 1y;
        }

        # HTML - sem cache
        location ~ index\.html$ {
            expires -1;
        }
    }

    # Healthcheck
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 4. Docker Compose Production

```yaml
# infra/docker-compose.prod.yml

version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - /data/postgresql:/var/lib/postgresql/data
    restart: always

  backend:
    build:
      context: .
      dockerfile: infra/Dockerfile.backend
    environment:
      DEBUG: 'False'
      SECRET_KEY: ${SECRET_KEY}
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    restart: always
    depends_on:
      - db
    volumes:
      - /var/log/backend:/app/logs

  frontend:
    build:
      context: .
      dockerfile: infra/Dockerfile.frontend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    restart: always
    depends_on:
      - backend
      - frontend

volumes:
  postgresql:
    name: projetoflow-pg-data
```

## 🚀 Deploy Steps

### 1. Prepare Server

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker & Docker Compose
curl -sSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
sudo mkdir -p /opt/projetoflow
sudo chown $USER:$USER /opt/projetoflow
```

### 2. Deploy Container

```bash
cd /opt/projetoflow

# Pull latest code
git clone <your-repo> .
git checkout main

# Copy production env
cp .env.production.example .env.production

# Edit with actual secrets
nano .env.production

# Start containers
docker-compose -f infra/docker-compose.prod.yml up -d

# Verify
docker-compose -f infra/docker-compose.prod.yml ps
```

### 3. Database Migration

```bash
docker-compose -f infra/docker-compose.prod.yml exec backend \
    python manage.py migrate

# Create superuser if needed
docker-compose -f infra/docker-compose.prod.yml exec backend \
    python manage.py createsuperuser
```

### 4. Static Files

```bash
docker-compose -f infra/docker-compose.prod.yml exec backend \
    python manage.py collectstatic --noinput
```

### 5. Backup Database

```bash
# Backup before deploy
docker-compose -f infra/docker-compose.prod.yml exec db \
    pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 📊 Monitoring

### Health Checks

```bash
# Backend
curl https://yourdomain.com/api/v1/health/

# Frontend
curl https://yourdomain.com/

# Database
docker-compose -f infra/docker-compose.prod.yml exec db pg_isready
```

### Logs

```bash
# All services
docker-compose -f infra/docker-compose.prod.yml logs -f

# Specific service
docker-compose -f infra/docker-compose.prod.yml logs -f backend

# With timestamps
docker-compose -f infra/docker-compose.prod.yml logs -f --timestamps
```

## 🔄 Update/Rollback

### Update

```bash
# Pull new code
git pull origin main

# Rebuild and restart
docker-compose -f infra/docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f infra/docker-compose.prod.yml exec backend \
    python manage.py migrate

# Verify health
curl https://yourdomain.com/health
```

### Rollback

```bash
# Revert to previous commit
git revert HEAD

# Rebuild
docker-compose -f infra/docker-compose.prod.yml up -d --build

# Restore database if needed
docker-compose -f infra/docker-compose.prod.yml exec db \
    psql -U $POSTGRES_USER < backup_<timestamp>.sql
```

## 🔐 Security Best Practices

- [ ] Change default credentials
- [ ] Update SECRET_KEY
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Configure firewall (ufw, iptables)
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Update dependencies regularly
- [ ] Use strong database password
- [ ] Limit CORS origins
- [ ] Rate limiting ativado
- [ ] DDoS protection (CloudFlare)

## 📈 Performance Tuning

### Database

```sql
-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Analyze
ANALYZE;
```

### Backend

- Gunicorn workers: `2 * CPU + 1`
- Timeouts: 120s
- Connection pooling

### Frontend

- Gzip compression
- CDN para static files
- Browser caching

## 🆘 Troubleshooting

### Issue: Database connection error

```bash
# Check pg_isready
docker-compose -f infra/docker-compose.prod.yml exec db pg_isready

# Check logs
docker-compose -f infra/docker-compose.prod.yml logs db

# Restart
docker-compose -f infra/docker-compose.prod.yml restart db
```

### Issue: Memory usage high

```bash
# Check container stats
docker stats

# Restart containers
docker-compose -f infra/docker-compose.prod.yml restart
```

## 📞 Support

- Documentation: /docs
- Issues: https://github.com/seu-usuario/ProjetoFlow/issues
- Email: support@projetoflow.com

---

Última atualização: Fevereiro 2026
