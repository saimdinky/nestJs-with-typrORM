#!/bin/sh

echo "Waiting for MySQL to be ready..."

# Wait for MySQL to be available using netcat
until nc -z mysql 3306; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is ready!"

# Run migrations
echo "Running database migrations..."
npx typeorm -d ormconfig.js migration:run

echo "Starting application with automatic seeding..."
# Start the application (seeding happens in main.ts)
exec node dist/main
