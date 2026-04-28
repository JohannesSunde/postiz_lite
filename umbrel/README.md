# Umbrel Package Draft

This folder mirrors Umbrel's community app store layout for a single Postiz app
and is meant as a starting point for a DIY/custom Umbrel app store.

## What is included

- `postiz-lite/umbrel-app.yml`
- `postiz-lite/docker-compose.yml`
- `postiz-lite/exports.sh`
- `postiz-community-app-store/` ready-to-publish custom store scaffold

## Before you add it to a custom app store

Umbrel's community app store template expects:

1. A repo-level `umbrel-app-store.yml`
2. Every app folder name to exactly match that app's `id`
3. Every app `id` to start with your app store `id`

Example:

- app store id: `acme`
- app id: `acme-postiz-lite`
- app folder: `acme-postiz-lite/`

If you publish this app through your own store, rename `postiz-lite/` and the
`id:` inside `umbrel-app.yml` to use your app store prefix. Also update
`APP_HOST` in `docker-compose.yml` so it matches the renamed app id:

```yaml
services:
  app_proxy:
    environment:
      APP_HOST: acme-postiz-lite_web_1
```

## Fastest path: local image on your Umbrel host

This draft is optimized for a low-powered Umbrel host and assumes you build the
runtime image elsewhere, then import it onto Umbrel.

1. Build and export the runtime image on a stronger machine:

```powershell
.\scripts\build-runtime-image.ps1
```

2. Copy `postiz-lite.tar` to your Umbrel server.

3. Load it on Umbrel:

```bash
docker load -i postiz-lite.tar
```

4. Create a GitHub repo from Umbrel's community app store template:

   [https://github.com/getumbrel/umbrel-community-app-store](https://github.com/getumbrel/umbrel-community-app-store)

5. In that repo, set your store metadata in `umbrel-app-store.yml`.

6. Copy this folder's `postiz-lite` app into the custom store repo, then rename
   the folder and app id to include your store prefix.

7. Push the custom store repo to GitHub.

8. In Umbrel, open App Store and add your custom app store by pasting the GitHub
   repo URL.

9. Install the Postiz app from the Umbrel UI.

## Better distribution path: publish the image

For a reusable custom store, publish the Postiz image to a registry and update
the app compose file to use that image reference instead of
`localhost/postiz:lite`.

The compose file reads `APP_POSTIZ_IMAGE`, so you can either:

- hardcode your published image reference in `docker-compose.yml`, or
- export `POSTIZ_IMAGE` through your app store environment before install

For broader distribution, follow Umbrel's app framework guidance and pin the
image by digest before you share the store with other users.
