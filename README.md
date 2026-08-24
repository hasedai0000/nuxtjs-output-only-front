# nuxtjs-output-only-front

Nuxt.js アウトプットサンプル

Nuxt 3 のファイルベースルーティングを利用して Todo リストの基本的な機能を構築。
`backend/` に Laravel の Todo CRUD API を同梱。

## 目次

1. フロントエンド (Nuxt) 環境構築
2. バックエンド (Laravel) 環境構築
3. API 仕様
4. アプリケーションの仕様

## 1. フロントエンド (Nuxt) 環境構築

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

## 2. バックエンド (Laravel) 環境構築

### 2-1. PHP バージョン

Laravel 13 / 依存パッケージの要件により **PHP 8.3+** が必要です。
Homebrew の PHP 8.3 を利用する場合:

```
brew install php@8.3
export PATH="/opt/homebrew/opt/php@8.3/bin:$PATH"
```

MAMP 同梱の PHP 7.4 が PATH で優先される環境では、上記 export を `~/.zshrc` などに追記するか、
`backend/` 配下の作業時のみ切り替えてください。

### 2-2. 依存インストール

```
cd backend
composer install
```

### 2-3. アプリケーションキー生成 (初回のみ)

```
cp .env.example .env  # 既に .env 済み。無い場合のみ
php artisan key:generate
```

### 2-4. データベース (SQLite) 初期化

```
touch database/database.sqlite       # 既に生成済み。無い場合のみ
php artisan migrate --seed
```

### 2-5. 開発サーバー起動

```
php artisan serve --port=8000
```

## 3. API 仕様

ベース URL: `http://localhost:8000/api`

| Method | Path | 概要 |
| --- | --- | --- |
| GET | `/todos` | Todo 一覧取得。`?keyword=` で title の前方一致検索 |
| POST | `/todos` | Todo 新規作成。body: `{ title, content }` |
| GET | `/todos/{id}` | Todo 単体取得 |
| PUT/PATCH | `/todos/{id}` | Todo 更新。body: `{ title, content }` |
| DELETE | `/todos/{id}` | Todo 削除 (204 No Content) |

- バリデーションエラーは `422` + `{ message, errors }`
- 該当なしは `404` + `{ message }` (本番)
- CORS: `http://localhost:3000` からのアクセスを許可 (config/cors.php)

## 4. アプリケーションの仕様

### 4-1. 仕様

- Todoリスト
  - Todo一覧表示
  - Todo検索処理
  - Todo新規登録処理
  - Todo削除処理

### 4-2. 構成技術

#### フロントエンド

- nuxt: 3.21.11 (SPAモード / ssr: false)
- vue: 3.5.41
- @fortawesome/fontawesome-svg-core: 6.7.1
- @fortawesome/free-brands-svg-icons: 6.7.1
- @fortawesome/free-regular-svg-icons: 6.7.1
- @fortawesome/free-solid-svg-icons: 6.7.1
- @fortawesome/vue-fontawesome: 3.0.8

#### バックエンド

- laravel: 13.x
- php: 8.3+
- database: SQLite (`backend/database/database.sqlite`)
