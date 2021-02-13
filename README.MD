# Swish

Swish is an awesome offline data transformation tool, heavily influenced by the Mac tool [Boop](https://boop.okat.best).

We often get data in weird, unreadable formats from various systems. Often it's tempting to use a web service to transform the data into something you can use - but not any more - Swish It!

Swish is built with Node, Electron and Angular.

## Repo

The Swish repo is a monorepo containing the following:

* **Base**: The base plugin handling capability and interfaces shared amongst other repos
* **Core**: CLI client for Swish. Pipe data in to have it transformed using the same plugins as the Swish GUI
* **Gui**: Electron GUI client for Swish
* **Plugins**: Builtin plugins for Swish

> ⚠️ If you would like to work on this repo, check out [SETUP.MD](docs/SETUP.MD) for instructions to get it all set up correctly.
> There is a very specific install/build order as each component depends on others.
> This will eventually be scripted, but it is currently a manual process.

## Differences to Boop

While Boop is an awesome tool, and Swish is heavily based on it, here are some ways Swish is different:

* Cross-platform - you can perform the same data transformation on Mac, Linux or Windows. Boop is Mac-only.
  * Your plugins can come with you wherever you go!
* Uses standard Node concepts for building plugins
  * Your plugin exports a CommonJS module containing all the data required by Swish, rather than containing a header comment in JSON which is hard to write.
  * Plugins follow standard promise conventions
    * You get passed some text content and (as long as you export an async function) can just directly return the result - no need to deeply understand any complex data.
    * Long-running processes can provide UI feedback with simple callback functions
  * Error conditions can be handled by throwing an Error - the message you use will be displayed to the user
  * Testing is really easy (even for long-running plugins) - no need to handle out-of-sync responses
* An error occurred somewhere deep in your plugin? Just open up the console to view the entire error, with stack trace!
* Multi-paradigm - you can use Swish via the GUI, or just pipe data through it in the console and use the exact same plugins!
* Plugins can use other plugins to do some transformation, making building custom plugins even easier!
* Don't like the way a builtin plugin does something? Create a custom plugin with the same ID, and your plugin replaces the builtin one!
* Swish uses the same hotkey as Atom, VS Code and Sublime Text to open the command palette - which developers who use these tools already have muscle memory for

## Differences to Atom, Sublime Text, VS Code, etc.

Swish doesn't aim to replace text editors or IDEs, and some things are far better to do in more full-featured editors.  
However for most simple data transformation, these are far too complex.

There's no reason to open an entire IDE to perform a very simple data transformation. If you want to write your own custom data transformation plugin, Swish has a much simpler plugin API which means you can finish writing your plugin sooner and get on to using it!

