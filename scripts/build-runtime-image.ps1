param(
  [string]$Tag = 'localhost/postiz:lite',
  [string]$Output = 'postiz-lite.tar'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$dockerfile = Join-Path $repoRoot 'Dockerfile'
$outputPath = if ([System.IO.Path]::IsPathRooted($Output)) {
  $Output
} else {
  Join-Path $repoRoot $Output
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker is not installed or not available on PATH.'
}

Push-Location $repoRoot
try {
  docker build --progress=plain -t $Tag -f $dockerfile .
  docker save -o $outputPath $Tag
  Write-Host "Saved $Tag to $outputPath"
}
finally {
  Pop-Location
}
