#!/bin/bash
set -e

echo "🔧 Reparando y configurando SwinguerWorldPro..."

# 1. Corregir API index.js
cat > apps/api/index.js << 'EOF'
require('dotenv').config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "✅ API funcionando con Prisma + Express" });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { email, name, plan, password } = req.body;
  try {
    const user = await prisma.user.create({ 
      data: { email, name: name || null, plan: plan || 'FREE', password } 
    });
    res.status(201).json(user);
  } catch (e) {
    if (e.code === "P2002") return res.status(409).json({ error: "Email ya existe" });
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
EOF

# 2. Configurar Next.js en frontend
cd apps/web
pnpm add next@latest react@latest react-dom@latest

# 3. Crear estructura Next.js
mkdir -p pages public

cat > pages/index.js << 'EOF'
import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>🎉 SwinguerWorldPro - Frontend</h1>
      <h2>Usuarios en la BD:</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email} - Plan: {user.plan}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
EOF

cat > pages/_app.js << 'EOF'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
EOF

# 4. Actualizar package.json del frontend
cat > package.json << 'EOF'
{
  "name": "web",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
EOF

cd ../..

# 5. Matar procesos anteriores
pkill -f "node index.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo ""
echo "✅ Todo configurado. Iniciando servidores..."
echo ""

# 6. Iniciar API
cd apps/api
pnpm dev &
API_PID=$!

# 7. Esperar a que API inicie
sleep 3

# 8. Iniciar Frontend
cd ../web
pnpm dev &
WEB_PID=$!

cd ../..

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  ✅ SwinguerWorldPro Iniciado Correctamente          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "🌐 API:      http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Prueba:"
echo "  curl http://localhost:3001/users"
echo ""
echo "Presiona Ctrl+C para detener"

wait
