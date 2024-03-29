import { pluginManager, PluginResult } from 'swish-base';
import * as ws from 'ws';
import { logger } from './util/log-util';

//TODO Move these somewhere central

interface IncomingWsMessage {
    type: 'RunPlugin';
    data: RunPluginRequest;
}

interface OutgoingWsMessage {
    type: 'PluginUpdate' | 'PluginResult';
    data: PluginUpdate | RunPluginResult;
}

interface RunPluginRequest {
    pluginId: string;
    data: string;
    runId: string;
}

interface RunPluginResult {
    runId: string;
    result: PluginResult;
}

interface PluginUpdate {
    runId: string;
    updateType: 'status' | 'progress';
    data: string | number;
}

// ^^^

class WsManager {
    private server: ws.Server;

    constructor() {
        this.server = new ws.Server({ noServer: true });
        this.server.on('connection', (socket) => {
            logger.info('WS: New Connection');
            socket.on('message', (message) => {
                if (JSON.parse(message.toString()) === 'ping') {
                    return;
                }
                this.handleMessage(socket, message);
            });
            socket.on('close', () => {
                logger.info('WS: Connection closed by client');
            });
        });
    }

    public getServer() {
        return this.server;
    }

    public closeAllClients() {
        const clients = this.server.clients;
        logger.info(`WS: Closing all client connections...`);
        clients.forEach((client) => client.terminate());
    }

    private sendMessageToClient(
        socket: ws.WebSocket,
        message: OutgoingWsMessage
    ) {
        const data = JSON.stringify(message);
        logger.info(
            `WS: Sending message: ${message.type} ${message.data.runId}`
        );
        socket.send(data);
    }

    private sendStatusUpdate(
        socket: ws.WebSocket,
        status: string,
        runId: string
    ) {
        this.sendMessageToClient(socket, {
            type: 'PluginUpdate',
            data: { updateType: 'status', data: status, runId: runId },
        });
    }

    private sendProgressUpdate(
        socket: ws.WebSocket,
        progress: number,
        runId: string
    ) {
        this.sendMessageToClient(socket, {
            type: 'PluginUpdate',
            data: { updateType: 'progress', data: progress, runId: runId },
        });
    }

    private sendPluginRunResult(
        socket: ws.WebSocket,
        result: PluginResult,
        runId: string
    ) {
        this.sendMessageToClient(socket, {
            type: 'PluginResult',
            data: {
                runId: runId,
                result: result,
            },
        });
    }

    private handleMessage(socket: ws.WebSocket, message: ws.RawData) {
        const parseResult = tryParse(message.toString());

        if (!parseResult.success) {
            logger.info(
                'WS: Malformed message received: ' + message.toString()
            );
            return;
        }

        const parsed = parseResult.result;

        logger.info(
            `WS: Received message: ${parsed.type} ${parsed.data?.runId}`
        );

        if (parsed.type === 'RunPlugin') {
            const request = parsed.data;

            pluginManager
                .runPlugin(request.pluginId, {
                    textContent: request.data,
                    progressUpdate: (percent) =>
                        this.sendProgressUpdate(socket, percent, request.runId),
                    statusUpdate: (text) =>
                        this.sendStatusUpdate(socket, text, request.runId),
                })
                .then((result) =>
                    this.sendPluginRunResult(socket, result, request.runId)
                )
                // Catch any errors and just send it in a format that the client expects
                .catch((error) =>
                    this.sendPluginRunResult(
                        socket,
                        { message: { text: error.message, level: 'error' } },
                        request.runId
                    )
                );
        }
    }
}

export const wsManager = new WsManager();

function tryParse(data: string) {
    try {
        return {
            result: JSON.parse(data) as IncomingWsMessage,
            success: true,
        };
    } catch (error) {
        return { success: false };
    }
}
