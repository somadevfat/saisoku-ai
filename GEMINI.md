# 憲法
- 常に日本語で使用
- 要件定義書`docs/REQUIREMENTS.md`を参照すること
- フロントエンドディレクトリ`docs/FRONTEND_DESIGN.md`を遵守すること
- フロントエンドコーディング規約`docs/FE-CONVENTIONS.md`を遵守すること
- SOLID原則を遵守すること
- 全ての関数、コンポーネント、型定義にJSDoc形式のコメントを記述すること

## TDD (Test-Driven Development) を基本として開発を行う。
- **Red**: 実装前に必ず失敗するテストを書く。
  - Logic/Service: `features/**/tests/*.test.ts` (Vitest)
  - UI/Workflow: `tests/e2e/*.spec.ts` (Playwright + MSW)
- **Green**: テストを通すための最小限の実装を行う。
- **Refactor**: 型の整理やコードの共通化を行い、テストが通る状態を維持する。
- **AAA Pattern**: 全てのテストは AAA (`// Arrange`, `// Act`, `// Assert`) 形式で記述し、意味のある仕様をテストする。
- **Japanese Titles**: `describe` や `it` のタイトルは日本語で記述し、仕様を明確にする。

## PR (Pull Request) の粒度
- **Small PR**: 変更を小さく保ち、レビュー負荷を軽減する。
- **One PR, One Purpose**: 1つのPRで1つの目的（機能追加、バグ修正、リファクタリング）のみを扱う。
- **Cycle-based**: 原則として、TDDの1サイクル（Red/Green/Refactor）または、1つのコンポーネント/Serviceの完成を1つのPRの区切りとする。
- **Max Lines**: 変更行数は原則として300行以内を目指す。
