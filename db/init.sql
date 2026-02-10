-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    theme_preference VARCHAR(20) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name, theme_preference) VALUES
('admin', 'admin@projetoflow.com', '$2b$12$IQv3/adTWKM6QQhYcVLkv.fgXfF8rkCFSU0ySJcwt6z7Pvo1GnwQS', 'Admin', 'User', 'dark'),
('user1', 'user1@projetoflow.com', '$2b$12$IQv3/adTWKM6QQhYcVLkv.fgXfF8rkCFSU0ySJcwt6z7Pvo1GnwQS', 'João', 'Silva', 'light'),
('user2', 'user2@projetoflow.com', '$2b$12$IQv3/adTWKM6QQhYcVLkv.fgXfF8rkCFSU0ySJcwt6z7Pvo1GnwQS', 'Maria', 'Santos', 'auto')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (user_id, name, description, status) 
SELECT id, 'Projeto Backend', 'Desenvolvimento da API RESTful', 'active'
FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO projects (user_id, name, description, status)
SELECT id, 'Projeto Frontend', 'Desenvolvimento da interface web', 'active'
FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (project_id, title, description, status, priority, due_date)
SELECT 
    p.id, 
    'Implementar autenticação', 
    'Criar sistema de login e registro',
    'in_progress',
    'high',
    CURRENT_DATE + INTERVAL '7 days'
FROM projects p
WHERE p.name = 'Projeto Backend'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (project_id, title, description, status, priority, due_date)
SELECT 
    p.id,
    'Implementar tema claro/escuro',
    'Adicionar funcionalidade de alternância de tema',
    'in_progress',
    'high',
    CURRENT_DATE + INTERVAL '5 days'
FROM projects p
WHERE p.name = 'Projeto Frontend'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (project_id, title, description, status, priority, due_date)
SELECT
    p.id,
    'Escrever testes',
    'Criação de testes unitários e integração',
    'pending',
    'medium',
    CURRENT_DATE + INTERVAL '14 days'
FROM projects p
WHERE p.name = 'Projeto Backend'
ON CONFLICT DO NOTHING;
