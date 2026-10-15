# Import the entire v85 source tree to the existing protected GitHub staging branch.
# NO force push; never alters main or the old alpha branch.
[CmdletBinding()]
param(
    [string]$Repository = 'https://github.com/shihuiarenjinba-png/game.git',
    [string]$Branch = 'release/luck-lab-v85-msix-20261015',
    [string]$Destination = (Join-Path $env:TEMP 'luck-lab-v85-msix-import')
)
$ErrorActionPreference = 'Stop'
$Source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (Test-Path $Destination) { throw "Destination already exists; choose a new empty directory: $Destination" }
if (-not (Test-Path (Join-Path $Source 'luck-story-v85.js'))) { throw 'v85 source missing. Extract the entire ZIP first.' }
if (-not (Test-Path (Join-Path $Source '.github/workflows/msix-build.yml'))) { throw 'MSIX workflow missing.' }
node (Join-Path $Source 'scripts/check-package.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Source integrity failed; import cancelled' }
git clone --origin origin $Repository $Destination
if ($LASTEXITCODE -ne 0) { throw 'Git clone failed; check GitHub credentials' }
Push-Location $Destination
try {
    git fetch origin
    if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
    git switch --track "origin/$Branch"
    if ($LASTEXITCODE -ne 0) { throw "Protected staging branch missing: $Branch" }
    $Original = (git rev-parse HEAD).Trim()
    if ($Original -ne '781ad5a34c6ec3ecfc83b783c07c0b43ee70841b') {
        throw "Unexpected staging head ($Original). Inspect before changing; no automatic overwrite."
    }
    Get-ChildItem -LiteralPath $Source -Force | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination $Destination -Force -Recurse
    }
    node scripts/check-package.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Copied source integrity failed' }
    git add --all
    git commit -m 'feat: import LUCK LAB v85 seven-game source and MSIX Windows packaging'
    if ($LASTEXITCODE -ne 0) { throw 'Commit failed; check git user.name/user.email and changes' }
    git push --set-upstream origin $Branch
    if ($LASTEXITCODE -ne 0) { throw 'Push failed; branch remains local; do not claim synchronization' }
    git fetch origin $Branch
    if ($LASTEXITCODE -ne 0) { throw 'Remote re-fetch failed' }
    $Local = (git rev-parse HEAD).Trim()
    $Remote = (git rev-parse "origin/$Branch").Trim()
    if ($Local -ne $Remote) { throw 'Local and remote commit mismatch; sync not verified' }
    Write-Output "GITHUB_SYNC_VERIFIED=$Local"
    Write-Output "REPOSITORY_BRANCH=$Repository $Branch"
    Write-Output 'Next: configure Partner Center repository variables; GitHub Actions MSIX workflow is triggered on push.'
} finally { Pop-Location }
