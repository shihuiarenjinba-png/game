# LUCK LAB v85 — Windows/MSIX release acceptance gate

## Verified by current local environment

- [x] Source archive integrity checked: 66 SHA-256 source files
- [x] Seven tables present on landing page
- [x] Relative HTML/CSS/JS resources present
- [x] Story/finance/baccarat/dealer unit and randomized tests passed
- [x] New standalone Electron host + packaging config authored
- [x] Partner Center identity missing => build stops
- [x] Existing `main` and alpha branch preserved
- [ ] v85 code pushed to staging GitHub (await Windows import)
- [ ] Actions run on imported commit SHA
- [ ] Genuine `.msix` created and hashed
- [ ] MSIX AppxManifest identity/publisher match Partner Center
- [ ] MSIX signed or accepted by Store-signed submission path
- [ ] Windows smoke screenshots from MSIX build
- [ ] Real Windows 10/11 install, launch, close/reopen and persistence
- [ ] Upgrade from a previous signed package tested
- [ ] Browser-version saves migration tested (file origin != packaged app origin)
- [ ] High DPI, keyboard, 320/390/1366 px, audio and motion reduction tested
- [ ] All 7 games tested for payout settlement, coin ledger, loan interest, story transition, anti-tamper behavior
- [ ] Virtual gambling classification and content/age rating policy checked by Store review
- [ ] Store listing price, language, screenshots, privacy policy and description approved
- [ ] Commercial rights, obligations, refund and support information approved
- [ ] Microsoft Store certification completed

Final state: **HOLD**, not finished MSIX, not sellable, no verified sales projections.
