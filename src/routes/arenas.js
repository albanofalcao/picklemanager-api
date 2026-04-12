status(201).json(arena);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

arenaRoutes.put('/:id', async (req, res) => {
  try {
    const { responsaveis, quadras, ...dadosArena } = req.body;
    const [arena] = await db('arenas').where('id', req.params.id).update(dadosArena).returning('*');
    if (!arena) return res.status(404).json({ error: 'Arena nao encontrada' });
    res.json(arena);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

arenaRoutes.delete('/:id', async (req, res) => {
  try {
    await db('arenas').where('id', req.params.id).delete();
    res.json({ message: 'Arena removida' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
