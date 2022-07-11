import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';

import { configManager, pluginManager } from 'swish-base';

import { wsManager } from './ws-manager';
import { logger } from './util/log-util';
import { rootRouter } from './endpoints/root-router';

const DEFAULT_PORT = 3000;

// Define environment variables to parse (in addition to default - SWISH_PLUGINS_PATH)
configManager.parseEnvironment('web', {
    PORT: 'port',
    SWISH_WEB_PORT: 'port', // take SWISH_WEB_PORT if set rather than PORT
});

const portNumber = getPort();

// Initial load of user plugins in the plugin manager
pluginManager.reloadUserPlugins();

const app = express();

app.use(cors());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'web')));

// TODO Enable request logs with a env var maybe?
app.use((req, _res, next) => {
    logger.info(`${req.ip} - ${req.method} ${req.path}`);
    next();
});

app.use(rootRouter);

const server = app.listen(portNumber, () => {
    console.log(`Listening on port ${portNumber}`);
});

// Handle WS upgrades (for sending progress/status updates)
const wsServer = wsManager.getServer();
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit('connection', socket, request);
    });
});

// Set up triggers on SIGTERM and SIGINT to close the servers
// Debounce to prevent triggers in quick succession.
process.on('SIGTERM', () => closeServers('TERM'));
process.on('SIGINT', () => closeServers('INT'));

function closeServers(signal: string) {
    logger.info(`Received ${signal} signal - Shutting Down`);
    wsManager.closeAllClients();
    wsServer.close((err) => logServerClose(err, 'WS'));
    server.close((err) => logServerClose(err, 'HTTP'));
}

// ------------

function getPort(): number {
    const port = configManager.getConfig().web.port;

    if (!port) {
        return DEFAULT_PORT;
    }

    if (`${Number(port)}` !== `${port}`) {
        logger.warn(
            `Not using specified port as it is an invalid number: "${port}"`
        );
        return DEFAULT_PORT;
    }
    return Number(port);
}

function logServerClose(err: Error, server: 'HTTP' | 'WS') {
    if (/is not running/i.test(err?.message)) {
        logger.info(`${server} server is not running`);
    } else if (err) {
        logger.error(`Error closing ${server} server`, err);
    } else {
        logger.info(`Successfully closed ${server} server`);
    }
}
