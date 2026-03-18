#!/bin/bash

set -euo pipefail

set -o xtrace

docker build -t localhost/postiz -f Dockerfile .
