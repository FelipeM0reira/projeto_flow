-- init.sql
-- Script de inicialização do banco de dados PostgreSQL
-- O Django gerencia o schema via migrations (python manage.py migrate)
-- Este arquivo apenas garante que o banco está criado e pronto.

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Database projetoflow_db initialized successfully!';
    RAISE NOTICE 'Django migrations will create the schema automatically.';
END $$;
