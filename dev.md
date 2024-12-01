# 2024-11-30

Things that need cleanup:

- keyboard and keybindings haven't been touched since early days, but they work; i just checked
- need to focus again on the terminal. we can start to pass more commands through it. consider namespaces (ui, app)

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

