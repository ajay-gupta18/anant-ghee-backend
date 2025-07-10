#!/bin/bash

set -e

echo "🚀 Starting full deployment of Anant Ghee App"

# Step 1: Install Docker if not installed
if ! command -v docker &> /dev/null
then
    echo "🐳 Docker not found. Installing Docker..."
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    echo "✅ Docker installed successfully."
else
    echo "✅ Docker is already installed."
fi

# Step 2: Pull Docker images
echo "📦 Pulling Docker images..."
docker pull postgres:15
docker pull redis:6
docker pull ajaygupta18/anant-ghee-backend:v1.0
echo "✅ All images pulled successfully."

# Step 3: Create Docker Network if not exists
if ! docker network ls | grep -q anant-network; then
  docker network create anant-network
  echo "✅ Docker network 'anant-network' created."
else
  echo "✅ Docker network 'anant-network' already exists."
fi

# Step 4: Start Postgres container
docker run -d \
  --name postgres_db \
  --network anant-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=anant_ghee \
  -p 5432:5432 \
  postgres:15 || true
echo "✅ Postgres container started."

# Step 5: Start Redis container
docker run -d \
  --name redis \
  --network anant-network \
  -p 6379:6379 \
  redis:6 || true
echo "✅ Redis container started."

# Step 6: Run Prisma Migration
docker run --rm \
  --name migrate \
  --network anant-network \
  -e DATABASE_URL=postgresql://postgres:root@postgres_db:5432/anant_ghee \
  ajaygupta18/anant-ghee-backend:v1.0 \
  npx prisma migrate deploy
echo "✅ Database migration completed."

# Step 7: Start Nest.js App
docker run -d \
  --name nest_server \
  --network anant-network \
  -p 3001:3000 \
  -e DATABASE_URL=postgresql://postgres:root@postgres_db:5432/anant_ghee \
  -e JWT_ACCESS_TOKEN_SECRET=keytocreateaccesstoken \
  -e JWT_REFRESH_TOKEN_SECRET=keytocreaterefreshtoken \
  -e FRONTEND_BASE_URL=http://localhost:5173 \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  ajaygupta18/anant-ghee-backend:v1.0 \
  npm run start:prod
echo "✅ Nest.js app started on http://localhost:3001"

# Step 8: Show all running containers
docker ps

echo "🎉 Deployment completed successfully!"
