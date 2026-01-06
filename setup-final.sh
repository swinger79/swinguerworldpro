#!/bin/bash
set -e
cd ~/swinguerworldpro
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Configurando SwinguerWorldPro...${NC}"
docker-compose -f docker/docker-compose.yml up -d postgres redis 2>/dev/null || true
sleep 8

cd apps/api
[ -f .env ] && export $(cat .env | grep -v '#' | xargs) || true
pnpm exec prisma generate 2>/dev/null || true
pnpm exec prisma migrate deploy 2>/dev/null || pnpm exec prisma db push 2>/dev/null || true

node << 'NODEJS'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function seed() {
  const users = [
    { email: "alex@swp.com", name: "Alex", plan: "ELITE", password: "password123" },
    { email: "maria@swp.com", name: "María", plan: "ADVANCED", password: "password123" },
    { email: "david@swp.com", name: "David", plan: "PRO", password: "password123" },
    { email: "sofia@swp.com", name: "Sofía", plan: "DIAMOND", password: "password123" },
    { email: "carlos@swp.com", name: "Carlos", plan: "FREE", password: "password123" }
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    }).catch(() => null);
  }
  await prisma.$disconnect();
}
seed();
NODEJS

cd ../..
echo -e "${GREEN}✅ ¡Todo listo! Iniciando...${NC}"
pnpm dev
