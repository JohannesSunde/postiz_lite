# Umbrel Package Draft

This folder mirrors Umbrel's community app store layout for a single app.

## What is included

- `postiz-lite/umbrel-app.yml`
- `postiz-lite/docker-compose.yml`
- `postiz-lite/exports.sh`

## How to use it

This draft is designed for a low-powered Umbrel host, but it still expects a
prebuilt Postiz image to exist locally on the server.

1. Build the runtime image on a stronger machine:

```powershell
.\scripts\build-runtime-image.ps1
```

2. Copy `postiz-lite.tar` to your Umbrel server and load it:

```bash
docker load -i postiz-lite.tar
```

3. Copy `umbrel/postiz-lite` into your Umbrel app store directory.

4. Install the app from the Umbrel UI.

## Important note

Umbrel's community app store normally expects images to be published to a
registry and pinned by digest. This draft keeps the configuration local and
simple so you can test the final product path first. Before submitting to a
community app store, replace the local image reference with your published
image and digest.
