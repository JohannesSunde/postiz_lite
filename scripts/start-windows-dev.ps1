param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$dockerConfig = Join-Path $repoRoot '.docker-config'

New-Item -ItemType Directory -Force -Path $dockerConfig | Out-Null
$env:DOCKER_CONFIG = $dockerConfig

Push-Location $repoRoot
try {
  docker compose -f docker-compose.windows-dev.yaml up -d --build
}
finally {
  Pop-Location
}
