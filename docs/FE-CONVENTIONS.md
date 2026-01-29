# コーディング規約 - Saisoku-AI (Next.js Native Edition)

## 1. 基本原則
### 1.1 ドキュメンテーション
- **JSDoc の徹底**: 全ての公開関数、サービス、コンポーネント、および複雑な型定義には JSDoc 形式のコメントを記述する。
- **目的と引数**: 単に型をなぞるのではなく、そのコードの「目的」や「前提条件」を人間の言葉で説明する。

### 1.2 SOLID原則の遵守
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
- **Service Pattern**: `apiClient` を呼び出す。
- **責務の分離**: フェッチ関数 (`apiClient`) は通信のみに集中し、バリデーションは別、あるいは用途に合わせて行う。「1つの関数でフェッチとバリデーションをセット」にするのは、再利用性とテスタビリティを低下させるため原則禁止とする。
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

## 5. ファイル構成とテスト配置
- **Co-location を避ける**: 実装ファイル（`.ts`, `.tsx`）とテストファイル（`.test.ts`）を同じディレクトリに置かず、必ず `tests/` サブディレクトリに隔離する。
- **配置ルール**:
  - `features/<feature>/tests/`: `service.ts`, `actions.ts`, `schemas.ts`, `types.ts` 等のテスト。
  - `features/<feature>/hooks/tests/`: カスタムフックのテスト。
  - `features/<feature>/components/tests/`: コンポーネントのテスト。
- **共通ユーティリティ**: `src/utils/tests/` に配置する。

## 6. テストコーディング規約
- **AAA (Arrange-Act-Assert) パターン**: 
  - テストコードを `Arrange` (準備), `Act` (実行), `Assert` (検証) の3つのセクションに明確に分ける。
  - 各セクションの冒頭には必ず `// Arrange`, `// Act`, `// Assert` というコメントを記述し、構造を可視化する。
- **日本語によるテストタイトル**: 
  - `describe` や `it` (または `test`) の第一引数（テストタイトル）は、仕様を理解しやすくするために**日本語**で記述する。
- **意味のあるテスト**: 
  - 実装の「書き方」をなぞるのではなく、ユーザーや利用側から見た「仕様・期待される振る舞い」をテストする。
  - カバレッジを上げるためだけの無意味なテスト（パススルー関数のテスト等）を避け、バグの混入を防ぐガードとして機能させる。

## 7. TDD ワークフロー
- **Step 1 (Red)**: `tests/` ディレクトリにテストファイルを作成し、期待する要件をテストケースとして記述する。
- **Step 2 (Green)**: 動作する最小限のコードを書く。この時点ではコードの美しさよりもテスト通過を優先して良い。
- **Step 3 (Refactor)**: テストを壊さずにコードを洗練させる。
- **原則**: Pull Request (またはコミット) は、関連するテストが全て Green でなければならない。

## 8. テスタビリティとモック
- **Vitest (Logic/Service)**: 
  - 外部境界（API通信、DB）は `vi.mock()` を使用して**関数の戻り値をスタブ化**する。
  - MSW は Vitest では原則使用せず、Playwright でのみ使用する。
- **MSW (Playwright)**:
  - ブラウザ環境の E2E テストにおいて、API 通信をネットワークレベルで横取りするために使用する。
- **No DB Connection in Tests**: 全ての自動テストにおいて、実際のデータベースへの接続を禁止する。

## 9. HTML・CSS
- **セマンティックタグ**: `main`, `section`, `nav` 等の適切な使用。
- **アクセシビリティ**: フォームには適切な `label` と `aria-label` を付与。
