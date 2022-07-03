/// Plugin Router - This router is for managing routes under /api/plugin
/// These routes are for listing, searching, and running plugins

import { Router } from 'express';
import { pluginManager, PluginResult } from 'swish-base';

const router = Router();

const SINK = () => undefined;

router.get('', (req, res) => {
    const searchTerm = req.query['q'] as string;
    res.send(pluginManager.searchPlugins(searchTerm));
});

router.post('/:id', async (req, res) => {
    let result: PluginResult;
    try {
        result = await pluginManager.runPlugin(req.params.id, {
            textContent: req.body,
            statusUpdate: SINK,
            progressUpdate: SINK,
        });
    } catch (error) {
        // Pass the error back to be displayed to the user.
        // This may happen if a user plugin was deleted (or re-ID'd) by another user after user making this request found it
        result = {
            message: {
                text: error.message,
                level: 'error',
            },
        };
    }

    res.send(result);
});

router.post('/:id/text', async (req, res) => {
    let result: PluginResult;
    try {
        result = await pluginManager.runPlugin(req.params.id, {
            textContent: req.body,
            statusUpdate: SINK,
            progressUpdate: SINK,
        });
    } catch (error) {
        res.type('text/plain').status(500).send(error.message);
        return;
    }

    if (result.text) {
        res.type('text/plain').send(result.text);
    } else if (result.message?.level === 'error') {
        res.type('text/plain').status(400).send(result.message.text);
    } else {
        res.status(204).send();
    }
});

export const pluginRouter = router;
