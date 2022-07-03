/// Custom Plugin Router - This router is for managing routes under /api/customplugin
/// These routes are for listing, uploading, downloading, replacing, and deleting custom plugins

import { Router } from 'express';
import * as stringRequire from 'require-from-string';

import { configManager, PluginDefinition, pluginManager } from 'swish-base';

import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import { firstOrOnly } from '../../util/header-util';

const router = Router();

let userPluginFilePath: string;

// All plugins require the user plugin directory to be set up correctly.
// Every route will check it is set up and exists before we get to the handler.
router.use((_req, res, next) => {
    if (!setUserPluginFilePath()) {
        res.status(500).send(
            'User plugin directory not set up! Please check server configuration.'
        );
        return;
    }
    next();
});

router.get('', (_req, res) => {
    const files = fs
        .readdirSync(userPluginFilePath)
        .filter((file) => !file.startsWith('_') && file.endsWith('.js'));

    res.send(files);
});

router.get('/:filename', (req, res) => {
    let filename = makeValidPluginFilename(req.params.filename);
    let fullFilePath = path.join(userPluginFilePath, filename);

    if (!fs.existsSync(fullFilePath)) {
        res.status(404).send();
        return;
    }

    const content = fs.readFileSync(fullFilePath);
    res.type('text/javascript').send(content);
});

router.post('', (req, res) => {
    let filename = makeValidPluginFilename(
        firstOrOnly(req.headers['x-file-name'])
    );
    let fullFilePath = path.join(userPluginFilePath, filename);

    if (fs.existsSync(fullFilePath)) {
        res.status(400).send(`Resolved filename ${filename} already exists.`);
        return;
    }

    const definition = req.body;

    try {
        validatePlugin(definition);
    } catch (error) {
        res.status(400).send(`ERROR: ${error.message}`);
        return;
    }

    fs.writeFileSync(fullFilePath, definition);

    pluginManager.reloadUserPlugins();
    res.status(204).send();
});

router.put('/:filename', (req, res) => {
    let filename = makeValidPluginFilename(req.params.filename);
    let fullFilePath = path.join(userPluginFilePath, filename);

    if (!fs.existsSync(fullFilePath)) {
        res.status(404).send();
        return;
    }

    const definition = req.body;

    try {
        validatePlugin(definition);
    } catch (error) {
        res.status(400).send(`ERROR: ${error.message}`);
        return;
    }

    fs.writeFileSync(fullFilePath, definition);

    pluginManager.reloadUserPlugins();
    res.status(204).send();
});

router.delete('/:filename', (req, res) => {
    let filename = makeValidPluginFilename(req.params.filename);
    let fullFilePath = path.join(userPluginFilePath, filename);

    // If it doesn't exist, just say we deleted it.
    if (!fs.existsSync(fullFilePath)) {
        res.status(204).send();
        return;
    }

    fs.rmSync(fullFilePath);
    pluginManager.reloadUserPlugins();

    res.status(204).send();
});

function validatePlugin(definition: string) {
    // Replace all requires with a fixed blank object. This is so we don't get erroneous "can't find module" errors
    const safeDefinition = definition.replace(/require\(.*?\)/g, '{}');
    let module = stringRequire(safeDefinition);

    // If the module is a single object, wrap it in an array.
    if (Object.prototype.toString.call(module) === '[object Object]') {
        module = [module];
    }

    const invalid = module.filter(
        (item: PluginDefinition) =>
            !item.hidden && (!item.name || !item.process)
    );

    if (invalid.length !== 0) {
        throw new Error(
            'Non-hidden plugins must have a name and process function. Invalid plugins: ' +
                invalid
                    .map(
                        (plugin: PluginDefinition) =>
                            plugin.name || plugin.id || '<unknown>'
                    )
                    .join(',')
        );
    }
}

function setUserPluginFilePath(): boolean {
    if (!userPluginFilePath) {
        const configPath = (configManager.config as any).userPlugins;
        if (!configPath || !configPath.startsWith('~')) {
            userPluginFilePath = configPath;
        } else {
            userPluginFilePath = path.join(homedir(), configPath.substring(1));
        }
    }

    return isUserPluginFilePathValid();
}

function isUserPluginFilePathValid(): boolean {
    return (
        !!userPluginFilePath &&
        fs.existsSync(userPluginFilePath) &&
        fs.lstatSync(userPluginFilePath).isDirectory()
    );
}

function makeValidPluginFilename(filename: string): string {
    const EXT = '.js';

    let out = filename.replace(/[^a-zA-Z0-9\-_.]/g, '').replace(/^[_]+/, '');

    if (!out.endsWith(EXT)) {
        out += EXT;
    }

    return out;
}

export const custompluginRouter = router;
