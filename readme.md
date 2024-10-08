# Rabbit Ear app

# repository overview

Due to this being an electron app, there are three top level `src/` directories: `main`, `preload`, `renderer`. `main` and `preload` are essentially the backend (primarily Electron-exclusive), and `renderer` is the front-end, having little to do with Electron. Communication between the back and front ends occurs through [Electron's Inter-Process Communication](https://www.electronjs.org/docs/latest/tutorial/ipc), essentially leveraging the `window` global object, binding methods to it, and passing data back and forth.

Typical to all Javascript front-end frameworks (this project uses Svelte), the data model is closely tied with the front-end. Due to Electron's IPC barrier it seemed far more simple to place the data model in the front-end, inside `renderer`. IPC is fully capable of transferring the data model to the backend, which is so far used dealing with the file system (new, load, save file) and updating the app title and menubar if necessary. You can find these definitions in the back-end in `src/preload/` and in the front-end in `src/renderer/interface/`.

The bulk of the app exists inside the `renderer`.

The app is inherently an Electron app, but with minimal effort the front-end can be isolated and run alone (uncouple the `interface/` dir). Additionally, the front-end app is intended to be able to run without a user interface. The app's UI is fully contained inside of the `src/renderer/ui` directory. The UI communicates upwards to the app via `src/renderer/App`. An app without a UI appears like an empty screen, but there exists a command-line interface to edit the model. It should be entirely possible to disconnect the UI and still load a file, modify it, save it again, via some kind of command interface.

The final portion of the app worth mentioning is the command pattern interface. All modifications to the app and the model are formed as strings and handed off to a terminal-like interface to be executed by an application shell.

# dev notes

With minimal changes, this project began as an [Electron-Vite](https://electron-vite.org/guide/) starter project.

I updated Svelte to version 5 and added runes to the config:

```
compilerOptions: {
  runes: true,
},
```

**tsconfig.json**: these were required to import typescript files and they went into both ts config files.

```
"allowImportingTsExtensions": true,
"noEmit": true,
```

moduleResolution was required to include "rabbit-ear", an ES6 package into this Electron project which compiles to cjs.

```
"moduleResolution": "bundler",
```

