# 💒 YUKI & KOTA Wedding - 音声受付システム

**結婚式・披露宴での出席確認を音声入力で効率化するWebアプリケーション**

![Wedding App](https://img.shields.io/badge/Wedding-Reception%20App-pink)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

## 📱 デモ・使用方法

### 🎤 **音声受付の流れ**
1. **赤い丸ボタンをタップ** → 音声入力開始
2. **ゲストの名前をはっきりと発話** （例：「田中太郎」）
3. **自動マッチング** → 該当ゲストを検索
4. **受付完了** → 「田中太郎さん来てくれてありがとう！」表示

### 📋 **管理画面**
- **出席済み**: 受付完了したゲスト（新しい順）
- **未到着**: まだ受付していないゲスト
- **手動操作**: 音声認識できない場合の手動受付・取消

## ✨ 主な機能

| 機能 | 説明 | 特徴 |
|------|------|------|
| 🎤 **音声入力受付** | 名前を音声で入力して自動受付 | 高精度日本語認識 |
| 🔍 **インテリジェント検索** | ひらがな・カタカナ・漢字の自動変換 | 「たなかたろう」→「田中太郎」 |
| ⚡ **リアルタイム更新** | 受付状況の即座反映 | 複数デバイス対応 |
| 📱 **レスポンシブUI** | PC・タブレット・スマホ完全対応 | モダンな白黒デザイン |
| 🔧 **手動管理** | 音声認識失敗時の手動受付・取消 | バックアップ機能 |

## 🎯 音声認識の精度

### ✅ **認識成功例**
```
音声入力: "田中太郎" → ✅ 受付成功
音声入力: "たなかたろう" → ✅ 受付成功
音声入力: "タナカタロウ" → ✅ 受付成功
```

### ❌ **認識失敗例**
```
音声入力: "田中" → ❌ 部分一致で拒否
音声入力: "田中太朗" → ❌ 漢字違いで拒否
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

## 🛠️ 技術スタック

### **フロントエンド**
- **React 18** - UIライブラリ
- **TypeScript 5** - 型安全性
- **Vite 5** - 高速開発・ビルドツール

### **音声処理**
- **Web Speech API** - ブラウザ標準音声認識
- **カスタムマッチングアルゴリズム** - 日本語名前検索

### **スタイリング**
- **CSS3** - モダンレスポンシブデザイン
- **Flexbox + Grid** - レイアウト
- **モノクロ + アクセントカラー** - 洗練されたUI

## 🌐 対応ブラウザ

| ブラウザ | 音声認識 | レスポンシブ | 推奨度 |
|----------|----------|--------------|--------|
| Chrome | ✅ 完全対応 | ✅ | ⭐⭐⭐ |
| Safari | ✅ 対応 | ✅ | ⭐⭐ |
| Edge | ✅ 対応 | ✅ | ⭐⭐ |
| Firefox | ⚠️ 制限あり | ✅ | ⭐ |

## 📊 ゲストデータ

### **初期設定（20名）**
```typescript
田中太郎、佐藤花子、鈴木一郎、高橋美智子、伊藤健太...
```

### **カスタマイズ方法**
1. `src/data/guests.ts` を編集
2. ゲスト名を追加・変更
3. アプリを再起動

## 🔧 カスタマイズ

### **色テーマ変更**
```css
/* src/App.css */
.voice-button {
  background: #your-color;
}
```

### **マッチング精度調整**
```typescript
// src/utils/nameMatching.ts
if (similarity >= 0.9) { // 閾値変更
  // 受付成功
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

## 👥 作成者

- **開発**: Claude Code + ユーザー共同開発
- **デザイン**: モダンミニマリストUI
- **音声処理**: 高精度日本語マッチングアルゴリズム

---

🎊 **素敵な結婚式をお祝いします！** 🎊