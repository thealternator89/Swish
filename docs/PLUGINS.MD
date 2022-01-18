# Swish Plugins

It's incredibly easy to extend the functionality of Swish with your own custom plugins.

Swish will automatically pick up any plugins in a directory you specify - see [CONFIGURATION.MD](CONFIGURATION.MD) for how to specify a directory you will store your plugins in.

## Building a Swish plugin

Swish plugins are standard commonjs modules. You can build them in vanilla javascript or use something like TypeScript (all the built-in plugins are built with TypeScript). Your module should export an object with the following shape:

```typescript
interface PluginDefinition {
  name: string;
  id?: string;
  description: string;
  author: string;
  tags?: string[];
  icon?: string;
  swishVersion: string;
  hidden?: boolean;
  group?: string;
  usableFrom?: string[];
  process: (args: PluginArgument) => Promise<string>;
}
```

- **`name`**: Your plugin name which is displayed in the UI. This should be short and obvious.
- **`id`**: _(optional)_ Your plugin ID. If not provided, your plugin's filename _(excluding the `.js`)_ is used.
- **`description`**: A longer description of your plugin.
- **`author`**: Your name.
- **`tags`**: Words to help filtering your plugin. See below for ideas for what you can put here.
- **`icon`**: The icon to use in Swish beside your plugin.  
   Swish contains [Material Design Icons](https://material.io/resources/icons/?style=baseline). Select an icon and use the name of it here.
- **`swishVersion`**: The version of Swish-Base which your plugin targets.  
  Swish will only load plugins which target the current major version, and the current or a previous minor version.
- **`hidden`**: _(optional, defaults to `false`)_ Whether this plugin should be hidden.
  This is useful for hiding inbuilt plugins by defining a plugin which has the same ID but is marked as hidden.
  _This is in the process of being replaced with `usableFrom` and may be removed in future._
- **`group`**: _(optional)_ The group to display the plugin in - currently only used by **Swish-Clip**.
- **`usableFrom`**: _(optional)_ Which Swish apps which should be able to see and use this plugin. This allows more granular hiding, so plugins which don't make sense from certain applications don't clog things up. This is an array which can contain any subset of `['clip', 'core', 'gui']`. If you don't provide this, your plugin will be available from all Swish apps.
- **`process`**: The function which is invoked to process data. See below for how this works.

### Process function

The `process` function in your plugin is where the magic happens!

You will be passed data matching the following shape:

```typescript
interface PluginArgument {
  textContent: string;
  statusUpdate(text: string): void;
  progressUpdate(percent: number): void;
  runPlugin(
    pluginId: string,
    data: PluginArgument | string,
    type: 'default' | 'system' | 'user'
  );
}
```

- **`textContent`**: The text content to process
- **`statusUpdate`**: A callback to update the UI with the current status - used for long-running plugins.  
  This can be any text, but should be short to ensure it fits on any UI.
- **`progressUpdate`**: A callback to update the UI with the progress - used for long-running plugins.  
  This takes a whole-number percentage as an argument in the range `0` - `100`.
- **`runPlugin`**: Pass some data to another plugin to run.
  This helps simplify your plugin by offloading some work to another plugin rather than reimplementing it.

### Returning a result

Your plugin must return a promise which resolves to either a string or object.

In most situations, your promise will only need to resolve to a string, only if you want to provide a message to the user should your promise resolve with an object.

If you want to provide a message to the user, your object result must be the following shape.

```typescript
interface PluginResult {
  text?: string;
  message?: {
    text: string;
    status: 'info' | 'warn' | 'error' | 'success';
  };
}
```

- **`text`**: The resulting text for the plugin execution
- **`message`**:
  - **`text`**: Text of the message to display to the user
  - **`status`**: The status of the message - used to colour the message.

Note that no part of the object is **required**, but you should at least return either `text` or the `message`.  
This is useful to allow you to build a plugin which provides feedback on the input without modifying the text.

### Error Handling

If your plugin experiences any issues which cannot be resolved, you should reject the promise with an error. If you write this as an async/await function, you can just `throw` an error to reject the promise. The message property of the thrown error object is used to display the problem to the user, so be as specific as you can about what has gone wrong.

### Progress/Status updates to the user

If your plugin takes time to process the user input, you should keep the user informed of the status or progress using the `progressUpdate` and `statusUpdate` functions passed to your plugin's process function.

These functions may be used together to provide a richer experience to the user.

**Note: Status Updates are currntly not supported in Swish-Clip**

#### Progress Update

To display a simple progress bar to the user, call `progressUpdate` passing a percentage value to be displayed.
This value may be an integer or floating-point, but **must** be in the range `0 < X < 100` (where "X" is the value passed). If the passed value is less than 0 or greater than 100, it will be coerced into this range.

#### Status Update

If your plugin does its work in multiple phases, and you would like to keep the user informed of the stage it's at, use the `statusUpdate` function and pass any string to be displayed to the user.

### A note on Line Endings

When data is passed to your plugin, Swish will convert any line endings to `LF` (`\n`).
Swish will automatically convert the line endings in the result to match the input. The line endings used by your plugin will not be preserved.

### NPM Packages

Your plugin doesn't have to do everything on its own. You can use external NPM packages - install any packages you need in your plugins directory, and they can be used with your plugin.

### Preventing a JS file being loaded as a plugin

If you prefix the filename of a JS file in the plugins directory with an underscore, Swish will ignore it.
This is useful for having common code in, for example, a `_util.js` file.

### Limitations

Swish currently loads all plugins synchronously on launch. If your plugin does a lot of work outside of the `process` function, you can easily increase the amount of time it takes for Swish to launch.

Because of how JavaScript and CommonJS modules work, plugins aren't sandboxed, and can be doing things even when you don't explicitly run them. If you have a JS file in your plugins directory it could be doing anything at any time that Swish is running. If you want to bring a plugin in, make sure you understand what it is doing.

## Building on top of other plugins

One cool feature of Swish is that you don't have to keep reinventing the wheel when you want to make something happen.

The arguments passed to your plugin includes a `runPlugin` function. If you call this, Swish will run the specified plugin with the data provided and returns a promise which will resolve to the result.

Example usage:

```js
const result = await args.runPlugin('noop', args.textContent, 'user');
```

### Gotchas

#### Plugin Selection

By default, if there is both an inbuilt and a user plugin with the ID specified in the `runPlugin` function call, Swish will use the **inbuilt** plugin. Note that this is the opposite of the standard behaviour of Swish. 

This is for a couple of reasons:
1. If you bring in an external plugin, it will still work as expected even if you've overridden a plugin it depends on
2. You can write a plugin to override an inbuilt plugin, and build on top of whatever the existing plugin does, by pre- or post-processing the data.

If you want to explicitly use your own version of a plugin rather than the inbuilt one, you can pass an optional 3rd argument to the `runPlugin` function, e.g.:

```js
return args.runPlugin('noop', args.textContent, 'user');
```

## Example

The below example shows the absolute minimum required to build a plugin.
This plugin does absolutely nothing, it just returns whatever text content it was given.

```js
module.exports = {
    name: 'NO-OP',
    description: 'A basic plugin which does nothing.',
    id: 'noop',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    process: async (args) => args.textContent
};
```
