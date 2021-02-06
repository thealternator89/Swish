#!/usr/bin/env node

import { bold, red, yellow, green, underline } from 'colors/safe';
import { program } from 'commander';
import * as stdin from 'get-stdin';
import * as tabula from 'tabula';
import { env } from 'process';

import { pluginManager, PluginDefinition } from 'beep-base';

import { StatusUpdatePrinter } from './status-update-printer';

const statusUpdatePrinter = new StatusUpdatePrinter();

// Store a local reference to 'console', then redefine the global 'console' to a sink
const console = global.console;
preventCallsToConsole();

program
    .version('0.1.0')
    .option('-ls, --list', 'list all available plugins')
    .option('-i, --info <plugin>', 'print info about specified plugin')
    .option('-p, --plugin <name>', 'process input using a plugin');

program.parse(process.argv);

const userPluginPath = env['BEEP_PLUGIN_PATH'];

if (userPluginPath) {
    pluginManager.init(userPluginPath);
}

if (program.list) {
    pluginList('user', pluginManager.getUserPlugins());
    console.log();
    pluginList('system', pluginManager.getSystemPlugins());

    console.log();
    exit();
}

if (program.info) {
    const plugin: PluginDefinition = pluginManager.getPluginById(program.info);

    if (!plugin) {
        console.error(`ERROR: Couldn't find plugin with ID '${program.info}'.`);
    }

    console.log();
    console.log(plugin.name);
    console.log(`Key: ${plugin.id}`);
    console.log();
    console.log(plugin.description);
    exit();
}

if (program.plugin) {
    runPlugin(program.plugin).catch((error) => {
        statusUpdatePrinter.stopAndClear();
        console.error(
            bold(red(`${underline('ERROR OCCURRED:')} ${error.message}`))
        );
    });
}

async function runPlugin(pluginId: string): Promise<void> {
    // TODO: would be good if we didn't get the plugin since we're not directly interacting with it anymore
    const plugin: PluginDefinition = pluginManager.getPluginById(pluginId);

    if (!plugin) {
        console.error(`Plugin '${pluginId}' not found.`);
        return;
    }

    statusUpdatePrinter.start(plugin.name);
    const data = (await stdin()).trim();

    const output = await pluginManager.runPlugin(pluginId, {
        textContent: data,
        statusUpdate: (text) => statusUpdatePrinter.updateStatus(text),
        progressUpdate: (percent) =>
            statusUpdatePrinter.updatePercentage(percent),
    });

    statusUpdatePrinter.stopAndClear();

    if (typeof output === 'string') {
        console.log(output);
    } else if (!output) {
        console.error(yellow('No value was returned by the plugin.'));
    } else {
        if (output.message) {
            switch (output.message.level) {
                case 'info':
                    console.error(output.message.text);
                    break;
                case 'success':
                    console.error(green(output.message.text));
                    break;
                case 'warn':
                    console.error(yellow(output.message.text));
                    break;
            }
        }

        if (output.text) {
            console.log(output.text);
        }
    }
}

function pluginList(type: 'system' | 'user', plugins: PluginDefinition[]) {
    console.log(`${type.toUpperCase()} PLUGINS:`);
    if (plugins.length > 0) {
        tabula(plugins, {
            columns: ['id', 'name', 'description'],
            sort: ['id'],
        });
    } else {
        console.log('  <No plugins found>');
    }
}

function exit(code = 0) {
    process.exit(code);
}

function preventCallsToConsole() {
    // Prevent plugins from calling interacting with console.
    global.console = {
        clear: () => undefined,
        debug: () => undefined,
        error: () => undefined,
        exception: () => undefined,
        info: () => undefined,
        log: () => undefined,
        trace: () => undefined,
        warn: () => undefined,
    } as any;
}
