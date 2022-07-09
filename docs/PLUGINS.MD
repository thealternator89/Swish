# Swish Plugins

It's incredibly easy to extend the functionality of Swish with your own custom plugins.

Swish will automatically pick up any plugins in a directory you specify - see [CONFIGURATION.MD](CONFIGURATION.MD) for how to specify a directory you will store your plugins in.

## Table of Contents

* [Building a Swish plugin](#building-a-swish-plugin)
  * [Process Function](#process-function)
  * [Returning a result](#returning-a-result)
  * [Error Handling](#error-handling)
  * [Progress/Status updates to the user](#progressstatus-updates-to-the-user)
  * [A note on Line Endings](#a-note-on-line-endings)
  * [NPM Packages](#npm-packages)
  * [Preventing a JS file being loaded as a plugin](#preventing-a-js-file-being-loaded-as-a-plugin)
  * [Limitations](#limitations)
* [Building on top of other plugins](#building-on-top-of-other-plugins)

## Building a Swish plugin

Swish plugins are standard commonjs modules. You can build them in vanilla JavaScript or use a language which transpiles to JavaScript, like TypeScript to  (all the built-in plugins are built with TypeScript). Your module should export an object with the following shape:

```typescript
interface PluginDefinition {
  name: string;
  id?: string;
  description?: string;
  author?: string;
  tags?: string[];
  icon?: string;
  swishVersion?: string;
  hidden?: boolean;
  process: (args: PluginArgument) => Promise<string>;
}
```

- **`name`**: Your plugin name which is displayed in the UI. This should be short and obvious.
- **`id`**: _(optional)_ Your plugin ID. If not provided, Swish will generate one based on the plugin's filename.
- **`description`**: A longer description of your plugin.
- **`author`**: Your name.
- **`tags`**: Words or phrases to help filtering your plugin.
- **`icon`**: The icon to use in Swish beside your plugin.  
   Swish contains [Material Design Icons](https://material.io/icons). Select an icon and use the name of it here.
- **`swishVersion`**: The version of Swish-Base which your plugin targets.  
  If provided, Swish will only load this plugin if it targets the current major version, and the current or a previous minor version.
- **`hidden`**: _(optional, defaults to `false`)_ Whether this plugin should be hidden.
  This is useful for hiding inbuilt plugins by defining a plugin which has the same ID but is marked as hidden.
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
  html?: string;
  rtf?: string;
  message?: {
    text: string;
    level: 'info' | 'warn' | 'error' | 'success';
  };
}
```

- **`text`**: The resulting text for the plugin execution
- **`html`**: The resulting text as HTML - _only for Swish-Clip_
- **`rtf`**: The resulting text in RTF format - _only for Swish-Clip_
- **`message`**:
  - **`text`**: Text of the message to display to the user
  - **`level`**: The status of the message - used to colour the message.

Note that **no part of the object is required**, but you should at least return either `text` or the `message`.  
This is useful to allow you to build a plugin which provides feedback on the input without modifying the text.

#### Text, HTML and RTF?
> :warning: this is only relevant for **Swish-Clip**

Plugins can output Text, HTML and RTF if required.  
The default response (when you just return a string from your plugin) is 'text' - this is used by all versions of Swish.

Why would I want to output HTML or RTF?
* Plain text is pretty boring - spice it up with some **formatting**.
* Provide your data in a table to make it more readable or able to be ingested into other applications like Excel
* Your plugin can build a link with a human-readable title, rather than just a plain URL

Since HTML and RTF are only available from Swish-Clip, you should _always_ return `text`.  
`html` and `rtf` are both completely optional, you can provide one without the other.

### Error Handling

If your plugin experiences any issues which cannot be resolved, you should reject the promise with an error. If you write this as an async function, you can just `throw` an error to reject the promise. The message property of the thrown error object is used to display the problem to the user, so be as specific as you can about what has gone wrong.

### Progress/Status updates to the user

If your plugin takes time to process the user input, you should keep the user informed of the status or progress using the `progressUpdate` and `statusUpdate` functions passed to your plugin's process function.

These functions may be used together to provide a richer experience to the user.

**Note: Status and Progress updates are not supported in Swish-Clip**

#### Progress Update

To display a simple progress bar to the user, call `progressUpdate` passing a percentage value to be displayed.
This value may be an integer or floating-point, but **must** be in the range `0 <= X <= 100` (where "X" is the value passed). If the passed value is less than 0 or greater than 100, it will be coerced into this range.

#### Status Update

If your plugin does its work in multiple phases, and you would like to keep the user informed of the stage it's at, use the `statusUpdate` function and pass any string to be displayed to the user.

### A note on Line Endings

When data is passed to your plugin, Swish will automatically convert any line endings to **`LF`** (`\n`).
Swish will automatically convert the line endings in your result to match the input. :warning: **The line endings used by your plugin will not be preserved.**

### NPM Packages

Your plugin doesn't have to do everything on its own. You can use external NPM packages - install any packages you need in your plugins directory, and they can be used with your plugin.

### Preventing a JS file being loaded as a plugin

If you prefix the filename of a JS file in the plugins directory with an underscore, Swish will ignore it.
This is useful for having common code in, for example, a `_util.js` file, or for hiding plugins you don't need right now.

### Limitations

Swish currently loads all plugins synchronously on launch. If your plugin does a lot of work outside of the `process` function, you can easily increase the amount of time it takes for Swish to launch.

Because of how JavaScript and CommonJS modules work, plugins aren't sandboxed, and can be doing things even when you don't explicitly run them. If you have a JS file in your plugins directory it could be doing anything at any time that Swish is running. If you want to bring a plugin or module in, make sure you understand what it is doing.

## Building on top of other plugins

One awesome feature of Swish is that you don't have to keep reinventing the wheel when you want to make something happen.

One thing included in the arguments passed to your plugin is a `runPlugin` function. If you call this, Swish will run the specified plugin with the data provided and returns a promise which will resolve to the result.

Example usage:

```js
const result = await args.runPlugin('base64-decode', args.textContent);
```

### Gotchas

#### Plugin Selection

By default, the `runPlugin` function will attempt to use an **inbuilt** plugin, and will fail if it can't find one.

This is for a couple of reasons:
1. If you bring in an external plugin, it will still work as expected even if you've created a custom plugin which overrides a plugin it depends on
2. You can write a plugin to override an inbuilt plugin, and build on top of whatever the existing plugin does, by pre- or post-processing the data.

If you want to explicitly use your own version of a plugin rather than the inbuilt one, you can pass an optional 3rd argument to the `runPlugin` function, e.g.:

```js
return args.runPlugin('noop', args.textContent, 'user');
```

#### Infinite Loop detection

Swish contains a rudimentary infinite loop detection mechanism, to prevent you accidentally entering an infinite loop, by calling the same plugin with the same data repeatedly, and crashing the entire application.

This is built on 2 assumptions:
  1. Plugins should be deterministic - if a plugin is passed a certain value it will always follow the same logic
  2. Plugins are run sequentially

Therefore, if Swish detects that a single plugin has been launched with the same input twice, it assumes that the plugin has entered an infinite loop and it will refuse to continue.

You can trigger a false-positive detection of an infinite loop by:
  1. Running multiple instances of the same plugin in parallel by not awaiting the promise before starting the next instance, and
  2. Passing the same data to each instance of the plugin

See the below example:

```js
module.exports = {
  name: "Infinite Loop",
  id: "infinite-loop",
  description: "Cause a false-positive detection of an infinite loop",
  process: async(args) => {
    const promises = args.textContent.split('\n').map(() => args.runPlugin('uuid-generate-v4', ''));
    const resolved = await Promise.all(promises);
    return resolved.join('\n');
  }
}
```

This plugin is just attempting to generate a UUID for every line which was passed to the plugin,
but because we aren't either (a) waiting for the promise from `runPlugin` to resolve, or
(b) passing unique data to the plugin, Swish will assume that we have gotten into an infinite loop
if we try to generate more than 1 UUID.

We can fix the above example by replacing  
`() => args.runPlugin('uuid-generate-v4', '')` with  
``(_, i) => args.runPlugin('uuid-generate-v4', `${i}`)``

This will pass the index of each line to the `uuid-generate-v4` plugin, meaning it will always get a unique input, and not be falsly detected as entering an infinite loop.

## Examples

Check out the examples in the [Plugin-Examples](../Plugin-Examples) directory. There are several good examples of the following:
* The minimum plugin you need
* A slow plugin which keeps the user informed what is happening
* A plugin which runs another plugin as part of its work
* A plugin which recursively calls itself to reach a result
