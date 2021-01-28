# Beep-Core

A CLI-based implementation of the beep application.

This accepts input via the `stdin` pipe.

> ⚠️ WARNING: This has not been tested on Windows.
> This uses ANSI escape codes to move the caret to provide feedback while a plugin is running. These (probably) don't work on Windows and may end up doing weird things. They might work with the new Windows terminal with ConPTY though.

## Flags

```
Usage: beep [options]

Options:
  -V, --version          output the version number
  -ls, --list            list all available plugins
  -i, --info <plugin>    print info about specified plugin
  -p, --plugin <name>    process input using a plugin
  -o, --opt <key=value>  pass an option to plugin
  -h, --help             display help for command
```

### -V, --version

Output the version number

### -ls, --list

List all available plugins

## Running

There are two ways to get data into the Beep CLI process.

### Basic

You can echo, or pipe the output of any other program into beep, as shown below:

```bash
$ echo "#333" | beep -p hex-to-rgb
```

### Here Document

You can use a Here Document to pass larger static data to Beep. E.g.:

```bash
$ beep -p minify-json <<EOF
{
    "test": true,
    "thing": 15
}
EOF
```

### Files

You can either pipe a file from `cat` into beep, or directly into beep to perform a transformation, e.g:

```bash
$ cat package.json | beep -p minify-json
```

```bash
$ beep -p minify-json < package.json
```


