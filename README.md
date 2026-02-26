# もじれんしゅう 📝

幼児向けの数字・ひらがな・カタカナ練習アプリです。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 にアクセスしてください。

## デプロイ方法

### Vercel（おすすめ・最速）

1. このフォルダを GitHub にプッシュ
2. [vercel.com](https://vercel.com) にログインして「Import Project」
3. リポジトリを選択 → デフォルト設定のまま「Deploy」
4. 完了！ URL が自動発行されます

### GitHub Pages

1. `vite.config.js` の `base` をコメントアウト解除し、リポジトリ名を設定：
   ```js
   base: '/moji-renshu/',
   ```
2. ビルド：
   ```bash
   npm run build
   ```
3. `dist` フォルダの中身を `gh-pages` ブランチにプッシュ、
   または GitHub Actions で自動デプロイ設定

### Netlify

1. [netlify.com](https://netlify.com) にログイン
2. 「Add new site」→「Import an existing project」
3. GitHub リポジトリを選択
4. Build command: `npm run build` / Publish directory: `dist`
5. 「Deploy」

## スマホでアプリっぽく使う

公開 URL をスマホで開き、「ホーム画面に追加」するとアプリのように使えます。
