#!/bin/bash

# ProjetoFlow - Utility Scripts

## Build & Run Commands

# Build all Docker images
build() {
    echo "🏗️ Building Docker images..."
    docker-compose -f infra/docker-compose.yml build
    echo "✅ Build complete!"
}

# Start all services
start() {
    echo "🚀 Starting services..."
    docker-compose -f infra/docker-compose.yml up -d
    echo "✅ Services started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
    echo "API Docs: http://localhost:5000/api/docs"
}

# Stop all services
stop() {
    echo "⏹️ Stopping services..."
    docker-compose -f infra/docker-compose.yml down
    echo "✅ Services stopped!"
}

# View logs
logs() {
    docker-compose -f infra/docker-compose.yml logs -f
}

# Backend bash
backend-bash() {
    docker-compose -f infra/docker-compose.yml exec backend bash
}

# Database shell
db-shell() {
    docker-compose -f infra/docker-compose.yml exec db psql -U local_user -d local_db
}

# Run migrations
migrate() {
    echo "🔄 Running migrations..."
    docker-compose -f infra/docker-compose.yml exec backend python manage.py migrate
    echo "✅ Migrations complete!"
}

# Run tests
test() {
    # Backend tests
    echo "🧪 Running backend tests..."
    docker-compose -f infra/docker-compose.yml exec backend pytest
    
    # Frontend tests
    echo "🧪 Running frontend tests..."
    cd frontend && npm run test && cd ..
}

# Lint code
lint() {
    echo "🔍 Linting code..."
    docker-compose -f infra/docker-compose.yml exec backend flake8 src tests
    cd frontend && npm run lint && cd ..
    echo "✅ Lint complete!"
}

# Format code
format() {
    echo "🎨 Formatting code..."
    docker-compose -f infra/docker-compose.yml exec backend black src tests
    cd frontend && npm run format && cd ..
    echo "✅ Format complete!"
}

# Clean up
clean() {
    echo "🧹 Cleaning up..."
    docker-compose -f infra/docker-compose.yml down -v
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type d -name .pytest_cache -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete
    echo "✅ Cleanup complete!"
}

# Show help
help() {
    cat << EOF

ProjetoFlow Commands:

  build               - Build Docker images
  start               - Start all services
  stop                - Stop all services
  logs                - View service logs
  backend-bash        - Open backend shell
  db-shell            - Open database shell
  migrate             - Run database migrations
  test                - Run all tests
  lint                - Lint code
  format              - Format code
  clean               - Remove containers and volumes
  help                - Show this help message

Examples:
  ./scripts.sh build
  ./scripts.sh start
  ./scripts.sh test

EOF
}

# Execute command
"$@"
