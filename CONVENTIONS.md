# コーディング規約 - Saisoku-AI (Next.js Native Edition)

## 1. コンポーネント設計原則
### 1.1 RSC-First ＆ ドーナツ構成の徹底
- **Next.js の本質を活かす**: 原則として全てのコンポーネントを RSC (Server Components) として作成し、ブラウザへ送る JavaScript 量を最小化する。
- **ドーナツ構成の採用**: 
  - インタラクション（状態管理、イベント）が必要な「中間層」のみを Client Component とする。
  - その Client Component 内で静的なコンテンツを表示する場合は、`children` プロパティ経由で Server Component を流し込む「ドーナツ型」を標準パターンとする。
  - これにより、アプリの深い階層まで RSC のメリット（データ取得、セキュリティ）を維持する。

### 1.2 クライアント境界の設計
- `use client` を宣言するのは、`useState`, `useEffect` が真に必要な「末端（Leaf）」または「ドーナツの殻」だけにする。
- コンポーネントが肥大化し、RSC と Client の境界が複雑になりすぎる場合にのみ、可読性と保守性を優先して境界を引き直す。

## 2. データ取得・更新
### 2.1 データ取得 (Read)
- **Service Pattern**: `fetch` を直接呼び出すロジックは `service.ts` に集約し、RSC から呼び出す。
- **Request Deduping**: 同一リクエスト内での重複フェッチは Next.js に任せる。

### 2.2 データ更新 (Write)
- **Server Actions**: 全てのデータ更新は Server Action を通じて行う。
- **Progressive Enhancement**: `form` の `action` ポインターとして Action を渡し、JS ロード前でも動作するようにする。
- **UI Feedback**: `useFormStatus`, `useTransition`, `useOptimistic` を活用し、ローディング状態や即時反映を実現する。

## 3. 型安全とバリデーション
- **Shared Schema**: Zod スキーマを `schemas.ts` に定義し、Client 側のバリデーションと Server Action 側のバリデーションで全く同じスキーマを使用する。
- **No Implicit Any**: プロキシや外部APIからのレスポンスは必ず Zod でパースし、型が保証された状態でアプリ内に持ち込む。

## 4. 状態管理
- **URL Parameter First**: ページの状態（フィルタ、選択中のID等）は `useSearchParams` またはルーティングで管理し、リロードしても復元可能にする。
- **Global State**: Jotai 等のライブラリは、UI特有のグローバル状態（サイドバーの開閉等）に限定し、サーバーデータのキャッシュには絶対に使用しない。

## 5. テスタビリティとモック
- **No DB Connection in Tests**: 全ての自動テストにおいて、実際のデータベース（Supabase 等）への接続を禁止する。
- **MSW (Mock Service Worker)**: 
  - API 通信のモックは MSW に一任する。
  - `msw/node` (Vitest 用) と `msw/browser` (Playwright 用) で同じハンドラー定義を共有し、テスト間での一貫性を保つ。
- **Action / Service Testing**: 
  - Server Actions のテストも、内部で呼び出す Service 層の `fetch` が MSW で横取りされるため、安全にブラックボックステストが可能。

## 6. HTML・CSS
- **セマンティックタグ**: `main`, `section`, `nav` 等の適切な使用。
- **アクセシビリティ**: フォームには適切な `label` と `aria-label` を付与。
