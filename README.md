# NestJS Authentication & Authorization Starter

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-orange.svg)](https://typeorm.io/)
[![Database](https://img.shields.io/badge/Database-TypeORM-blue.svg)](https://typeorm.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![TsRest](https://img.shields.io/badge/TsRest-3.x-purple.svg)](https://ts-rest.com/)

A production-ready NestJS authentication and authorization starter project featuring clean architecture, JWT authentication, role-based access control, type-safe APIs with TsRest contracts, and comprehensive Docker setup.

## 🚀 Features

- **🔐 JWT Authentication**: Secure token-based authentication with refresh tokens
- **👥 Role-Based Access Control**: Comprehensive RBAC with permissions and URL pattern matching
- **🎯 Type Safety**: Full type safety with TsRest contracts and Zod validation
- **🗄️ Database Integration**: Type-safe database operations with TypeORM migrations (MySQL optimized, supports PostgreSQL, SQLite, etc.)
- **🛡️ Security Best Practices**: Bcrypt password hashing, rate limiting, CORS, SQL injection protection
- **📚 API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **🐳 Docker Ready**: Complete containerization with database and Adminer UI
- **📊 Health Monitoring**: Built-in health checks and logging service
- **🔄 Hot Reload**: Development environment with automatic code reloading
- **🧪 Testing Framework**: Jest testing setup with comprehensive coverage
- **⚡ Performance**: Request throttling and optimized database queries
- **📝 Structured Logging**: Custom logging service with structured output

## 📋 Table of Contents

- [Technologies](#technologies)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🛠️ Technologies

- **Backend**: NestJS with TypeScript
- **Database**: TypeORM with MySQL support (configured and optimized), also supports PostgreSQL, MariaDB, SQLite, and more
- **Authentication**: JWT with Passport strategies
- **API Contracts**: TsRest for type-safe APIs
- **Validation**: Zod schemas for runtime type safety
- **Architecture**: Modular NestJS architecture with dependency injection
- **Testing**: Jest with comprehensive test coverage
- **Development**: ESLint, Prettier, TypeScript strict mode
- **Containerization**: Docker, Docker Compose

### TsRest Integration

The project uses TsRest for type-safe API contracts:

```typescript
// Shared contracts between client and server
const authContract = c.router({
  register: {
    method: "POST",
    path: "/auth/register",
    body: RegisterSchema,
    responses: {
      201: AuthResponseSchema,
      400: ErrorSchema,
    },
  },
  login: {
    method: "POST",
    path: "/auth/login",
    body: LoginSchema,
    responses: {
      200: AuthResponseSchema,
      401: ErrorSchema,
    },
  },
});
```

**Key Features:**

- **Type Safety**: End-to-end type safety from client to server
- **Zod Validation**: Runtime validation with compile-time types
- **OpenAPI Generation**: Automatic Swagger documentation
- **Contract-First**: Define API contracts once, use everywhere

## ⚡ Quick Start

You have two options to run this application:

### Option 1: Full Docker Setup (Recommended)

Complete containerization with automatic migrations and MySQL database.

1. **Clone the repository**:

```bash
git clone <repository-url>
cd NestJsBaseSetupTypeORM
```

2. **Start with Docker (includes automatic migrations)**:

```bash
# Start all services (MySQL + NestJS + Adminer)
# This automatically creates the database, runs migrations, and starts the app
docker compose up -d --build
```

3. **Monitor the startup**:

```bash
# Watch logs to see migration progress
docker compose logs -f

# Check specific services
docker compose logs -f nestJs-db    # MySQL database
docker compose logs -f nestJs-api   # NestJS application
```

4. **Access the application**:
   - **API**: http://localhost:3000
   - **Swagger UI**: http://localhost:3000/api
   - **Adminer (DB UI)**: http://localhost:8080
     - Server: `mysql`
     - Username: `root`
     - Password: `Password_2547422`
     - Database: `nestJs`
   - **MySQL Direct Access**: `localhost:3307` (external port)

### Option 2: Local Development with Docker MySQL

Run the application locally while using Docker for MySQL database only.

1. **Clone and setup**:

```bash
git clone <repository-url>
cd NestJsBaseSetupTypeORM
nvm use 22
corepack enable
yarn install
```

2. **Create environment file**:

```bash
# Create .env for local development with Docker MySQL
cat > .env << EOF
# Database Configuration (Docker MySQL)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=Password_2547422
DB_NAME=nestJs
DB_SYNCHRONIZE=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_TOKEN_EXPIRY=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-for-development
JWT_REFRESH_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Application
NODE_ENV=development
PORT=3000
EOF
```

3. **Start MySQL in Docker**:

```bash
# Start only the MySQL database
docker compose up -d mysql
```

4. **Run migrations**:

```bash
# Wait for MySQL to be ready (about 30 seconds), then run migrations
yarn migration:run
```

5. **Start the application locally**:

```bash
# Start with hot reload
yarn start:dev
```

6. **Access the application**:
   - **API**: http://localhost:3000
   - **Swagger UI**: http://localhost:3000/api

## 💻 Local Installation with Local MySQL

If you prefer to use your own local MySQL installation instead of Docker.

### Prerequisites

- Node.js (>=22.x)
- Yarn package manager
- Local MySQL server running

### Setup Steps

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd NestJsBaseSetupTypeORM
nvm use 22
corepack enable
yarn install
```

2. **Setup local MySQL database**:

```bash
# Connect to MySQL and create database
mysql -u root -p
CREATE DATABASE nestJs;
exit
```

3. **Configure environment for local MySQL**:

```bash
# Create .env for local MySQL
cat > .env << EOF
# Database Configuration (Local MySQL)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nestJs
DB_SYNCHRONIZE=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_TOKEN_EXPIRY=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-for-development
JWT_REFRESH_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Application
NODE_ENV=development
PORT=3000
EOF
```

4. **Run migrations**:

```bash
yarn migration:run
```

5. **Start the application**:

```bash
yarn start:dev
```

## 🐳 Docker Setup

Complete Docker setup with MySQL database, automatic migrations, and Adminer for database management.

### Key Features

- **🚀 Automatic Migrations**: Migrations run automatically when the container starts
- **🔄 Health Checks**: Both MySQL and NestJS containers have health monitoring
- **🛠️ Development Ready**: Hot reload and debug support
- **📊 Database UI**: Adminer for easy database management

### Quick Start

```bash
# Start all services with automatic migrations
docker compose up -d --build

# View logs to monitor startup and migrations
docker compose logs -f

# Stop all services
docker compose down
```

### Individual Service Management

```bash
# Start only MySQL database
docker compose up -d mysql

# Start only the NestJS application (requires MySQL to be running)
docker compose up -d api

# View specific service logs
docker compose logs -f nestJs-db    # MySQL logs
docker compose logs -f nestJs-api   # Application logs
```

### Docker Services

- **NestJS App**: http://localhost:3000 (with automatic migration runner)
- **MySQL Database**: localhost:3307 (external), internal port 3306
- **Adminer**: http://localhost:8080

### Docker Commands

```bash
# Rebuild containers
docker compose up -d --build

# Stop and remove containers (keeps data)
docker compose down

# Stop and remove containers + volumes (⚠️ deletes all data)
docker compose down -v

# View container status
docker ps

# Access MySQL container directly
docker exec -it nestJs-db mysql -u root -p

# View detailed logs
docker compose logs --tail=100 -f nestJs-api
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints (Public)

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| `POST` | `/auth/register` | User registration | ❌            |
| `POST` | `/auth/login`    | User login        | ❌            |

### Authentication Endpoints (Protected)

| Method | Endpoint                | Description      | Auth Required |
| ------ | ----------------------- | ---------------- | ------------- |
| `GET`  | `/auth/profile`         | Get user profile | ✅            |
| `POST` | `/auth/change-password` | Change password  | ✅            |

### Users Management

| Method   | Endpoint     | Description    | Pagination  |
| -------- | ------------ | -------------- | ----------- |
| `GET`    | `/users`     | List users     | ✅ Optional |
| `POST`   | `/users`     | Create user    | ❌          |
| `GET`    | `/users/:id` | Get user by ID | ❌          |
| `PATCH`  | `/users/:id` | Update user    | ❌          |
| `DELETE` | `/users/:id` | Delete user    | ❌          |

### Roles Management

| Method   | Endpoint     | Description    | Pagination  |
| -------- | ------------ | -------------- | ----------- |
| `GET`    | `/roles`     | List roles     | ✅ Optional |
| `POST`   | `/roles`     | Create role    | ❌          |
| `GET`    | `/roles/:id` | Get role by ID | ❌          |
| `PATCH`  | `/roles/:id` | Update role    | ❌          |
| `DELETE` | `/roles/:id` | Delete role    | ❌          |

### Permissions Management

| Method   | Endpoint           | Description          | Pagination  |
| -------- | ------------------ | -------------------- | ----------- |
| `GET`    | `/permissions`     | List permissions     | ✅ Optional |
| `POST`   | `/permissions`     | Create permission    | ❌          |
| `GET`    | `/permissions/:id` | Get permission by ID | ❌          |
| `PATCH`  | `/permissions/:id` | Update permission    | ❌          |
| `DELETE` | `/permissions/:id` | Delete permission    | ❌          |

### Health & Status

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `GET`  | `/health` | Application health check |

## 📄 Pagination

All list endpoints support optional pagination with comprehensive metadata.

### Usage

```bash
# Basic pagination
GET /api/users?page=1&limit=10

# Without pagination (returns all)
GET /api/users
```

### Response Format

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "roles": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🏗️ Project Structure

```
src/
├── 📁 common/
│   ├── base-entity.ts              # Base entity with common fields
│   ├── base.service.ts             # Base service with CRUD operations
│   ├── decorators/                 # Custom decorators
│   └── types/                      # Zod schemas and type definitions
├── 📁 config/
│   ├── app.config.ts              # Application configuration
│   └── database.config.ts         # TypeORM database configuration
├── 📁 contracts/                  # TsRest API contracts
│   ├── auth.ts                    # Authentication endpoints
│   ├── users.ts                   # User management endpoints
│   ├── roles.ts                   # Role management endpoints
│   ├── permissions.ts             # Permission management endpoints
│   └── index.ts                   # Combined API contract
├── 📁 db/
│   ├── migrations/                # Database migrations
│   │   ├── 1700000001000-CreatePermissions.ts
│   │   ├── 1700000002000-CreateRoles.ts
│   │   ├── 1700000003000-CreateUsers.ts
│   │   └── 1700000004000-CreateJunctionTables.ts
│   └── seeds/                     # Database seeding
│       ├── 1-create-permissions.seed.ts
│       ├── 2-create-roles.seed.ts
│       ├── 3-create-users.seed.ts
│       ├── index.ts               # Seed runner
│       └── run-seeds.ts           # Standalone seed script
├── 📁 interfaces/
│   ├── user.interface.ts          # User interface definitions
│   └── jwt.payload.ts             # JWT payload interface
├── 📁 modules/
│   ├── 📁 auth/                   # Authentication module
│   │   ├── guards/                # Auth guards (JWT, Local)
│   │   ├── strategies/            # Passport strategies
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   ├── auth.service.ts        # Auth business logic
│   │   └── auth.module.ts         # Auth module definition
│   ├── 📁 logger/                 # Custom logging service
│   ├── 📁 permissions/            # Permissions management
│   ├── 📁 roles/                  # Roles management
│   ├── 📁 seeder/                 # Database seeding service
│   └── 📁 users/                  # User management
├── 📄 app.module.ts               # Main application module
└── 📄 main.ts                     # Application entry point
```

## 🏛️ NestJS Architecture

Our application implements clean NestJS architecture with modular design:

### Modular Structure

```typescript
// Each module is self-contained with its own:
-Controller - // Handle HTTP requests
  Service - // Business logic
  Repository - // Data access (via TypeORM)
  DTOs - // Data transfer objects with validation
  Guards - // Route protection
  Decorators; // Custom functionality
```

### Base Service Pattern

```typescript
// Common operations available to all services
-findAll(options) -
  findOne(id, relations) -
  create(createDto) -
  update(id, updateDto) -
  remove(id) -
  findWithPagination(page, limit, options);
```

### Benefits

- **Dependency Injection**: Automatic dependency management
- **Modular Design**: Features organized in self-contained modules
- **Type Safety**: Full TypeScript support with decorators
- **Testability**: Easy mocking and unit testing
- **Scalability**: Easy to add new features and modules

## 🔐 Authentication Flow

The API uses JWT-based authentication with role-based access control and refresh tokens.

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Authentication Flow Steps

1. **Registration**: Create account with name, email, password
2. **Login**: Authenticate with email/password → receive JWT + refresh tokens
3. **Protected Routes**: Include JWT token in Authorization header
4. **RBAC**: Users have roles, roles have permissions for granular access control
5. **Token Refresh**: Use refresh token to get new access tokens

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts with authentication data
- **roles**: User roles for RBAC
- **permissions**: Granular permissions with URL patterns
- **user_roles**: Many-to-many relationship between users and roles
- **role_permission**: Many-to-many relationship between roles and permissions

### Sample Data Structure

```typescript
// User Entity
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  roles: [{ id: 1, name: "admin", permissions: [...] }],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}

// Permission Entity
{
  id: 1,
  name: "users:read",
  url: "/api/users",
  regex: "^/api/users.*$",
  createdAt: "2024-01-01T00:00:00Z"
}

// Role Entity
{
  id: 1,
  name: "admin",
  permissions: [...],
  users: [...],
  createdAt: "2024-01-01T00:00:00Z"
}
```

## 🌍 Environment Variables

### Required Variables

```bash
# Database Configuration (MySQL - current setup)
DB_TYPE=mysql                  # mysql | postgres | mariadb | sqlite | mssql | oracle
DB_HOST=localhost              # 'mysql' for Docker, 'localhost' for local
DB_PORT=3307                   # 3307 for Docker MySQL (external), 3306 for local MySQL
DB_USER=root                   # Database username
DB_PASSWORD=Password_2547422   # Database password
DB_NAME=nestJs                 # Database name
DB_SYNCHRONIZE=false           # Never use true in production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_TOKEN_EXPIRY=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-for-development
JWT_REFRESH_EXPIRY=7d

# Application Configuration
NODE_ENV=development           # development | production | test
PORT=3000

# Rate Limiting
RATE_LIMIT_TTL=60             # Time window in seconds
RATE_LIMIT_LIMIT=100          # Max requests per time window
```

### Docker Environment Variables

The Docker containers use these environment variables automatically:

```bash
# MySQL Container Configuration (set in docker-compose.yml)
MYSQL_ROOT_PASSWORD=Password_2547422
MYSQL_DATABASE=nestJs

# NestJS Container Configuration (set in docker-compose.yml)
DB_TYPE=mysql
DB_HOST=mysql                  # Service name in Docker network
DB_PORT=3306                   # Internal container port
DB_USER=root
DB_PASSWORD=Password_2547422
DB_NAME=nestJs
DB_SYNCHRONIZE=false
```

### Local vs Docker Configuration

| Setting       | Local MySQL     | Docker MySQL       | Docker Compose     |
| ------------- | --------------- | ------------------ | ------------------ |
| `DB_HOST`     | `localhost`     | `localhost`        | `mysql`            |
| `DB_PORT`     | `3306`          | `3307`             | `3306`             |
| `DB_USER`     | `root`          | `root`             | `root`             |
| `DB_PASSWORD` | `your_password` | `Password_2547422` | `Password_2547422` |
| `DB_NAME`     | `nestJs`        | `nestJs`           | `nestJs`           |

## 🧪 API Testing Examples

### Test with curl

```bash
# Health check
curl http://localhost:3000/health

# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get paginated users (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/users?page=1&limit=5"

# Create a new role (requires authentication)
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Editor",
    "permissions": [1, 2, 3]
  }'
```

### Test with Postman

1. Import the API endpoints into Postman
2. Set the base URL: `http://localhost:3000/api`
3. For protected routes, add JWT token in Authorization header as Bearer token
4. Use the auto-generated Swagger UI at http://localhost:3000/api for interactive testing

## 🗄️ Database Migrations & Seeding

### Migrations

Database migrations manage schema changes and ensure consistent database structure across environments.

#### Migration Commands

```bash
# Generate a new migration (after changing entities)
yarn migration:generate src/db/migrations/YourMigrationName

# Run pending migrations
yarn migration:run

# Revert the last migration
yarn migration:revert

# Show migration status
yarn migration:show

# Direct TypeORM CLI access
yarn typeorm [command]
```

#### Existing Migrations

The project includes these pre-built migrations:

1. **`1700000001000-CreatePermissions.ts`** - Creates permissions table with URL pattern matching
2. **`1700000002000-CreateRoles.ts`** - Creates roles table
3. **`1700000003000-CreateUsers.ts`** - Creates users table with authentication fields
4. **`1700000004000-CreateJunctionTables.ts`** - Creates many-to-many relationship tables

All migrations are MySQL-optimized with proper AUTO_INCREMENT configuration.

### Database Seeding

Automatic seeding creates initial data for development and testing.

#### Seed Data Included

**Permissions:**

- `all:*` - Full system access (regex: `.*`)
- `users:read` - Read user data
- `users:write` - Manage users
- `roles:read` - Read roles
- `roles:write` - Manage roles
- `permissions:read` - Read permissions
- `permissions:write` - Manage permissions

**Roles:**

- `super_admin` - Full access (`all:*` permission)
- `admin` - User management (`users:read`, `users:write`)
- `user` - Read-only user access (`users:read`)

**Users:** (password: `password123` for all)

- `superadmin@example.com` - Super Administrator
- `admin@example.com` - Administrator
- `user@example.com` - Regular User
- `test@example.com` - Test User

#### Seeding Commands

```bash
# Run seeds manually (requires database connection)
yarn seed

# Seeds run automatically in Docker
docker compose up -d --build  # Includes automatic seeding
```

#### Seeding Behavior

- ✅ **Automatic**: Seeds run when Docker containers start
- ✅ **Idempotent**: Safe to run multiple times (checks for existing data)
- ✅ **Ordered**: Permissions → Roles → Users (maintains relationships)
- ✅ **Logged**: All operations logged with custom logger

### Database Development Workflow

```bash
# 1. Make entity changes
# Edit src/modules/*/entities/*.entity.ts

# 2. Generate migration
yarn migration:generate src/db/migrations/YourChangeName

# 3. Review generated migration
# Edit src/db/migrations/[timestamp]-YourChangeName.ts

# 4. Run migration
yarn migration:run

# 5. Update seeds if needed
# Edit src/db/seeds/*.seed.ts

# 6. Test with fresh database
docker compose down -v && docker compose up -d --build
```

## 🔧 Development Commands

```bash
# Development
yarn start:dev          # Start with watch mode
yarn start:debug        # Start with debug mode

# Building
yarn build              # Build for production
yarn start:prod         # Start production build

# Database
yarn migration:generate # Generate new migration
yarn migration:run      # Run pending migrations
yarn migration:revert   # Revert last migration
yarn migration:show     # Show migration status
yarn seed               # Run database seeds manually

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run end-to-end tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier

# Docker
yarn docker:build       # Build Docker image
yarn docker:up          # Start Docker containers
yarn docker:down        # Stop Docker containers
yarn docker:logs        # View container logs
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow NestJS best practices and architectural patterns
- Add comprehensive tests for new features
- Use TsRest contracts for new API endpoints
- Include proper error handling and validation
- Write meaningful commit messages
- Update documentation for new features
- Add database migrations for schema changes
- Follow the existing code style (ESLint + Prettier)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - **Docker**: Check if MySQL container is running: `docker ps`
   - **Local**: Verify MySQL server is running: `sudo systemctl status mysql`
   - Verify environment variables in `.env`
   - Check logs: `docker compose logs nestJs-db`

2. **Port Already in Use (MySQL)**:
   - **Error**: `failed to bind host port for 0.0.0.0:3306`
   - **Solution**: We use port 3307 externally to avoid conflicts with local MySQL
   - If 3307 is also in use, change it in `docker-compose.yml`

3. **Migration Issues**:
   - **Automatic migrations not running**: Check Docker logs: `docker compose logs nestJs-api`
   - **Manual migration fails**: Ensure database is accessible and `.env` is correct
   - **MySQL user issues**: Don't use `MYSQL_USER=root` in Docker (we fixed this)
   - Run `yarn migration:show` to check status

4. **Docker MySQL Container Unhealthy**:
   - **Root cause**: Usually incorrect environment variables
   - **Check logs**: `docker compose logs nestJs-db`
   - **Common fix**: Remove `MYSQL_USER` when using root user

5. **Application Startup Issues**:
   - **Port conflicts**: Change port in `.env` or `docker-compose.yml`
   - **Route conflicts**: Fixed with proper OpenAPI operation ID generation
   - Kill existing process: `lsof -ti:3000 | xargs kill`

6. **JWT Token Issues**:
   - Verify JWT_SECRET in environment variables
   - Check token expiry settings
   - Ensure proper Authorization header format: `Bearer <token>`

7. **Permission Denied (Docker)**:
   - Check Docker permissions
   - Ensure user is in docker group: `sudo usermod -aG docker $USER`
   - Restart Docker service: `sudo systemctl restart docker`

8. **Node.js Version Issues**:
   - Use Node.js 22.x: `nvm use 22`
   - Clear node_modules and reinstall: `rm -rf node_modules && yarn install`

9. **TypeORM Migration Errors**:
   - **"Given data source file must contain only one export"**: Fixed by removing named exports
   - **"timestamp with time zone not supported"**: Fixed by using MySQL-compatible timestamp types
   - **Connection timeouts**: Wait for MySQL to be fully ready (30+ seconds on first start)

10. **Local MySQL vs Docker MySQL**:
    - **Local**: Use port 3306, your local credentials
    - **Docker**: Use port 3307 externally, `Password_2547422` password
    - **Mixed setup**: Local app + Docker MySQL uses port 3307

## 📞 Support

For support, create an issue in the repository or contact the development team.

---

**Built with ❤️ using NestJS, TypeORM, and Docker**
