require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const WebSocket = require("ws");
const http = require("http");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_demo");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

let users = [
  { id: 1, email: "alex@swp.com", name: "Alex", plan: "ELITE", password: bcrypt.hashSync("password123", 10), role: "admin" },
  { id: 2, email: "maria@swp.com", name: "María", plan: "ADVANCED", password: bcrypt.hashSync("password123", 10), role: "user" },
  { id: 3, email: "david@swp.com", name: "David", plan: "PRO", password: bcrypt.hashSync("password123", 10), role: "user" },
  { id: 4, email: "sofia@swp.com", name: "Sofía", plan: "DIAMOND", password: bcrypt.hashSync("password123", 10), role: "user" },
  { id: 5, email: "carlos@swp.com", name: "Carlos", plan: "FREE", password: bcrypt.hashSync("password123", 10), role: "user" }
];

let messages = [];
let subscriptions = [];
const connectedUsers = new Map();

const PERMISSIONS = {
  admin: ['read:users', 'write:users', 'delete:users', 'read:messages', 'write:messages', 'read:payments', 'write:payments'],
  user: ['read:users', 'read:messages', 'write:messages', 'read:payments']
};

const PLANS = {
  FREE: { name: "Free", price: 0, features: ['Chat básico', 'Perfil'] },
  PRO: { name: "Pro", price: 999, features: ['Chat ilimitado', 'Videollamadas', 'Radar'] },
  ADVANCED: { name: "Advanced", price: 1999, features: ['Todo Pro', 'Soporte prioritario', 'Sin anuncios'] },
  ELITE: { name: "Elite", price: 4999, features: ['Todo Advanced', 'Eventos exclusivos', 'Verificación'] },
  DIAMOND: { name: "Diamond", price: 9999, features: ['VIP total', 'Soporte 24/7', 'Eventos privados'] }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: "Token inválido" });
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = users.find(u => u.id === req.user.id);
    const userPermissions = PERMISSIONS[user?.role] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: "Acceso denegado", requiredPermission: permission, userRole: user?.role });
    }
    next();
  };
};

app.get("/", (req, res) => {
  res.json({ message: "✅ API de SwinguerWorldPro v3.0 con Permisos", version: "3.0" });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role, permissions: PERMISSIONS[user.role] }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role, permissions: PERMISSIONS[user.role] } });
});

app.post("/auth/register", (req, res) => {
  const { email, name, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "El email ya existe" });
  const newUser = { id: users.length + 1, email, name, plan: "FREE", role: "user", password: bcrypt.hashSync(password, 10) };
  users.push(newUser);
  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name, plan: newUser.plan, role: newUser.role, permissions: PERMISSIONS['user'] }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, plan: newUser.plan, role: newUser.role, permissions: PERMISSIONS['user'] } });
});

app.get("/auth/me", verifyToken, (req, res) => {
  res.json(req.user);
});

app.get("/users", verifyToken, checkPermission('read:users'), (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const isAdmin = user?.role === 'admin';
  res.json(users.map(u => ({ id: u.id, email: isAdmin ? u.email : undefined, name: u.name, plan: u.plan, role: isAdmin ? u.role : undefined, online: connectedUsers.has(u.id) })).filter(u => u.name));
});

app.delete("/users/:id", verifyToken, checkPermission('delete:users'), (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: "Usuario no encontrado" });
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ message: "Usuario eliminado", user: deletedUser.name });
});

app.post("/users/:id/role", verifyToken, checkPermission('write:users'), (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: "Rol inválido" });
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  user.role = role;
  res.json({ message: "Rol actualizado", user: { id: user.id, name: user.name, role: user.role } });
});

app.get("/messages", verifyToken, checkPermission('read:messages'), (req, res) => {
  res.json(messages);
});

app.get("/plans", (req, res) => {
  res.json(PLANS);
});

app.post("/payment/create-session", verifyToken, checkPermission('read:payments'), async (req, res) => {
  const { plan } = req.body;
  const planData = PLANS[plan];
  if (!planData) return res.status(400).json({ error: "Plan inválido" });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `Plan ${planData.name}`, description: planData.features.join(', ') }, unit_amount: planData.price }, quantity: 1 }],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/premium`
    });
    res.json({ sessionId: session.id, clientSecret: session.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/payment/verify", verifyToken, checkPermission('write:payments'), async (req, res) => {
  const { sessionId, plan } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const user = users.find(u => u.id === req.user.id);
      if (user) user.plan = plan;
      subscriptions.push({ id: subscriptions.length + 1, userId: req.user.id, plan: plan, sessionId: sessionId, status: 'paid', createdAt: new Date() });
      res.json({ success: true, message: "Pago completado", user: user });
    } else {
      res.status(400).json({ error: "El pago no se completó" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/subscriptions", verifyToken, (req, res) => {
  const userSubs = subscriptions.filter(s => s.userId === req.user.id);
  res.json(userSubs);
});

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "join") {
        connectedUsers.set(message.userId, ws);
        broadcast({ type: "user_joined", userId: message.userId, userName: message.userName, timestamp: new Date() });
      }
      if (message.type === "message") {
        const msg = { id: messages.length + 1, userId: message.userId, userName: message.userName, text: message.text, timestamp: new Date(), avatar: `https://ui-avatars.com/api/?name=${message.userName}&background=random` };
        messages.push(msg);
        broadcast({ type: "new_message", data: msg });
      }
    } catch (e) {
      console.error("Error:", e);
    }
  });
  ws.on("close", () => {
    connectedUsers.forEach((client, userId) => {
      if (client === ws) {
        connectedUsers.delete(userId);
        broadcast({ type: "user_left", userId: userId, timestamp: new Date() });
      }
    });
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 API v3.0 con permisos en http://localhost:${PORT}`);
  console.log(`👥 Usuarios: ${users.map(u => u.email + ' (' + u.role + ')').join(', ')}`);
});
