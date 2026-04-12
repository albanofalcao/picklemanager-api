adminRoutes.get('/debug', (req, res) => {
  const url = process.env.DATABASE_ADMIN_URL || 'NAO DEFINIDA';
  const host = url.split('@')[1]?.split(':')[0] || 'sem host';
  res.json({ host });
});
