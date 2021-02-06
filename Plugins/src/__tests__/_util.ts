const noop = () => undefined;

export const basePluginArgument = {
    progressUpdate: noop,
    statusUpdate: noop,
    runPlugin: noop,
};
