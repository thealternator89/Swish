# Plugin Examples

This folder contains a few plugins which aren't very useful, but can be helpful for writing custom plugins.

Current examples:

* **`1_noop.js`**
  The most basic example of a plugin with the bare minimum required information. This is a NOOP - a plugin which does nothing - it just returns whatever it was given.
* **`2_noop-slow.js`**
  A plugin which takes time to do nothing. This is a NOOP as well, but it takes a while to get there, so uses the notification methods (`progressUpdate` and `statusUpdate`) to keep the user up to date with what's going on. ⚠️ **NOTE that the notification methods aren't currently supported in Swish Clip** (they won't break anything though!)
* **`3_noop-deep.js`**
  An example of extending a plugin. This is also a NOOP, but it gets its result from `noop-slow`
* **`4_factorial.js`**
  An example of writing a recursive plugin. Give it a number and it will calculate the factorial by recursively invoking itself.
