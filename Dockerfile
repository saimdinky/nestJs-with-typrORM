# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install netcat for connection testing
RUN apk add --no-cache netcat-openbsd

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies and TypeORM CLI
RUN yarn install --frozen-lockfile --production && \
    yarn add typeorm ts-node && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy source files needed for migrations
COPY --from=builder --chown=nestjs:nodejs /app/src ./src

# Copy configuration and startup script
COPY ormconfig.js ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/auth/profile || exit 1

# Start application with migrations
CMD ["./docker-entrypoint.sh"] 