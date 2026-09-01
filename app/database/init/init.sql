-- PostgreSQL initialization script for TaskFlow
-- The database is already created by the POSTGRES_DB env var
-- This script runs automatically when the PostgreSQL container starts

\c taskmanager

-- Tasks table (managed by Flyway migrations in Java backend, but created here for direct Python access)
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);

-- Seed data
INSERT INTO tasks (title, description, status, priority) VALUES
    ('Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'IN_PROGRESS', 'HIGH'),
    ('Write unit tests', 'Add comprehensive unit tests for the task service layer', 'TODO', 'MEDIUM'),
    ('Update documentation', 'Review and update README with deployment instructions', 'DONE', 'LOW'),
    ('Containerize services', 'Create Dockerfiles and docker-compose for all services', 'IN_PROGRESS', 'HIGH'),
    ('Set up monitoring', 'Configure Prometheus and Grafana for observability', 'TODO', 'MEDIUM')
ON CONFLICT DO NOTHING;
