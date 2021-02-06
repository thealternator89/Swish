# Setup

If you want to set up this repo to work on, or to use the Beep-Core cli package, follow this document to set it up once cloned. I will create a postinstall script at some point to do this automatically.

Note that the order of the below steps is **very** important. The dependency chain is `Plugins` -> `Base` -> `Core` | `Gui`, if any later item in the chain is `install`ed before the prior item is built the relevant items won't exist and will cause errors.

Note that as the packages within the top-level directories in this repo depend on each other, this can **only** be installed on filesystems where **symlink** _(or **junction** on Windows)_ capability is available. If you get errors during installation this may be the issue. For best results, avoid working on this repo on FAT,exFAT or shared file systems (such as SMB).

## Setup Process:

1. In the `/` directory:
    ```bash
    npm install
    ```
2. In the `/Plugins` directory:
    ```bash
    npm install
    npm run build
    ```
3. In the `/Base` directory:
    ```bash
    npm install
    npm run build
    ```
4. In the `/Core` directory:
    ```bash
    npm install
    npm run build
    npm link # skip this if you don't want beep-core cli
    ```
5. In the `/Gui` directory:
    ```bash
    npm install
    ```
