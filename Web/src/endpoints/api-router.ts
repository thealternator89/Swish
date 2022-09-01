import { Router } from 'express';
import { configManager } from 'swish-base';
import { custompluginRouter } from './api/customplugin-router';
import { internalRouter } from './api/internal-router';
import { moduleRouter } from './api/module-router';
import { pluginRouter } from './api/plugin-router';

import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.use('/plugin', pluginRouter);
router.use('/customplugin', custompluginRouter);
router.use('/module', moduleRouter);
router.use('/internal', internalRouter);

router.get('/mode', (_req, res) => {
    const pluginsPath = configManager.getConfig().userPlugins;

    // If the user plugin path is set, mode is FULL, otherwise DEMO.
    // TODO: Check
    //  * Exists
    //  * Is Directory
    //  * Has write permissions
    if (pluginsPath) {
        res.json('FULL');
    } else {
        res.json('DEMO');
    }
});

router.get('/version', (_req, res) => {
    const packageJson = require(path.join(
        __dirname,
        '..',
        '..',
        'package.json'
    ));
    res.json(packageJson.version);
});

export const apiRouter = router;
