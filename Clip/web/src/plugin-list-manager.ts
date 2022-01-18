import { PluginDefinition } from '../../shared/models/plugin-definition';
import { ipcService } from './ipc-service';

const PLUGIN_LIST_PARENT_ELEMENT_ID = 'item-list';

class PluginListManager {
    private selectedPlugin = 0;

    private plugins: PluginDefinition[];
    private listRootElement: HTMLElement;

    public constructor() {
        this.listRootElement = document.getElementById(
            PLUGIN_LIST_PARENT_ELEMENT_ID
        );
    }

    public setPluginList(plugins: PluginDefinition[]) {
        this.plugins = plugins;
        this.renderPluginList();
    }

    public renderPluginList() {
        this.destroyPluginList();

        this.plugins
            .map(this.buildPluginItemElement)
            .forEach((elem) => this.listRootElement.appendChild(elem));

        this.selectPlugin(0);
    }

    public nextPlugin() {
        let nextIndex = this.selectedPlugin + 1;
        if (nextIndex >= this.plugins.length) {
            nextIndex = 0;
        }
        this.selectPlugin(nextIndex);
    }

    public prevPlugin() {
        let nextIndex = this.selectedPlugin - 1;
        if (nextIndex < 0) {
            nextIndex = this.plugins.length - 1;
        }
        this.selectPlugin(nextIndex);
    }

    public getSelectedPlugin(): PluginDefinition {
        if (
            this.plugins &&
            this.selectedPlugin >= 0 &&
            this.selectedPlugin < this.plugins.length
        ) {
            return this.plugins[this.selectedPlugin];
        }
        return null;
    }

    private selectPlugin(index: number) {
        // Boundaries
        if (index < 0) {
            index = 0;
        }
        if (index >= this.plugins.length) {
            index = this.plugins.length - 1;
        }

        this.selectedPlugin = index;

        //deselect any which are selected
        document
            .querySelectorAll('.list-group-item')
            .forEach((elem) => elem.classList.remove('active'));

        // select the item at the index
        let selectedPlugin = document.getElementById(`plugin-${index}`);
        selectedPlugin.classList.add('active');
        selectedPlugin.scrollIntoView({ block: 'nearest' });
    }

    private destroyPluginList() {
        while (this.listRootElement.firstChild) {
            this.listRootElement.removeChild(this.listRootElement.firstChild);
        }
    }

    private buildPluginItemElement(plugin: PluginDefinition, index: number) {
        const baseElem = document.createElement('a');
        baseElem.href = '#';
        baseElem.className = 'list-group-item list-group-item-action';
        baseElem.id = `plugin-${index}`;
        baseElem.onclick = () => {
            ipcService.runPlugin(plugin.id);
            ipcService.hideWindow();
        };

        baseElem.onmouseover = () => pluginListManager.selectPlugin(index);

        baseElem.innerHTML = `<div class="d-flex w100 justify-content-start">
                <div class="me-3 mt-2">
                    <i class="mt-1 material-icons">${
                        plugin.icon ?? 'extension'
                    }</i>
                </div>
                <div class="w-100">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${plugin.name}</h5>
                        <small>${(
                            plugin.tags?.join(', ') ?? ''
                        ).toLocaleLowerCase()}</small>
                    </div>
                    <small>${plugin.description}</small>
                </div>
            </div>`;
        return baseElem;
    }
}

export const pluginListManager = new PluginListManager();
