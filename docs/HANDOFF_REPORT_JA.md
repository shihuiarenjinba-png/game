# LUCK LAB v85 — GitHub / MSIX開発引き継ぎ報告（2026-10-15）

## 最終判定

**GitHubの専用ステージングブランチ作成は完了。v85ソースのGitHub同期と実MSIX生成は未完了。販売判定はHOLD。**

完成を偽らないために、本資料と同梱スクリプトはMSIXの実ファイルができたときだけ「成果物あり」と判定する。

## GitHubで実際に変更したこと

- 接続アカウント：`shihuiarenjinba-png`
- 対象：`https://github.com/shihuiarenjinba-png/game`
- 新規ブランチ：`release/luck-lab-v85-msix-20261015`
- ステージングREADMEコミット：`781ad5a34c6ec3ecfc83b783c07c0b43ee70841b`
- ブランチ上に「ソース未同期 / MSIX未作成 / 販売HOLD」と明記。
- **既存main、feature/offline-casino-arcade-alphaは編集・マージ・上書きしていない。**

## ローカルで完成した部分

- v85原本から全ゲームソース・画面・テストを復元。66ソース（HTML/JS/CSS）のSHA-256が原本ZIPと一致。
- 新規Electronオフラインホスト：レンダラーNode無効、contextIsolation、sandbox、外部サイトへの画面遷移・新規ウィンドウ禁止。
- PC用MSIXビルド設定：Electron 44.6.0 / electron-builder 27.0.0-alpha.10（MSIX機能はベータ）。実際のPartner Center Identity/Publisherがないとビルドを停止。
- `.github/workflows/msix-build.yml`：Windows上でテスト、Electron GUI smoke、MSIX生成、AppxManifest/BlockMap確認、SHA-256記録、GitHub Actions成果物作成。
- WindowsでのGitHub取り込み用 `scripts/IMPORT_TO_GITHUB.ps1`：別ブランチ限定、既存コミット照合、push後SHA一致検査、force push禁止。
- 7ゲームの入口、返済物語、カード絞りなど、元のゲームの抽選ロジックは**変更していない**。

## 実施した検証

- 8個のテストスクリプト（v79, v80, v81, v82 ×2, v83, v84, v85）がPASS。
- 55件のHTMLファイル参照チェックPASS。
- 元の66ソースファイルSHA-256チェックPASS。
- 53個のゲームルートJavaScript構文チェックPASS。
- バカラ数万ケース、物語条件25,000以上のランダムケースなど既存テストを再実行。
- 設定生成器：ダミーのテストIDではJSON生成を確認し、識別情報が未設定の場合は失敗することを確認。テストIDは納品物に含めない。
- ZIP完全性とファイル一覧を別途監査。

## 未完了事項（重要）

1. **v85全ソースをGitHubへpush**：本環境はGitHubへのGit転送を実行できない。GitHub APIから保護ブランチの作成は済んでいるが、ソース全体はZIP内にある。Windows PCのコード担当が取り込みスクリプトを実行する。
2. **Partner Centerの正式なIdentity Name、Publisher、Publisher Display Name**をリポジトリActions Variablesに設定。既存の別製品からコピーしないこと。
3. **GitHub Actions実行**：v85 push後にWindows runner上で実MSIXをビルド。v27はベータのため、失敗時にはパッケージ設定を修正し、同じブランチで再実行する。安定版v26のAppXを`.msix`へ改名してはいけない。
4. **MSIXへの署名・Windows実機でのインストール・アプリ再起動後の保存・アップデート・アンインストール・WACK**などを確認。
5. **Microsoft Store規約・年齢区分・仮想ギャンブル表現**を確認。現実の賭博・換金機能はなし。ゲーム内「後から借金」の説明が現実の債務と誤認されないかも再検証する。
6. **販売需要・収益性の検証**（価格調査、競合比較、試遊）は未完了。MSIX作成だけで収益性は証明されない。

## コード担当へ依頼する順序

1. 本ZIPを展開。READMEと`docs/WINDOWS_STORE_ACCEPTANCE.md`を読む。
2. `npm test`を実行（ログを保存）。
3. PowerShellで`./scripts/IMPORT_TO_GITHUB.ps1`を実行し、**`GITHUB_SYNC_VERIFIED=<SHA>`** を記録。
4. Actions Variablesの正式な3項目を設定。
5. GitHub Actions `LUCK LAB v85 MSIX / manual release gate` を成功させ、`.msix`と SHA256SUMS、BUILD_SOURCE を取得。
6. 実MSIX内の`AppxManifest.xml`のIdentity Name/Publisher、ローカル署名の一致、ファイル内容・GitHubのコミットIDを監査。
7. Windowsで手動7ゲーム・セーブ・更新・アンインストール・WACKを検証する。
8. 条件を満たせば販売審査へ。満たさなければHOLD継続。完了報告は証拠（コミット/Actions run ID/ファイル名/ハッシュ/Windowsログ）とセットにする。

## 絶対に守ること

- GitHubをソースの正本にする。ZIP/MSIXは**コミットSHAが一致する派生物**にする。
- 既存main、旧Alpha、過去v85 ZIPを上書きしない。
- 未確認の実MSIXが「完成」と報告されないよう、ビルド失敗は明示する。
- Partner Centerへの提出や公開は、ユーザーの確認と販売規約のチェックが終わるまで行わない。
