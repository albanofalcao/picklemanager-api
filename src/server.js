app.get('/health', async function(req, res) {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', version: '1.0.0' });
  } catch(e) {
    res.status(503).json({ status: 'error', message: e.message, detail: e.detail || null });
  }
});