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
    SWISH_WEB_PORT: 'port',
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
server.on('upgrade', (request, socket, head) => {
    const wsServer = wsManager.getServer();
    wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit('connection', socket, request);
    });
});

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
