import { Router } from 'express';
import { custompluginRouter } from './api/customplugin-router';
import { moduleRouter } from './api/module-router';
import { pluginRouter } from './api/plugin-router';

const router = Router();

router.use('/plugin', pluginRouter);
router.use('/customplugin', custompluginRouter);
router.use('/module', moduleRouter);

export const apiRouter = router;
