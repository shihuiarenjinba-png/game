# LUCK LAB v85 — 原本検証とStore規約対応（2026-10-18）

## 原本の出所について確認できたこと
- `casino-core.js` のGitHubにある現状ファイルのblob SHA: `4599f05d4955f354513331399700aabcbab6b0b8`。
- `release/luck-lab-v85-msix-20261015` と今回のfeatureブランチでblob SHAは同一。
- Releaseブランチの`casino-core.js`のコミット履歴は `f90df474e8a8b411a4f3c4c8d028fb3d726f8c02`（2026-10-15、v85初期移植）1件のみ確認。**この取得範囲では以後に編集された証拠がない。**
- `scripts/v85-source-sha256.json` に記録された期待SHA256は `ffc0dd862af5807a5cf4a8da1908e1ae6567e4caf480ae3d720ea7e90615d762`。
- 過去のパッケージ監査で取得された実測値は `9f24db2cf2ca42f066a22d94569112b0dc7b7d6fce2addf36babb02abd9a8ff5`。**今回はGitHubのバイト列を再ハッシュした結果ではないため、コード担当が実際に検査し直すこと。**

### 作業済み
読み取り専用 `npm run audit:origin` を追加。Git履歴中の同名ファイルと期待SHA256を比較し、正本が見つかったか機械的に確認する。結果が一致しなければ終了コード1。ファイル・ロック済みハッシュ・旧配布物には何も書き込まない。

**判定：SOURCE INTEGRITY HOLD。** 最初のリポジトリ取り込みの時点で差異が存在した可能性があるが、現状だけで断定しない。初期の独立ZIP/Windowsローカルソースと期待SHA256を突き合わせ、信頼できる原本を確定するまで暗黙のハッシュ更新・マニフェスト無効化をしない。

## Microsoft Store規約上の重点確認
2026-10-18時点ではMicrosoft Storeポリシーv7.19（2025-10-14発効）を基準とし、2026-10-22発効予定のv7.20にも先回りして適合性を確認する。

- ゲームは**現金や価値のある賞品への交換、銀行口座への出金、金品取引、実世界の賭博行為**を絶対に持たない。
- 仮想クレジットは買い切りゲーム内の表示単位として閉じ、リアルマネーと交換・外部市場で売買できない。
- 実際のゲーム内容と広告・販売商品ページが一致し、「勝てば稼げる」などの実金銭を連想させる販売表現を避ける。
- 現在の各種スロット・カード・ルーレット類のルール、ギャンブル模擬表現、仮想クレジットの有無をIARC年齢評価アンケートに誠実に申告。年齢区分を事前に恣意的に固定しない。
- 年齢評価・販売国別の法令・実際の利用可能プラットフォーム、使用素材・サウンドの権利を確認。
- Microsoft Storeのゲームとして提出し、もし実世界の換金可能性が生じれば別の厳格な規制が適用されるため、ビジネスモデルは現状の非換金・オフライン・買い切りを維持する。

政策参考：
- 2026-10-18時点のv7.19: https://learn.microsoft.com/ja-jp/windows/apps/publish/store-policies-and-code-of-conduct
- 2026-10-22発効予定のv7.20: https://learn.microsoft.com/en-us/windows/apps/publish/store-policies

## コード担当の次の実行コマンド
1. `git clone --branch feature/lucklab-forensic-compliance-20261018 https://github.com/shihuiarenjinba-png/game.git` （新しい作業フォルダへ）
2. `node --version` → `npm run audit:integrity` → `npm run audit:origin` → `npm run test:integrity-helper`
3. 記録した元ZIPを別の保管フォルダで読み取り専用検証。SHAの正本の根拠が揃ったときだけ別ブランチの修復を提案。
4. 初期ソースを改変せず、仮想クレジットの非換金性・出金API・オンライン購入・地域制限・IARC該当項目をすべて検証する。
5. 書面で証拠を返却：最終SHA、対象ファイルの期待/実測SHA256、正本と分かるアーカイブの出所、変更差分、WACK/Windows実機未完了項目。

**原本が確定するまでMSIXを販売審査に提出しない。**
