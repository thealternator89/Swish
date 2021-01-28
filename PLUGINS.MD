# Beep Plugins

Plugins are standard commonjs modules. You can build them in vanilla javascript or use something like TypeScript.
If your user plugin directory is a 

## Structure

Your module should match the following type definition:
```typescript
interface PluginDefinition {
    name: string;
    id?: string;
    description: string;
    options?: PluginOptions;
    author: string;
    tags: string[];
    beepVersion: string;
    process: (args: PluginArgument) => Promise<string>;
}
```

### Properties

* **`name`**: Your plugin name which is displayed in the UI. This should be short and obvious.
* **`id`**: _(optional)_ Your plugin ID. This is mainly used by Beep-Core. If not provided, your plugin's filename _(excluding the `.js`)_ is used.
* **`description`**: A longer description of your plugin.
* **`options`**: _(optional)_ Options your plugin takes. See below for the structure for this property.
* **`author`**: Your name.
* **`tags`**: Words to help filtering your plugin. See below for ideas for what you can put here.
* **`beepVersion`**: The version of Beep-Base which your plugin supports. Beep will load the plugin if the major version matches, and the minor version is less than the current minor version
* **`process`**: The function which is invoked to process data. See below for how this works.

## Process function

The `process` function in your plugin is where the magic happens!

You will be passed data matching the following shape:
```typescript
interface PluginArgument {
    textContent: string;
    statusUpdate(text: string): void;
    progressUpdate(percent: number): void;
}
```

* **`textContent`**: The text content to process
* **`statusUpdate`**: A function to call to update the UI with the current status - used for long-running plugins
* **`progressUpdate`**: A function to call to update the UI with the progress through the task - used for long-running plugins. This takes a whole-number percentage as an argument in the range `0` - `100`.

Your process function must return a promise which resolves with either a string or an object of the following shape:
```typescript
type PluginResult = string | {
    text?: string, // The text result of your plugin
    message?: { // A message to display in the UI
        text: string, // The text of the message
        status: 'info' | 'warn' | 'success', // Type of message, used to determine the UI to use
    }
}
```

The text you pass back will be the entirety of what is given to the user.

### Error Handling

If your plugin experiences any issues which cannot be resolved, you should reject the promise with an error. If you write this as an async/await function, you can just `throw` an error to reject the promise. The message property of the thrown error object is used to display the problem to the user, so be as specific as you can about what has gone wrong.

If there are pieces of code which may throw deeper down (e.g. a file doesn't exist), you should preferably test everything will be fine before trying to perform the action (e.g. check the file exists before attempting to open it), and throw an appropriate error if it isn't valid. If you can't confirm if an error will not be thrown, use a `try/catch` and throw your own, more understandable, error instead of letting the existing one bubble up.

Examples of times to throw an error:
* User input

### Progress/Status updates to the user

If your plugin takes time to process the user input, you should keep the user informed of the status or progress using the `progressUpdate` and `statusUpdate` functions passed to your plugin's process function.

These functions may be used together to provide a richer experience to the user.

#### Progress Update

To display a simple progress bar to the user, call `progressUpdate` passing a percentage value to be displayed.
This value may be an integer or floating-point, but **must** be in the range `0 < X < 100` (where "X" is the value passed). If the passed value is less than 0 or greater than 100, it will be coerced into this range.

#### Status Update

If your plugin does its work in multiple phases, and you would like to keep the user informed of the stage it's at, use the `statusUpdate` function and pass any string to be displayed to the user.
