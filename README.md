# nuxtjs-output-only-front

Nuxt.js アウトプットサンプル

Nuxt 3 のファイルベースルーティングを利用して Todo リストの基本的な機能を構築

## 目次

1. 環境構築
2. アプリケーションの仕様

## 1. 環境構築

### 1-1. Node.js バージョン

Nuxt 3.21 / oxc-parser の要件により **Node.js `^20.19.0 || >=22.12.0`** が必要です。

```
nodebrew install v22.12.0
nodebrew use v22.12.0
```

### 1-2. ライブラリ インストール

```
npm install
```

### 1-3. アプリケーション実行

```
npm run dev
```

### 1-4. 静的サイト生成 (SSG)

```
npm run generate
```

### 1-5. テスト

```
npm run test
```

## 2. アプリケーションの仕様

### 2-1. 仕様

- Todoリスト
  - Todo一覧表示
  - Todo検索処理
  - Todo新規登録処理
  - Todo削除処理

### 2-2. 構成技術

- nuxt: 3.15.0 (SPAモード / ssr: false)
- vue: 3.5.13
- @fortawesome/fontawesome-svg-core: 6.7.1
- @fortawesome/free-brands-svg-icons: 6.7.1
- @fortawesome/free-regular-svg-icons: 6.7.1
- @fortawesome/free-solid-svg-icons: 6.7.1
- @fortawesome/vue-fontawesome: 3.0.8
