#!/bin/bash

# Script de configuração inicial do projeto Theme Switcher
# Este script automatiza a configuração inicial do ambiente

set -e  # Sair em caso de erro

echo "======================================="
echo "Theme Switcher - Setup Inicial"
echo "======================================="
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    echo "   Visite: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker encontrado"

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose."
    echo "   Visite: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker Compose encontrado"
echo ""

echo "📦 Construindo containers Docker..."
docker-compose build

echo ""
echo "🚀 Iniciando containers..."
docker-compose up -d

echo ""
echo "⏳ Aguardando inicialização do banco de dados..."
sleep 10

echo ""
echo "🔄 Executando migrações do Django..."
docker-compose exec -T backend python manage.py migrate

echo ""
echo "======================================="
echo "✨ Setup concluído com sucesso!"
echo "======================================="
echo ""
echo "🌐 Acesse a aplicação:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/swagger/"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:         docker-compose logs -f"
echo "   Parar:            docker-compose down"
echo "   Reiniciar:        docker-compose restart"
echo "   Executar testes:  docker-compose exec backend pytest"
echo ""
echo "📚 Para mais informações, consulte:"
echo "   README.md"
echo "   QUICKSTART.md"
echo ""
