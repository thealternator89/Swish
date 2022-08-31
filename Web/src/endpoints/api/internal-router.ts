import { Router } from 'express';
import { configManager } from 'swish-base';

const router = Router();

router.get('/config', (_req, res) => {
    res.send(configManager.getConfig());
});

router.get('/env', (_req, res) => {
    res.send(process.env);
});

export const internalRouter = router;
