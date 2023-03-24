export const IPC_CHANNELS = {
  PLUGIN_SEARCH: {
    REQ: 'pluginSearch',
    RES: 'pluginSearchMatch',
  },
  MENU_COMMAND: 'menuCommand',
  PLUGIN_STATUS_UPDATE: 'pluginStatus',
  PLUGIN_PROGRESS_UPDATE: 'pluginProgress',
  RUN_PLUGIN: {
    REQ: 'runPlugin',
    RES: 'pluginResult',
  },
  GET_PLUGIN: {
    REQ: 'getPlugin',
  },
};
