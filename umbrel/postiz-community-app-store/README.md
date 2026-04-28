# Postiz Umbrel Community App Store

This folder is a ready-to-publish Umbrel custom app store scaffold for Postiz.

## Contents

- `umbrel-app-store.yml`
- `postiz-postiz-lite/`

## Default IDs

This scaffold uses:

- app store id: `postiz`
- app id: `postiz-postiz-lite`

If you want to rename the store before publishing it, update:

1. `umbrel-app-store.yml`
2. the app folder name
3. `id` in `postiz-postiz-lite/umbrel-app.yml`
4. `APP_HOST` in `postiz-postiz-lite/docker-compose.yml`

## Image workflow

The app compose file defaults to `localhost/postiz:lite`, which matches the
runtime image produced by:

```powershell
.\scripts\build-runtime-image.ps1
```

Copy the resulting `postiz-lite.tar` to the Umbrel host and run:

```bash
docker load -i postiz-lite.tar
```

Then publish this folder as its own GitHub repository and add that repository
URL in Umbrel via `App Store` -> `Add Custom App Store`.
