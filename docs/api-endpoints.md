# API エンドポイント一覧

Laravel バックエンド (`backend/`) が提供する Todo API の仕様。

- **ベース URL**: `http://localhost:8000/api`
- **認証**: なし
- **Content-Type**: `application/json`
- **Accept**: `application/json` (省略時 HTML エラーページが返り得るため付与推奨)
- **CORS**: `http://localhost:3000` からのアクセスを許可 (`backend/config/cors.php`)

## エンドポイント

| # | Method | Path | 概要 | 成功時ステータス |
| --- | --- | --- | --- | --- |
| 1 | GET | `/todos` | Todo 一覧取得 | `200 OK` |
| 2 | POST | `/todos` | Todo 新規作成 | `201 Created` |
| 3 | GET | `/todos/{id}` | Todo 単体取得 | `200 OK` |
| 4 | PUT / PATCH | `/todos/{id}` | Todo 更新 | `200 OK` |
| 5 | DELETE | `/todos/{id}` | Todo 削除 | `204 No Content` |

## Todo リソース

```ts
type TodoType = {
  id: number
  title: string
  content: string
  created_at?: string  // ISO 8601 (例: "2026-08-23T23:41:59.000000Z")
  updated_at?: string
}
```

## 1. GET `/todos` — 一覧取得

### クエリパラメータ

| 名前 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `keyword` | string | 任意 | `title` の **前方一致** 検索 (Laravel: `where('title', 'like', $keyword.'%')`) |

### リクエスト例

```
GET /api/todos
GET /api/todos?keyword=買
```

### レスポンス例 (200)

```json
[
  {
    "id": 1,
    "title": "Todo1",
    "content": "Todo1の内容",
    "created_at": "2026-08-23T23:41:59.000000Z",
    "updated_at": "2026-08-23T23:41:59.000000Z"
  },
  {
    "id": 2,
    "title": "Todo2",
    "content": "Todo2の内容",
    "created_at": "2026-08-23T23:41:59.000000Z",
    "updated_at": "2026-08-23T23:41:59.000000Z"
  }
]
```

## 2. POST `/todos` — 新規作成

### リクエストボディ

| フィールド | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| `title` | string | ✓ | 1〜255 文字 |
| `content` | string | ✓ | 1 文字以上 |

### リクエスト例

```json
POST /api/todos
Content-Type: application/json

{
  "title": "買い物",
  "content": "牛乳・卵・パン"
}
```

### レスポンス例 (201)

```json
{
  "id": 4,
  "title": "買い物",
  "content": "牛乳・卵・パン",
  "created_at": "2026-08-23T23:42:44.000000Z",
  "updated_at": "2026-08-23T23:42:44.000000Z"
}
```

## 3. GET `/todos/{id}` — 単体取得

### パスパラメータ

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `id` | number | Todo の ID |

### レスポンス例 (200)

```json
{
  "id": 4,
  "title": "買い物リスト",
  "content": "牛乳・卵・パン・チーズ",
  "created_at": "2026-08-23T23:42:44.000000Z",
  "updated_at": "2026-08-23T23:43:24.000000Z"
}
```

## 4. PUT / PATCH `/todos/{id}` — 更新

### リクエストボディ

POST と同じ (`title`, `content` 両方必須)。

### リクエスト例

```json
PUT /api/todos/4
Content-Type: application/json

{
  "title": "買い物リスト",
  "content": "牛乳・卵・パン・チーズ"
}
```

### レスポンス例 (200)

```json
{
  "id": 4,
  "title": "買い物リスト",
  "content": "牛乳・卵・パン・チーズ",
  "created_at": "2026-08-23T23:42:44.000000Z",
  "updated_at": "2026-08-23T23:43:24.000000Z"
}
```

## 5. DELETE `/todos/{id}` — 削除

### リクエスト例

```
DELETE /api/todos/4
```

### レスポンス

`204 No Content` (body なし)

## エラーレスポンス

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

### 404 Not Found (該当なし)

本番 (`APP_DEBUG=false`):

```json
{
  "message": "No query results for model [App\\Models\\Todo] 9999"
}
```

開発 (`APP_DEBUG=true`) では上記に加えて `exception` / `file` / `trace` フィールドが返る。

## CORS プリフライト例

```
OPTIONS /api/todos
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type,Accept
```

レスポンス:

```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type,Accept
```

## Nuxt 側での呼び出し例 (axios)

```ts
import { globalAxios } from '@/apis/config'
import type { TodoType } from '@/types/todo'

// 一覧
const todos = (await globalAxios.get<TodoType[]>('/todos')).data

// 検索
const hits = (await globalAxios.get<TodoType[]>('/todos', {
  params: { keyword: '買' }
})).data

// 作成
const created = (await globalAxios.post<TodoType>('/todos', {
  title: '買い物',
  content: '牛乳・卵・パン'
})).data

// 更新
const updated = (await globalAxios.put<TodoType>(`/todos/${id}`, {
  title: '買い物リスト',
  content: '牛乳・卵・パン・チーズ'
})).data

// 削除
await globalAxios.delete(`/todos/${id}`)
```

`baseURL` は `useRuntimeConfig().public.apiBase` = `http://localhost:8000/api` を参照するため、パスは `/todos` から始める (`/api` は不要)。
