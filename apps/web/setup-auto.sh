#!/bin/bash
set -e
echo "🚀 Iniciando SwinguerWorldPro..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[1/3]${NC} Verificando configuración..."
if [ ! -f "apps/api/.env" ]; then
    echo "Creando apps/api/.env..."
    cat > apps/api/.env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/swinguerworld?schema=public"
JWT_SECRET="dev-secret-key-change-in-production"
REDIS_URL="redis://localhost:6379"
PORT=3001
NODE_ENV=development
EOF
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "Creando apps/web/.env.local..."
    cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001
EOF
fi

echo -e "${BLUE}[2/3]${NC} Verificando base de datos..."
cd apps/api
if ! pnpm exec prisma db pull &>/dev/null; then
    echo "Ejecutando migraciones..."
    pnpm exec prisma generate
    pnpm exec prisma migrate dev --name init
    pnpm exec tsx src/database/seed.ts
fi
cd ../..

echo -e "${BLUE}[3/3]${NC} Iniciando servidores..."
echo -e "${GREEN}✅ API:${NC}      http://localhost:3001"
echo -e "${GREEN}✅ Frontend:${NC} http://localhost:3000"
echo ""

pnpm --filter @swp/api dev &
pnpm --filter @swp/web dev
