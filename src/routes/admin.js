import express from 'express';

export const adminRoutes = express.Router();

adminRoutes.get('/status', (req, res) => {
  res.json({ status: 'admin ok' });
});
