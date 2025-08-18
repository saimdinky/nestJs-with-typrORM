-- This file will be executed when the PostgreSQL container starts for the first time
-- Create the database if it doesn't exist (this is already handled by POSTGRES_DB env var)

-- Extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial data here that should be inserted after migrations run
-- For example, default permissions, roles, etc.

-- This file is mainly for Docker setup
-- The actual schema will be created by TypeORM migrations 