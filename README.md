# electron-cinematizer-poc

This is a proof-of-concept app to demonstrate an electron app featuring a control window interacting/affecting a renderer window.

## Building and Development


### We're using Node v13.x.x (or better); install that first (e.g., with `nvm`):

```bash
# using nvm
nvm install v13
nvm use v13
```

### Running the app from your workspace:

This is a pretty straightforward/typical `nodejs` project. Install deps, run `build`, then run `start`:

```bash
npm install
npm run build # run `prod` instead for optimized (i.e., no `eval`)/minified code
rpm run start
```

### TODO: Use `electron-packager` to generate native apps for OS X, Windows, and Linux

Soon, but later.
