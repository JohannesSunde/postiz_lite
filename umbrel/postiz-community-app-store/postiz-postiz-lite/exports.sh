#!/usr/bin/env bash

# Override POSTIZ_IMAGE before install if you publish the runtime image to a registry.
export APP_POSTIZ_IMAGE="${POSTIZ_IMAGE:-localhost/postiz:lite}"
