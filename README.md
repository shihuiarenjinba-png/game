# LUCK LAB v85 — MSIX migration STAGING (not synchronized)

**HOLD — NOT RELEASE READY.** This is a protective branch created on 2026-10-15. At present it does **not** contain the v85 game source files or a built MSIX. Existing `main` and `feature/offline-casino-arcade-alpha` were not modified.

To complete, import the full contents of `LUCK_LAB_V85_MSIX_GITHUB_READY_20261015.zip` from the ChatGPT handoff to this branch using `scripts/IMPORT_TO_GITHUB.ps1` within the package. The ZIP includes v85 seven-game source, Electron desktop host, Windows Actions MSIX beta build workflow, QA tests and store-readiness documents.

After import, GitHub Actions must build a real `.msix` using Partner Center identity & publisher, report the source commit SHA and SHA-256, and a Windows computer must pass install/save/update testing. No claim of market readiness is authorized before those gates pass.

Do not push a ZIP only. Source code is canonical; package artifacts are derived from an exact GitHub commit. Do not merge before acceptance.
