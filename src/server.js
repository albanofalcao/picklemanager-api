import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.js';
import { arenaRoutes } from './routes/arenas.js';
import { adminRoutes } from './routes/admin.js';
import { db } from './db/connection.js';

var app = express();
var PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', async function(req, res) {
  try {
    var result = await db.raw('SELECT 1 as test');
    res.json({ status: 'ok', version: '1.0.0', db: result.rows });
  } catch(e) {
    res.status(503).json({ 
      status: 'error', 
      message: e.message,
      code: e.code || null,
      detail: e.detail || null
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/arenas', arenaRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, function() {
  console.log('API rodando na porta ' + PORT);
});
