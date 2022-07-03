/// Modules Router - This router is for managing routes under /api/modules
/// These routes are for listing, installing, uninstalling, and managing NPM modules within the 'user' plugin directory

import { Router } from 'express';
import { configManager } from 'swish-base';
import { logger } from '../../util/log-util';
import { execAsync } from '../../util/shell-utils';

import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';

// Regexes for validation package install/uninstall requests
// Package to install can contain alphanumeric,hyphen, slash, @ and dot.
// E.g. @organisation/package@1.0.0 or package
const PACKAGE_TO_INSTALL_REGEX = /[^a-z0-9@/\-\.]/gi;

// Package to uninstall can contain alphanumeric, hyphen, slash and @.
// E.g. @organisation/package - we don't specify the version on uninstall
const PACKAGE_TO_UNINSTALL_REGEX = /[^a-z0-9@/\-]/gi;

const router = Router();

let npmExists: boolean = undefined;
let userPluginFilePath: string;

router.use(async (_req, res, next) => {
    if (!checkNpmExists()) {
        res.status(500).send(
            'NPM not found or inaccessible. Please check your server state.'
        );
        return;
    }
    if (!setUserPluginFilePath()) {
        res.status(500).send(
            'User plugin directory not set up! Please check server configuration.'
        );
        return;
    }
    next();
});

// Get a list of installed modules
router.get('', async (_req, res) => {
    await ensurePackageJsonExists();
    const packageJsonPath = path.join(userPluginFilePath, 'package.json');

    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageObject = JSON.parse(packageJsonContent);
    const dependencies = Object.keys(packageObject.dependencies ?? {}).map(
        (key) => `${key}@${packageObject.dependencies[key]}`
    );

    res.send(dependencies);
});

router.post('/install', async (req, res) => {
    const packageToInstall = req.body;
    if (PACKAGE_TO_INSTALL_REGEX.test(packageToInstall)) {
        res.status(400).send('Package name contains invalid characters');
        return;
    }

    try {
        await execAsync(
            `npm install --save "${packageToInstall}" --prefix "${userPluginFilePath}"`
        );
    } catch (error) {
        res.status(500).send(`Package install failed - ${error}`);
        return;
    }

    res.status(204).send();
});

router.post('/uninstall', async (req, res) => {
    const packageToUninstall = req.body;
    if (PACKAGE_TO_UNINSTALL_REGEX.test(packageToUninstall)) {
        res.status(400).send('Package name contains invalid characters');
        return;
    }

    try {
        await execAsync(
            `npm uninstall "${packageToUninstall}" --prefix "${userPluginFilePath}"`
        );
    } catch (error) {
        res.status(500).send(`Package install failed - ${error}`);
        return;
    }

    res.status(204).send();
});

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

/**
 * Checks if we can access NPM and stores that so we don't keep checking
 */
async function checkNpmExists() {
    if (npmExists === undefined) {
        try {
            let result = (await execAsync('npm -v')) as string;
            logger.info(`Found NPM with version ${result.trim()}`);
            npmExists = true;
        } catch (error) {
            logger.error(`Failed to get NPM version - ${error}`);
            npmExists = false;
        }
    }

    return npmExists;
}

/**
 * Checks if the user plugins directory has a package.json, and if not uses NPM to create one
 */
async function ensurePackageJsonExists() {
    const packageJsonPath = path.join(userPluginFilePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        await execAsync(`cd "${userPluginFilePath}" && npm init -y`);
    }
}

export const moduleRouter = router;
