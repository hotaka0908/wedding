# 💒 YUKI & KOTA Wedding - 音声受付システム

**結婚式・披露宴での出席確認を音声入力で効率化するWebアプリケーション**

![Wedding App](https://img.shields.io/badge/Wedding-Reception%20App-pink)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Web Audio](https://img.shields.io/badge/Web%20Audio%20API-Sound%20Effects-orange)

## 📱 デモ・使用方法

### 🎤 **音声受付の流れ**
1. **ウェルカム画面をタップ** → アプリを起動
2. **音声入力ボタンをタップ** → タップ音とともに録音開始
3. **ゲストの名前をはっきりと発話** （例：「田中太郎」）
4. **自動マッチング** → 該当ゲストを検索
5. **受付完了** → 成功音とともに「田中太郎さん来てくれてありがとう！」表示

### 📋 **管理画面**
- **出席済み**: 受付完了したゲスト（新しい順、性別による色分け表示）
- **未到着**: まだ受付していないゲスト
- **手動操作**: 音声認識できない場合の手動受付・取消
- **視覚的フィードバック**: 男性は青色、女性は赤色の境界線で区別

## ✨ 主な機能

| 機能 | 説明 | 特徴 |
|------|------|------|
| 🎤 **音声入力受付** | 名前を音声で入力して自動受付 | 高精度日本語認識 |
| 🔊 **音響フィードバック** | タップ音・成功音・エラー音の効果音 | Web Audio API使用 |
| 🔍 **インテリジェント検索** | ひらがな・カタカナ・漢字の自動変換 | 「たなかたろう」→「田中太郎」 |
| 🎨 **性別視覚化** | 男性は青色、女性は赤色で区別表示 | 直感的な色分け |
| ⚡ **リアルタイム更新** | 受付状況の即座反映 | 複数デバイス対応 |
| 📱 **レスポンシブUI** | PC・タブレット・スマホ完全対応 | Figma風モダンデザイン |
| 🔧 **手動管理** | 音声認識失敗時の手動受付・取消 | バックアップ機能 |

## 🎯 音声認識の精度

### ✅ **認識成功例**
```
音声入力: "田中太郎" → ✅ 成功音 + 受付成功
音声入力: "たなかたろう" → ✅ 成功音 + 受付成功（完全一致扱い）
音声入力: "タナカタロウ" → ✅ 成功音 + 受付成功（完全一致扱い）
```

### ❌ **認識失敗例**
```
音声入力: "田中" → ❌ エラー音 + 部分一致で拒否
音声入力: "田中太朗" → ❌ エラー音 + 漢字違いで拒否
音声入力: 無音/短すぎる → ❌ エラー音 + 再試行要求
```

## 🚀 セットアップ・起動

### **必要な環境**
- Node.js 18以上
- npm または yarn
- モダンブラウザ（Chrome推奨）

### **インストール**
```bash
# リポジトリをクローン
git clone https://github.com/hotaka0908/wedding.git
cd wedding

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### **本番ビルド**
```bash
# プロダクション用ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### **テスト**
```bash
# Vitest を使用したユニット / コンポーネントテスト
npm run test

# カバレッジレポートを CLI と HTML で生成（coverage/ 以下）
npm run test -- --coverage
```

主なテスト内容:
- `App` の音声受付フロー（成功・失敗時の効果音挙動をモックで検証）
- `GuestList` の出席者リスト表示と手動トグル操作
- `useVoiceRecognition` フックの開始/停止・結果更新ロジック
- `nameMatching`/`audioUtils` などのユーティリティ

## 🛠️ 技術スタック

### **フロントエンド**
- **React 18** - UIライブラリ
- **TypeScript 5** - 型安全性
- **Vite 5** - 高速開発・ビルドツール

### **音声処理**
- **Web Speech API** - ブラウザ標準音声認識
- **Web Audio API** - リアルタイム効果音生成
- **カスタムマッチングアルゴリズム** - 日本語名前検索（ひらがな完全一致）

### **スタイリング**
- **CSS3** - モダンレスポンシブデザイン（Figma風）
- **デザイントークン** - 統一されたカラーパレット・タイポグラフィ
- **Flexbox + Grid** - レイアウト
- **性別視覚化** - 男性青・女性赤の色分けシステム

## 🌐 対応ブラウザ

| ブラウザ | 音声認識 | 効果音 | レスポンシブ | 推奨度 |
|----------|----------|--------|--------------|--------|
| Chrome | ✅ 完全対応 | ✅ 完全対応 | ✅ | ⭐⭐⭐ |
| Safari | ✅ 対応 | ✅ 対応 | ✅ | ⭐⭐⭐ |
| Edge | ✅ 対応 | ✅ 対応 | ✅ | ⭐⭐ |
| Firefox | ⚠️ 制限あり | ✅ 対応 | ✅ | ⭐ |

## 📊 ゲストデータ

### **初期設定（20名）**
```typescript
// 男性ゲスト（青色表示）
田中太郎、鈴木一郎、伊藤健太、山田大輔、中村拓也...

// 女性ゲスト（赤色表示）
佐藤花子、高橋美智子、吉田あかり、加藤由美、小林さくら...
```

### **カスタマイズ方法**
1. `src/data/guests.ts` を編集
2. ゲスト名・性別を追加・変更
3. アプリを再起動（性別による色分け自動適用）

## 🔧 カスタマイズ

### **色テーマ変更**
```css
/* src/App.css - デザイントークン */
:root {
  --color-primary: #your-primary-color;
  --color-info: #your-male-color; /* 男性用 */
  --color-danger: #your-female-color; /* 女性用 */
}
```

### **効果音カスタマイズ**
```typescript
// src/utils/audioUtils.ts
// 成功音の周波数変更（C5+E5 → 任意の和音）
oscillator1.frequency.setValueAtTime(523.25, context.currentTime); // C5
oscillator2.frequency.setValueAtTime(659.25, context.currentTime); // E5
```

### **マッチング精度調整**
```typescript
// src/utils/nameMatching.ts
// ひらがな一致は完全一致扱い（1.0）
if (hiragana1 === hiragana2) {
  return 1.0; // 完全一致
}
```

## 🚀 デプロイ

### **Vercel（推奨）**
1. GitHub連携でVercelにインポート
2. 自動ビルド・デプロイ設定
3. カスタムドメイン設定

### **その他のプラットフォーム**
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 コントリビューション

1. **Fork** このリポジトリ
2. **Feature branch** を作成 (`git checkout -b feature/amazing-feature`)
3. **Commit** 変更内容 (`git commit -m 'Add amazing feature'`)
4. **Push** ブランチ (`git push origin feature/amazing-feature`)
5. **Pull Request** を作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🎵 効果音仕様

### **Web Audio API による音響システム**

| 効果音 | 説明 | 音響特性 |
|--------|------|----------|
| **タップ音** | ボタンタップ時 | A4 (440Hz) サイン波、0.1秒 |
| **成功音** | 受付成功時 | C5+E5 (523.25+659.25Hz) 和音、0.3秒 |
| **エラー音** | 認識失敗時 | F3+F#3 (174.61+185.00Hz) 不協和音、0.4秒 |

### **技術的特徴**
- ユーザーの初回操作後にAudioContext初期化（ブラウザポリシー準拠）
- リアルタイム音響合成（外部ファイル不要）
- クロスプラットフォーム対応

## 👥 作成者

- **開発**: Claude Code + ユーザー共同開発
- **デザイン**: Figma風モダンUI + デザインシステム
- **音声処理**: 高精度日本語マッチングアルゴリズム + Web Audio API
- **UX設計**: 直感的な音響フィードバック + 視覚的性別区分

---

🎊 **素敵な結婚式をお祝いします！** 🎊
