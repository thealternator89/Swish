import { PluginDefinition } from 'swish-base';

export class PluginItem {
    constructor(
        public name: string,
        public id: string,
        public description: string
    ) {}
}

export class PluginGroup {
    constructor(public name: string, public items: PluginGroupItem[]) {}
}

type PluginGroupItem = PluginItem | PluginGroup;

export function BuildPluginGroups(
    plugins: PluginDefinition[]
): PluginGroupItem[] {
    const items: PluginGroupItem[] = [];

    for (const plugin of plugins) {
        const path = plugin.group;

        const split = path?.split('/');

        AddPluginToGroup(items, split, plugin);
    }

    SortPluginGroup(items);

    return items;
}

function SortPluginGroup(groupItems: PluginGroupItem[]) {
    groupItems.sort((o1, o2) => {
        if (o1 instanceof PluginGroup && o2 instanceof PluginItem) {
            return -1;
        } else if (o1 instanceof PluginItem && o2 instanceof PluginGroup) {
            return 1;
        } else {
            return o1.name.localeCompare(o2.name);
        }
    });

    groupItems
        .filter((item) => item instanceof PluginGroup)
        .forEach((item: PluginGroup) => SortPluginGroup(item.items));
}

function AddPluginToGroup(
    groupItems: PluginGroupItem[],
    path: string[],
    plugin: PluginDefinition
) {
    if (!path || path.length === 0) {
        groupItems.push(
            new PluginItem(plugin.name, plugin.id, plugin.description)
        );
        return;
    }

    const firstPathItem = path.shift();

    const groupItem = groupItems.find(
        (item) => item instanceof PluginGroup && item.name === firstPathItem
    ) as PluginGroup;

    if (!groupItem) {
        const created = new PluginGroup(firstPathItem, []);
        groupItems.push(created);
        return AddPluginToGroup(created.items, path, plugin);
    } else {
        return AddPluginToGroup(groupItem.items, path, plugin);
    }
}
