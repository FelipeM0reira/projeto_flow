.PHONY: help build up down logs migrate test lint format clean dev-backend dev-frontend

help:
	@echo "ProjetoFlow Project Commands"
	@echo "============================"
	@echo "make build          - Build Docker images"
	@echo "make up             - Start all containers"
	@echo "make down           - Stop all containers"
	@echo "make logs           - View container logs"
	@echo "make migrate        - Run database migrations"
	@echo "make test           - Run all tests"
	@echo "make lint           - Run linters"
	@echo "make format         - Format code"
	@echo "make clean          - Remove containers and volumes"
	@echo "make dev-backend    - Start backend in development mode"
	@echo "make dev-frontend   - Start frontend in development mode"

build:
	docker-compose -f infra/docker-compose.yml build

up:
	docker-compose -f infra/docker-compose.yml up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"
	@echo "API Docs: http://localhost:5000/api/docs"

down:
	docker-compose -f infra/docker-compose.yml down

logs:
	docker-compose -f infra/docker-compose.yml logs -f

logs-backend:
	docker-compose -f infra/docker-compose.yml logs -f backend

logs-frontend:
	docker-compose -f infra/docker-compose.yml logs -f frontend

logs-db:
	docker-compose -f infra/docker-compose.yml logs -f db

migrate:
	docker-compose -f infra/docker-compose.yml exec backend python manage.py migrate

makemigrations:
	docker-compose -f infra/docker-compose.yml exec backend python manage.py makemigrations

createsuperuser:
	docker-compose -f infra/docker-compose.yml exec backend python manage.py createsuperuser

test:
	docker-compose -f infra/docker-compose.yml exec backend pytest

test-cov:
	docker-compose -f infra/docker-compose.yml exec backend pytest --cov=src --cov-report=html

test-frontend:
	cd frontend && npm run test

test-all: test test-frontend

lint:
	docker-compose -f infra/docker-compose.yml exec backend flake8 src tests

format:
	docker-compose -f infra/docker-compose.yml exec backend black src tests

clean:
	docker-compose -f infra/docker-compose.yml down -v
	find . -type d -name __pycache__ -delete
	find . -type d -name .pytest_cache -delete
	find . -type d -name node_modules -delete
	find . -type f -name "*.pyc" -delete

dev-backend:
	cd backend && python manage.py runserver 0.0.0.0:5000

dev-frontend:
	cd frontend && npm run dev

shell-backend:
	docker-compose -f infra/docker-compose.yml exec backend bash

shell-db:
	docker-compose -f infra/docker-compose.yml exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

restart:
	docker-compose -f infra/docker-compose.yml restart
