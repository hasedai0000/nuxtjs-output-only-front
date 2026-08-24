# フロントエンド × バックエンド 連携 実装ガイド

Nuxt 3 (SPA) 側を Laravel API と連携させるための学習用ステップ集。
各ステップで **触るファイル / 変更内容 / 設計判断ポイント** を示す。コードは自分で書く前提。

## 全体像

現在の `useTodoProvider.ts` は `INIT_TODO_LIST` を初期値にした `ref` を持ち、CRUD がメモリ上で完結している。これを次のように置き換える。

- **書き込み系** (`handleAddTodo` / `handleUpdateTodo` / `handleDeleteTodo`) を **`async` + `$fetch` (Nuxt組み込み)** に変える
- **読み込み系** (`originTodoList` の初期化) を **API からの取得** に変える
- **検索** (`searchKeyword`) を Laravel の `?keyword=` に委ねるか、クライアント filter を残すかを選ぶ

## 手順

### Step 1: API ベース URL を runtimeConfig 化

**触るファイル**: `nuxt.config.ts`, `.env` (新規、任意)

- `nuxt.config.ts` に `runtimeConfig.public.apiBase` を追加
- デフォルトを `http://localhost:8000/api` に、`.env` で `NUXT_PUBLIC_API_BASE=...` で上書き可能に
- 使う側では `useRuntimeConfig().public.apiBase` で参照
- **狙い**: 環境差分を吸収し、`$fetch` のベース URL を一元管理する練習

📖 https://nuxt.com/docs/guide/going-further/runtime-config

### Step 2: 型を API レスポンスに合わせる

**触るファイル**: `src/types/todo.ts`

- Laravel は `{ id: number, title: string, content: string, created_at, updated_at }` を返す
- 既存の `TodoId = string` は数値に変える or `string | number` にする
- `created_at` / `updated_at` を型に含めるかは任意（未使用なら optional でも可）

**注意点**: この変更で `useTodoProvider.spec.ts` の `INIT_TODO_LIST` 依存が影響を受ける。テスト側も後で直す前提で。

### Step 3: `useTodoProvider` の書き換え

**触るファイル**: `src/composables/useTodoProvider.ts`

`useTodoProvider` の中身を次の構造に組み直す。

| 現状 | 変更後 |
| --- | --- |
| `ref<TodoType[]>([...INIT_TODO_LIST])` | `ref<TodoType[]>([])` に変更、初期取得は別関数で |
| なし | `fetchTodos()` を新設: `$fetch<Todo[]>('/todos', { baseURL, query: { keyword } })` |
| `handleAddTodo(title, content)` | `async` 化 → `$fetch('/todos', { method: 'POST', body })` → 成功後 `fetchTodos()` or push で楽観的更新 |
| `handleUpdateTodo(id, title, content)` | `async` 化 → `$fetch('/todos/${id}', { method: 'PUT', body })` |
| `handleDeleteTodo(id, title)` | `async` 化 → `$fetch('/todos/${id}', { method: 'DELETE' })` → 成功後 splice |
| `uniqueId` の管理 | **不要** (Laravel が採番) |

**設計判断ポイント**:
- **楽観的更新** (即座にローカル配列を書き換え、失敗したら戻す) と **再取得** (write 後に `fetchTodos()`) のどちらにするか
- エラー時の扱い (`try/catch`、`alert` / 別途エラー state)

📖 https://nuxt.com/docs/api/utils/dollarfetch

### Step 4: 検索を server-side に寄せる (任意)

現状は `showTodoList` computed でクライアント filter している。以下から選択：

- **A. クライアント filter を維持**: `useTodoProvider` の `computed` はそのまま、`fetchTodos()` はキーワード無しで全件
- **B. サーバー filter に寄せる**: `searchKeyword` を `watch` して、変わるたび `fetchTodos(keyword)` を呼ぶ。`showTodoList` の computed を廃止し、`originTodoList` = 現在の絞り込み結果に

Laravel の `TodoController@index` は `?keyword=` を既に受けるので、B にすると学習範囲が広がる (`watch` + debounce, キャンセル、ローディング表示など)。

### Step 5: 初期取得のタイミング

**触るファイル**: `src/providers/TodoProvider.vue`

`useTodoProvider()` を呼んだ後に、初期一覧取得を仕込む。

- SPA (`ssr: false`) なので `onMounted(() => fetchTodos())` で十分
- SSR/SSGなら `useAsyncData` を使うが今回は不要

### Step 6: Templates 側の `async` 対応

**触るファイル**: `src/components/Templates/TodoCreateTemplate.vue`, `TodoEditTemplate.vue`

`handleAddTodo` / `handleUpdateTodo` が Promise を返すようになるので:

- `handleSubmitAddTodo` を `async` にし、`await handleAddTodo(...)` してから `router.push` (現状の即遷移だと保存前に画面が変わる)
- 失敗時は `router.push` を実行しない

### Step 7: 削除ダイアログ位置の検討 (任意)

現状 `handleDeleteTodo` 内部で `window.confirm` しているが、composable が UI (confirm) を持つのは責務混在。

- 移動先候補: `TodoList.vue` の `handleDelete` で confirm → OK なら `handleDeleteTodo` を呼ぶ
- composable は「純粋にAPIを叩く」役割に寄せる

### Step 8: テストの修正

**触るファイル**: `src/composables/useTodoProvider.spec.ts`

- `$fetch` は Nuxt のグローバルなので、`vi.stubGlobal('$fetch', vi.fn())` などでモック
- 各テストで `mockResolvedValueOnce(...)` を仕込んで `handleAddTodo` 等の async 呼び出しをテスト
- あるいは `@nuxt/test-utils` を導入して統合テストにする方針も

### Step 9: 動作確認

1. `backend/` で `php artisan serve --port=8000`
2. `.env` に `NUXT_PUBLIC_API_BASE=http://localhost:8000/api` (or デフォルト任せ)
3. `npm run dev`
4. ブラウザで `http://localhost:3000/`
   - 初期表示で Todo1/Todo2 が Laravel から取得できているか (Network タブで確認)
   - 新規作成 → 一覧に反映される
   - 削除 → 一覧から消える
   - リロードしても状態が Laravel の DB と同期している

## つまずきやすいポイント

- **CORS**: 既に `config/cors.php` で `http://localhost:3000` 許可済み。origin が違うと Network タブで CORS エラーが出るので、その場合は cors.php を確認
- **`$fetch` の baseURL**: 相対パスで書くと Nuxt SPA では現在のオリジンに投げてしまう。`baseURL` を必ず渡す or `useRuntimeConfig` で組み立てる
- **Reactivity**: `$fetch` の結果を `originTodoList.value = [...res]` のように新しい配列で置き換えないと参照が維持されず computed が反応しない場合あり
- **並行修正**: 楽観的更新にすると失敗時のロールバックが必要。学習用なら最初は「再取得方式」の方がシンプル
- **Laravel 側の validation エラー (422)**: `$fetch` は 4xx で throw する。`catch` して `error.data.errors` を参照

## 進めるオススメ順

1. Step 1, 2, 5 → 「まず GET /todos の結果が画面に出る」ところまで
2. Step 3 の POST → 「新規作成が保存され、リロードでも残る」まで
3. Step 3 の DELETE, PUT
4. Step 6 の Templates async 対応
5. Step 4, 7, 8 は余裕があれば
