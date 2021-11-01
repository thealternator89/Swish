# Setup

There is a postinstall script which will set up the repo ready to work correctly.  
You should be able to get everything set up and ready to go by running `npm i` from the root of the repo.

If you the repo fails to be setup automatically, check out **Troubleshooting** below.

## Dependency Chain

The order of setup is incredibly important. The dependency chain is:

1. **Plugins**
2. **Base**
3. **Clip**, **Core**, **Gui**

If any later item in the chain is installed before the prior item is built the relevant items won't exist and will cause errors.


## Troubleshooting

Note that as the packages within the top-level directories in this repo depend on each other, this can **only** be used on filesystems where **symlink** _(or **junction** on Windows)_ capability is available. If you get errors mentioning symlinks during installation this may be the issue.  
For best results, avoid working on this repo on FAT, exFAT or shared file systems such as SMB.

## Setup Process:

> ⚠️ Wait until each step is complete before moving on to the next step!

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
   npm link # you can skip this if you don't want the swish-core cli
   ```
5. In the `/Gui` directory:
   ```bash
   npm install
   npm run build
   ```
6. In the `/Clip` directory:
   ```bash
   npm install
   npm run build
   ```
7. In the `/` directory: - _check it's all set up correctly_
   ```bash
   npm run build
   ```
