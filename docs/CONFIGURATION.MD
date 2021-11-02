# Swish Configuration

There are two ways to configure how Swish works; Environment variables and your `.swishrc` file

- If a property is present in the `.swishrc` file, it will take precedent
- The environment variables are used if the _specific_ configuration isn't set in the `.swishrc`

## Environment Variables

Currently only one environment variable is used:

- **`SWISH_PLUGIN_PATH`** - The path to the directory containing your user plugins. This should be the <u>absolute</u> path to your plugins.

## .swishrc

**Note: This currently only works with the _Swish GUI_ - support will be brought to the CLI later.**

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
  }
}
```

- **`userPlugins`**: The path to the directory containing your user plugins
- **`editor`**: _(These options are only used by Swish-Gui)_
  - **`font`**: The font to use in the editor
  - **`ligatures`**: Whether to use ligatures - what are ligatures? [see this from Fira Code](https://github.com/tonsky/FiraCode#whats-in-the-box)

Note that `~` can be used as part of the `userPlugins` path on Windows as well as Linux and Mac. On Windows it refers to `%USERPROFILE%`.
