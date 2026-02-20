# Nyarch Updater QT

Build of Nyarch Updater for QT and the KDE Plasma DE spin of Nyarch Linux.

## Development

The project is built using node-gui and nodejs. You therefore neew Node 20.x or above to run the project.

Clone the project, then intall the packages through Yarn. Please do **NOT** forget to put the correct QT_INSTALL_DIR environment variable, otherwise the project will run with miniqt, and will not have the correct theming (breeze).

```bash
git clone https://github.com/NyarchLinux/NyarchUpdater-QT.git
cd NyarchUpdater-QT
QT_INSTALL_DIR=/usr/lib/qt6 yarn install
```

Don't forget to point the QT_INSTALL_DIR to the correct path on your system (this example is for Arch Linux). Please also install QT6 and breeze.

## Running

To run the project, simply run the following command:

```bash
yarn dev
```

If you want to watch for changes, run the following command:

```bash
yarn watch
```

## Building

To build the project, run the following command:

```bash
yarn build
```

## Packaging

To package the project, run the following command:

```bash
yarn package
```

It uses nodegui-packer to package the project.
