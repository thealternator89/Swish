# Swish-Base

This is the base of Swish - this is used by both Swish-Core and the Swish GUI. 

Swish-Base contains a PluginManager and coordinates plugin execution.

Swish-Base handles:

* Loading system and user plugins
* Checking plugin target versions
* Providing a list of plugins which match search queries
* Running plugins, including child plugins called from other plugins
