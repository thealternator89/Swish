# Swish-Core

A CLI-based implementation of the Swish application.

This accepts input via the `stdin` pipe.

> **⚠️ Windows Warnings**
> 
> * This application does not work on _PowerShell_ or _Windows PowerShell_. It works as expected through Command Prompt.
>   * PowerShell doesn't pass data as expected via the STDIN pipe. I haven't looked at fixing it.
> * Builtin plugins unify line endings to "LF". This may cause issues if the output target expects "CRLF" line endings.

## Installing 

This package isn't built or published to NPM yet. You can use it if you wish using the following instructions:

1. Ensure you have Node installed
2. Clone the repo somewhere
3. Follow the instructions in `SETUP.MD` at least up to step #4 (npm link)
4. Run `swish --version` to check it works

To update

1. Open the repo
2. Run `git pull`
3. Run `npm run build`

The linked `swish` executable will be updated.

## Flags

```
Usage: swish [options]

Options:
  -V, --version          output the version number
  -ls, --list            list all available plugins
  -i, --info <plugin>    print info about specified plugin
  -p, --plugin <name>    process input using a plugin
  -o, --opt <key=value>  pass an option to plugin
  -h, --help             display help for command
```

## Running

There are two ways to get data into the Swish CLI process.

### Basic

You can echo, or pipe the output of any other program into swish, as shown below:

```bash
$ echo "#333" | swish -p hex-to-rgb
```

### Files

You can either pipe a file from `cat` into swish, or directly into swish to perform a transformation, e.g:

```bash
$ cat package.json | swish -p minify-json
```

```bash
$ swish -p minify-json < package.json
```


