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
- **🗄️ Database Integration**: Type-safe database operations with TypeORM migrations (supports PostgreSQL, MySQL, SQLite, etc.)
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
- **Database**: TypeORM with support for PostgreSQL, MySQL, MariaDB, SQLite, and more
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
    method: 'POST',
    path: '/auth/register',
    body: RegisterSchema,
    responses: {
      201: AuthResponseSchema,
      400: ErrorSchema,
    },
  },
  login: {
    method: 'POST',
    path: '/auth/login',
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

### Using Docker (Recommended)

1. **Clone the repository**:

```bash
git clone <repository-url>
cd NestJsBaseSetupTypeORM
```

2. **Create environment file**:

```bash
# Create .env
cat > .env << EOF
# Database Configuration (PostgreSQL example - can be configured for other databases)
DB_TYPE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_starter_db
DB_SYNCHRONIZE=false

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_TOKEN_EXPIRY=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRY=7d

# Application
NODE_ENV=development
PORT=3000

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100
EOF
```

3. **Setup Node.js version and dependencies**:

```bash
nvm use 22
corepack enable
yarn install
```

4. **Start with Docker**:

```bash
# Start all services (Database + NestJS + Adminer)
yarn docker:up

# Or build and start
yarn docker:build
yarn docker:up
```

5. **Run database migrations**:

```bash
# Wait for containers to be ready, then run migrations
yarn migration:run
```

6. **Access the application**:
   - **API**: http://localhost:3000
   - **Swagger UI**: http://localhost:3000/api
   - **Adminer (DB UI)**: http://localhost:8080
     - Server: `postgres` (or your configured database host)
     - Username: `postgres` (or your configured username)
     - Password: `postgres` (or your configured password)
     - Database: `auth_starter_db` (or your configured database name)

## 💻 Local Installation

### Prerequisites

- Node.js (>=22.x)
- Yarn package manager
- Database (PostgreSQL, MySQL, SQLite, etc. - as supported by TypeORM)

### Setup Steps

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd NestJsBaseSetupTypeORM
nvm use 22
corepack enable
yarn install
```

2. **Configure environment**:

```bash
# Create .env with your local database credentials
cp .env.example .env
# Edit .env with your database settings
```

3. **Setup database**:

```bash
# Create database (example for PostgreSQL)
createdb auth_starter_db

# For MySQL:
# mysql -u root -p
# CREATE DATABASE auth_starter_db;

# For SQLite, the database file will be created automatically
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

We provide a complete Docker setup with database and Adminer for database management.

### Development Mode

```bash
# Start all services (NestJS + Database + Adminer)
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

### Production Mode

```bash
# Build production image
yarn docker:build

# Start with production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Docker Services

- **NestJS App**: http://localhost:3000
- **Database**: localhost:5432 (PostgreSQL by default, configurable)
- **Adminer**: http://localhost:8080

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
│   └── migrations/                # Database migrations
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
# Database Configuration
DB_TYPE=postgres                # postgres | mysql | mariadb | sqlite | mssql | oracle
DB_HOST=localhost               # 'postgres' for Docker, 'localhost' for local
DB_PORT=5432                   # 5432 for PostgreSQL, 3306 for MySQL, etc.
DB_USER=postgres               # Database username
DB_PASSWORD=postgres           # Database password
DB_NAME=auth_starter_db        # Database name
DB_SYNCHRONIZE=false           # Never use true in production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_TOKEN_EXPIRY=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRY=7d

# Application Configuration
NODE_ENV=development           # development | production | test
PORT=3000

# Rate Limiting
RATE_LIMIT_TTL=60000          # Time window in milliseconds
RATE_LIMIT_LIMIT=100          # Max requests per time window
```

### Docker Variables

```bash
# Database Container Configuration (PostgreSQL example)
POSTGRES_DB=auth_starter_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# For MySQL, use:
# MYSQL_ROOT_PASSWORD=rootpassword
# MYSQL_DATABASE=auth_starter_db
# MYSQL_USER=appuser
# MYSQL_PASSWORD=apppassword
```

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
   - Check if your database server is running
   - Verify environment variables in `.env`
   - For Docker: `yarn docker:logs database`

2. **Port Already in Use**:
   - Change port in `docker-compose.yml` or `.env`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **Migration Issues**:
   - Check database connection
   - Verify migration files in `src/db/migrations/`
   - Run `yarn migration:show` to check status

4. **JWT Token Issues**:
   - Verify JWT_SECRET in environment variables
   - Check token expiry settings
   - Ensure proper Authorization header format: `Bearer <token>`

5. **Permission Denied (Docker)**:
   - Check Docker permissions
   - Ensure user is in docker group: `sudo usermod -aG docker $USER`

6. **Node.js Version Issues**:
   - Use Node.js 22.x: `nvm use 22`
   - Clear node_modules and reinstall: `rm -rf node_modules && yarn install`

7. **Database Type Configuration**:
   - Ensure DB_TYPE matches your database (postgres, mysql, sqlite, etc.)
   - Update connection parameters according to your database type
   - Check TypeORM documentation for database-specific configurations

## 📞 Support

For support, create an issue in the repository or contact the development team.

---

**Built with ❤️ using NestJS, TypeORM, and Docker**
