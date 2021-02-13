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
    status: 'info' | 'warn' | 'success';
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

If there are pieces of code which may throw deeper down (e.g. a file doesn't exist), you should test everything will be fine before trying to perform the action (e.g. check the file exists before attempting to open it), and throw an appropriate error if it isn't valid. If you can't confirm if an error will not be thrown, use a `try/catch` and throw your own, more understandable, error instead of letting the existing one bubble up.

### Progress/Status updates to the user

If your plugin takes time to process the user input, you should keep the user informed of the status or progress using the `progressUpdate` and `statusUpdate` functions passed to your plugin's process function.

These functions may be used together to provide a richer experience to the user.

#### Progress Update

To display a simple progress bar to the user, call `progressUpdate` passing a percentage value to be displayed.
This value may be an integer or floating-point, but **must** be in the range `0 < X < 100` (where "X" is the value passed). If the passed value is less than 0 or greater than 100, it will be coerced into this range.

#### Status Update

If your plugin does its work in multiple phases, and you would like to keep the user informed of the stage it's at, use the `statusUpdate` function and pass any string to be displayed to the user.

###
