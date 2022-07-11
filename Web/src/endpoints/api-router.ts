import { Router } from 'express';
import { configManager } from 'swish-base';
import { custompluginRouter } from './api/customplugin-router';
import { moduleRouter } from './api/module-router';
import { pluginRouter } from './api/plugin-router';

const router = Router();

router.use('/plugin', pluginRouter);
router.use('/customplugin', custompluginRouter);
router.use('/module', moduleRouter);

router.get('/config', (_req, res) => {
    res.send(configManager.getConfig());
});

export const apiRouter = router;
