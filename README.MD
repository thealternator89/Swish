# Beep

Beep is an offline data transformation tool, heavily influenced by the Mac tool [Boop](https://boop.okat.best).

This is a monorepo containing the following:

* **Base**: The base plugin handling capability and interfaces shared amongst other repos
* **Core**: CLI client for Beep. Pipe data in to have it transformed using the same plugins as the Beep GUI
* **Gui**: Electron GUI client for Beep
* **Plugins**: Builtin plugins for Beep

## Differences to Boop

* Uses standard Node concepts for Plugins
  * Plugins are entirely defined as JavaScript (or TypeScript). Rather than metadata being contained in a commented JSON blob.
  * Plugins follow standard promise conventions
    * You just `return` the result, no need to handle the entire input
    * Error conditions are handled in the usual way (you can just `throw new Error()`)
    * Long-running processing can return feedback to the UI with simple callbacks
  * Simpler testing, as you don't need to mock the output functionality
* Beep determines what gets passed to your plugin. No need to try and determine what you should process in your plugin code.
* Structured to support multiple usage modes (CLI, GUI, library) from the same base

## Why use this and not something like Visual Studio Code

* Plugin simplicity - VS Code is a great IDE, but it's way too complicated to write simple data manipulation plugins

