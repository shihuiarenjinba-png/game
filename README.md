# LUCK LAB v85 — GitHub-first Windows/MSIX release candidate source

**State: SOURCE/PACKAGING HANDOFF READY, MSIX NOT BUILT, MICROSOFT STORE HOLD.**

This is a **new, self-contained** source tree based on the v85 seven-game browser version. The previous GitHub `main` and `feature/offline-casino-arcade-alpha` are deliberately preserved. The current staging branch `release/luck-lab-v85-msix-20261015` contains only a protective staging README until the full source is imported.

## Architecture

- `index.html`, `luck-lab.html`, `*.js`, `*.css`: original v85 gameplay and UI (7 tables, fictional credits/loans, baccara squeeze).
- `desktop/main.cjs`: offline Electron desktop entrypoint; sandboxed renderer, no Node integration, denies external navigation and popups.
- `desktop/smoke.cjs`: Windows Electron smoke test for game floor and localStorage reload.
- `package.json` and `scripts/prepare-msix-config.cjs`: pinned Electron + pre-release MSIX builder, generates configuration only after requiring the real Store identity.
- `.github/workflows/msix-build.yml`: Windows Actions test → actual MSIX → manifest/hash validation → artifact upload.
- `build/appx/*.png`: source-controlled icon assets.
- `scripts/IMPORT_TO_GITHUB.ps1`: safe, non-force-push import to the pre-created staging branch.

## Do not skip the following steps

1. Extract this entire archive on a Windows PC. Install Git and Node.js 22.
2. Run `npm test` (source tests; does not require Electron download).
3. Run `powershell -ExecutionPolicy Bypass -File .\scripts\IMPORT_TO_GITHUB.ps1` from the extracted folder. This requires GitHub authentication. It never edits `main` or the historical alpha branch. Record the emitted **GitHub source commit SHA**.
4. Set GitHub repository **Actions variables** `LUCK_STORE_IDENTITY_NAME`, `LUCK_STORE_PUBLISHER`, `LUCK_STORE_PUBLISHER_DISPLAY_NAME` to the **actual Microsoft Partner Center package identity and publisher**, not a guessed value. Check the exact string. Do not print certificates or secrets into build logs.
5. Use GitHub Actions `LUCK LAB v85 MSIX / manual release gate` on the verified branch. The build requires Windows and pins `electron-builder@27.0.0-alpha.10` because the separate `msix` target is beta and not stable in electron-builder v26.
6. Download the Actions artifacts for that same commit and check `BUILD_SOURCE.txt`, `SHA256SUMS.txt`, manifest (`AppxManifest.xml`), and actual `.msix` file. `.appx` and `.zip` renamed to `.msix` are invalid substitutes.
7. Perform signed/test MSIX installation, save/restart, all 7 games, old-save migration, upgrade, uninstall on a real Windows PC. The MSIX may need a matching trusted development certificate for local sideload installation.
8. Verify Microsoft Store policies, virtual gambling content age rating and regional availability; then submit. **Do not treat GitHub Actions PASS as Store certification or a sales forecast.**

## QA performed in the authoring container

`npm test` passed: 55 HTML resource references, 66 original source SHA-256 checks, v85 story milestone random cases 15,000, v83 baccarat cases 21,009, v82 rules cases 40,024, v80 recovery 34, v81 card balance 2,153. Syntax check passed for 53 source JavaScript files. MSIX build and native Windows smoke **not executed** in this Linux sandbox.

## Sources and risk boundaries

No real money, cash-out, external wagers, prize redemption or actual loan repayment. The game narrative can introduce fictional retroactive liabilities; the app must clearly disclose before play that these are fictional credits only and will never generate real-world obligations.

Treat `*.js` from the v85 game archive as a release candidate, not audited production code. The offline Electron host does not implement DRM. Review commercialization, IP, localization, security, Store content rules, accessibility and consumer transparency separately.
