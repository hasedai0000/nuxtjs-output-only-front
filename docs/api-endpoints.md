# API エンドポイント一覧

Laravel バックエンド (`backend/`) が提供する Todo / 認証 API の仕様。

- **ベース URL**: `http://localhost:8000/api`
- **認証**: Laravel Sanctum (SPA / Cookie ベース)
- **Content-Type**: `application/json`
- **Accept**: `application/json` (省略時 HTML エラーページが返り得るため付与推奨)
- **CORS**: `http://localhost:3000` からのアクセスを許可 (`backend/config/cors.php`, `supports_credentials: true`)

## 認証フロー (Sanctum SPA)

Nuxt (`localhost:3000`) と Laravel (`localhost:8000`) は **同じ親ドメイン (`localhost`)** を共有しているため、以下の手順でクッキー認証が成立する。

1. `GET /sanctum/csrf-cookie` — レスポンスの `Set-Cookie` に `XSRF-TOKEN` と `laravel-session` が発行される。
2. 以降の **状態変更リクエスト (POST/PUT/PATCH/DELETE)** では、
   - Cookie を送る (axios なら `withCredentials: true`)
   - Cookie の `XSRF-TOKEN` を URL デコードして `X-XSRF-TOKEN` ヘッダに載せる
3. `POST /api/login` (もしくは `POST /api/register`) でセッション確立。以降は `auth:sanctum` 配下のエンドポイントにアクセス可能。
4. `POST /api/logout` でセッション破棄。

### `.env` 側の要点

```
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost,127.0.0.1:3000,127.0.0.1
```

`SESSION_DOMAIN=localhost` の Cookie は `127.0.0.1` からのアクセスでは有効化されない。フロント/バック共に `localhost` のホスト名で通信すること。

## エンドポイント一覧

| # | Method | Path | 概要 | 認証 | 成功時ステータス |
| --- | --- | --- | --- | --- | --- |
| A1 | GET | `/sanctum/csrf-cookie` | CSRF Cookie 発行 | 不要 | `204 No Content` |
| A2 | POST | `/api/register` | ユーザー登録 (+ 自動ログイン) | 不要 | `201 Created` |
| A3 | POST | `/api/login` | ログイン | 不要 | `200 OK` |
| A4 | POST | `/api/logout` | ログアウト | 必要 | `204 No Content` |
| A5 | GET | `/api/me` | ログイン中ユーザー取得 | 必要 | `200 OK` |
| 1 | GET | `/api/todos` | Todo 一覧取得 (自ユーザー分のみ) | 必要 | `200 OK` |
| 2 | POST | `/api/todos` | Todo 新規作成 | 必要 | `201 Created` |
| 3 | GET | `/api/todos/{id}` | Todo 単体取得 | 必要 | `200 OK` |
| 4 | PUT / PATCH | `/api/todos/{id}` | Todo 更新 | 必要 | `200 OK` |
| 5 | DELETE | `/api/todos/{id}` | Todo 削除 | 必要 | `204 No Content` |

## 型定義

```ts
type UserType = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

type TodoType = {
  id: number
  user_id: number
  title: string
  content: string
  created_at?: string
  updated_at?: string
}
```

## 認証エンドポイント

### A2. POST `/api/register` — ユーザー登録

#### リクエストボディ

| フィールド | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| `name` | string | ✓ | 1〜255 文字 |
| `email` | string | ✓ | メール形式 / `users.email` でユニーク |
| `password` | string | ✓ | 8 文字以上 / `password_confirmation` と一致 |
| `password_confirmation` | string | ✓ | `password` と同じ値 |

登録成功時はサーバー側で自動的にセッションを確立する (`Auth::login` + `session()->regenerate()`)。

#### リクエスト例

```json
POST /api/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password12",
  "password_confirmation": "password12"
}
```

#### レスポンス例 (201)

```json
{
  "id": 2,
  "name": "Alice",
  "email": "alice@example.com",
  "email_verified_at": null,
  "created_at": "2026-08-25T07:07:56.000000Z",
  "updated_at": "2026-08-25T07:07:56.000000Z"
}
```

### A3. POST `/api/login` — ログイン

#### リクエストボディ

| フィールド | 型 | 必須 |
| --- | --- | --- |
| `email` | string | ✓ |
| `password` | string | ✓ |
| `remember` | boolean | 任意 (デフォルト `false`) |

#### レスポンス例 (200)

```json
{
  "id": 1,
  "name": "Demo User",
  "email": "demo@example.com",
  "email_verified_at": null,
  "created_at": "2026-08-25T06:18:08.000000Z",
  "updated_at": "2026-08-25T06:18:08.000000Z"
}
```

#### 失敗レスポンス (422)

```json
{
  "message": "These credentials do not match our records.",
  "errors": {
    "email": ["These credentials do not match our records."]
  }
}
```

### A4. POST `/api/logout` — ログアウト

- 認証: 必要
- レスポンス: `204 No Content`

### A5. GET `/api/me` — ログイン中ユーザー取得

- 認証: 必要
- レスポンス: `UserType`

## Todo エンドポイント (すべて `auth:sanctum` 保護)

未ログイン時は全て `401 Unauthenticated` を返す。
他ユーザーの Todo に対する `show`/`update`/`destroy` は情報漏洩防止のため `404 Not Found` を返す (403 ではない)。

### 1. GET `/api/todos` — 一覧取得

自分の Todo のみを返す (`user_id = auth()->id()`)。

#### クエリパラメータ

| 名前 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `keyword` | string | 任意 | `title` の **前方一致** 検索 |

#### レスポンス例 (200)

```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "牛乳を買う",
    "content": "低脂肪 1L",
    "created_at": "2026-08-25T06:18:08.000000Z",
    "updated_at": "2026-08-25T06:18:08.000000Z"
  }
]
```

### 2. POST `/api/todos` — 新規作成

`user_id` はログインユーザーで自動セットされる (リクエストボディに含めても無視)。

| フィールド | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| `title` | string | ✓ | 1〜255 文字 |
| `content` | string | ✓ | 1 文字以上 |

### 3. GET `/api/todos/{id}` — 単体取得

自分の Todo の場合のみ 200 を返し、他人の Todo は 404。

### 4. PUT / PATCH `/api/todos/{id}` — 更新

ボディは `store` と同じ (`title`, `content` 両方必須)。他人の Todo は 404。

### 5. DELETE `/api/todos/{id}` — 削除

`204 No Content`。他人の Todo は 404。

## エラーレスポンス

### 401 Unauthenticated (未ログイン)

```json
{ "message": "Unauthenticated." }
```

### 419 CSRF token mismatch

`X-XSRF-TOKEN` ヘッダまたは Cookie の `XSRF-TOKEN` が無い/一致しない/期限切れ。
再度 `GET /sanctum/csrf-cookie` を叩いてやり直す。

### 422 Unprocessable Entity (バリデーションエラー)

```json
{
  "message": "The title field is required. (and 1 more error)",
  "errors": {
    "title": ["The title field is required."],
    "content": ["The content field is required."]
  }
}
```

### 404 Not Found

該当リソースが存在しない場合、および他ユーザーの Todo にアクセスした場合。

## Nuxt 側での呼び出し例 (axios)

axios インスタンスは以下の設定が必要:

```ts
import axios from 'axios'

export const globalAxios = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,            // Cookie を必ず送る
  withXSRFToken: true,              // XSRF-TOKEN を X-XSRF-TOKEN に自動付与 (axios >= 1.5)
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})
```

`withXSRFToken` に対応しない古い axios の場合は、`GET /sanctum/csrf-cookie` の後に Cookie から `XSRF-TOKEN` を取り出し、URL デコードした値を `X-XSRF-TOKEN` ヘッダに手動で付与する。

```ts
// 1. CSRF Cookie を取得 (baseURL の外なので絶対URL)
await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

// 2. ログイン
const user = (await globalAxios.post<UserType>('/login', {
  email: 'demo@example.com',
  password: 'password',
})).data

// 3. 認証必須 API を叩く
const me = (await globalAxios.get<UserType>('/me')).data
const todos = (await globalAxios.get<TodoType[]>('/todos')).data

// 4. 作成 / 更新 / 削除
const created = (await globalAxios.post<TodoType>('/todos', {
  title: '買い物',
  content: '牛乳・卵・パン',
})).data
await globalAxios.put(`/todos/${created.id}`, { title: '買い物リスト', content: '追加' })
await globalAxios.delete(`/todos/${created.id}`)

// 5. ログアウト
await globalAxios.post('/logout')
```

## 動作確認用シードデータ

`php artisan migrate:fresh --seed` で以下のユーザー / Todo が投入される。

| email | password | 備考 |
| --- | --- | --- |
| `demo@example.com` | `password` | サンプル Todo 8 件付き |
