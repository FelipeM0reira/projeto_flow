-- init.sql
-- Script de inicialização do banco de dados PostgreSQL

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    theme_preference VARCHAR(10) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Inserir dados de exemplo
INSERT INTO users (username, email, password_hash, theme_preference) VALUES
    ('admin', 'admin@example.com', 'pbkdf2_sha256$600000$test$hash', 'dark'),
    ('user1', 'user1@example.com', 'pbkdf2_sha256$600000$test$hash', 'light'),
    ('user2', 'user2@example.com', 'pbkdf2_sha256$600000$test$hash', 'dark')
ON CONFLICT (username) DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully!';
END $$;
