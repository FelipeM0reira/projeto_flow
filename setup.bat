@echo off
REM Script de configuração inicial do projeto Theme Switcher para Windows

echo =======================================
echo Theme Switcher - Setup Inicial
echo =======================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Docker nao encontrado. Por favor, instale o Docker Desktop.
    echo   Visite: https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)

echo OK Docker encontrado

REM Verificar se Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Docker Compose nao encontrado.
    exit /b 1
)

echo OK Docker Compose encontrado
echo.

REM Navegar para o diretório infra
cd infra

echo Construindo containers Docker...
docker-compose build

echo.
echo Iniciando containers...
docker-compose up -d

echo.
echo Aguardando inicializacao do banco de dados...
timeout /t 10 /nobreak >nul

echo.
echo Executando migracoes do Django...
docker-compose exec -T backend python manage.py migrate

echo.
echo =======================================
echo Setup concluido com sucesso!
echo =======================================
echo.
echo Acesse a aplicacao:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/swagger/
echo.
echo Comandos uteis:
echo   Ver logs:         docker-compose logs -f
echo   Parar:            docker-compose down
echo   Reiniciar:        docker-compose restart
echo   Executar testes:  docker-compose exec backend pytest
echo.
echo Para mais informacoes, consulte:
echo   README.md
echo   QUICKSTART.md
echo.
pause
