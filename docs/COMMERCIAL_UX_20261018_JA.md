# LUCK LAB — 商用原本整合性とUI・遊びやすさの改善計画

状態：**v85の原本照合はまだ不一致。販売HOLD**。

重要：過去のGitHub Actionsの `scripts/check-package.cjs` は `casino-core.js` がマニフェストの期待値と異なり停止。期待SHA256 `ffc0dd862af5807a5cf4a8da1908e1ae6567e4caf480ae3d720ea7e90615d762` と取得実物 `9f24db2cf2ca42f066a22d94569112b0dc7b7d6fce2addf36babb02abd9a8ff5`。期待値を適当に変更しない。

- 読み取り専用の `npm run audit:integrity` でソースごとのMATCH/MISMATCH/MISSING、期待値・実測値を出す。元コード・SHAマニフェストを変更しない。
- `npm run test:integrity-helper` で検査ツール自体の正常・異常・欠落・不正パスを試験する。
- ハッシュ不一致の元ZIPとGitHubにある履歴を照合し、信頼できる正本を判定してから修復する。
- 正本が確定するまでハッシュ管理の対象HTML/JS/CSSのUI改造は進めない（新修正で原因を隠さないため）。
- 正本確定後のUI改善：7ゲームの入口を選びやすく、ルール・必要チップ・勝敗の結果・プレイ目的を短く表示。研究・確率詳細の表示は折りたたむ。ストーリーと遊技を結びつけ、周回目的を伝える。
- 保存移行、低残高・債務、確率・返済の台帳、長時間プレイ、7ゲーム総回帰と仮想ギャンブルの年齢区分・Store販売規約を検証する。

正式MSIX・WACK・Windowsインストール/更新/削除、素材権利と販売ページの確認も未完了。単なるZIPやWindows EXEをMSIX合格と呼ばない。