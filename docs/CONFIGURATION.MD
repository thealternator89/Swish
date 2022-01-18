# Swish Configuration

There are two ways to configure how Swish works; Environment variables and your `.swishrc` file

- If a property is present in the `.swishrc` file, it will take precedent
- The environment variables are used if the _specific_ configuration isn't set in the `.swishrc`

## Environment Variables

- **`SWISH_PLUGIN_PATH`** - The path to the directory containing your user plugins. This should be the <u>absolute</u> path to your plugins.
* **`SWISH_CLIP_HOTKEY`** - The hotkey to use to display Swish Clip (only for Swish-Clip). This should match the Electron [Accelerator](https://www.electronjs.org/docs/latest/api/accelerator) definition.

## .swishrc

Create a file named `.swishrc` in your home directory:

- `~/.swishrc` on Mac/Linux
- `%USERPROFILE%\.swishrc` on Windows.

`.swishrc` is a JSON file, below is an example showing the entire configuration currently available:

```json
{
  "userPlugins": "~/Code/Swish-Plugins",
  "editor": {
    "font": "JetBrains Mono",
    "ligatures": true
  },
  "clip": {
    "hotkey": "Control+Alt+Space",
    "iconMode": "light"
  }
}
```

- **`userPlugins`**: The path to the directory containing your user plugins
- **`editor`**: _(These options are only used by Swish-Gui)_
  - **`font`**: The font to use in the editor
  - **`ligatures`**: Whether to use ligatures - what are ligatures? [see this from Fira Code](https://github.com/tonsky/FiraCode#whats-in-the-box)
- **`clip`**: _(These options are only used by Swish-Clip)_
  - **`hotkey`**: The hotkey to use to activate Swish-Clip - This should match the Electron [Accelerator](https://www.electronjs.org/docs/latest/api/accelerator) definition
  - **`iconMode`**: The color (`dark` or `light`) for the icon. If not set, we attempt to set the color based on the state of the OS, however this isn't always accurate - particularly if you use different color schemes for the taskbar and windows.

Note that `~` can be used as part of the `userPlugins` path on Windows as well as Linux and Mac. On Windows it refers to `%USERPROFILE%`.
