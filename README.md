# icmod

Developing mods for InnerCore has never been so easy!

## Features

- [x] ADB integration
- [ ] Debug & release modes
- [ ] Resource bundling
- [ ] Full library support (with resources too)

## Languages

| Language   | Debug | Release |
|------------|-------|---------|
| JavaScript | ✔️    | 🔧      |
| TypeScript | ❌    | ❌      |
| C++        | ❌    | ❌      |
| Java       | ❌    | ❌      |

## Installation

```
npm i -g icmod
```
or
```
yarn global add icmod
```

## Getting Started

To create your first mod open the terminal and run
```
icmod new <name>
```
Then you will need to connect to your smartphone or emulator:
```
icmod connect
```
And run your mod on device (Horizon modding kernel must be installed on the device)
```
icmod run
```
## Usage

```
Usage: icmod [options] [command]

Options:
  -h, --help            display help for command

Commands:
  new [options] <name>  Create a new project
  run [options]         Run mod on device
  connect               Connect to device
  disconnect            Disconnect from device
  build [options]       Build the project
  help [command]        display help for command
```

## Project Structure

TODO

## Troubleshooting

TODO

## Contributing

I would ❤️ for you to get involved with icmod development! If you wish to help, you can make a pull request.
