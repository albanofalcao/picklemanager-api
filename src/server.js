import `dotenv/config`;import express from `express`;import cors from `cors`;import {authRoutes} from `./routes/auth.js`;import {arenaRoutes} from `./routes/arenas.js`;import {adminRoutes} from `./routes/admin.js`;import {db} from `./db/connection.js`;const app=express();const PORT=process.env.PORT||3000;app.use(cors({origin:process.env.ALLOWED_ORIGINS?.split(`,`)||`*`,credentials:true}));app.use(express.json());app.get(`/health`,async(req,res)=>{try{await db.raw(`SELECT 1`);res.json({status:`ok`,version:`1.0.0`})}catch{res.status(503).json({status:`error`})}});app.use(`/api/auth`,authRoutes);app.use(`/api/arenas`,arenaRoutes);app.use(`/api/admin`,adminRoutes);app.listen(PORT,()=>console.log(`API rodando na porta `+PORT));
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.js';
import { arenaRoutes } from './routes/arenas.js';
import { adminRoutes } from './routes/admin.js';
import { db } from './db/connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', version: '1.0.0' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/arenas', arenaRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));