import { Router } from 'express';
import { modelRegistry } from '../config/models.js';

const router = Router();

router.get('/models', (req, res) => {
  res.json({
    models: modelRegistry,
  });
});

export default router;
