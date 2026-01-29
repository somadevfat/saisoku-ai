# Zod 最新ベストプラクティス (2026年版)

Saisoku-AI で使用する Zod スキーマの最新実装ガイド。

## 1. 日付・時間の扱い
以前の `z.string().datetime()` よりも、現在は `z.iso` 空間や `z.coerce` を使用するのが定石です。

### 1.1 `z.coerce.date()` (強く推奨)
API からのレスポンスやフォームの入力値を、自動的に JavaScript の `Date` オブジェクトに変換します。
これにより、アプリ内部での「日付文字列のパース」が不要になり、型安全に `date.getTime()` 等が呼べるようになります。

```typescript
// 悪い例 (文字列として扱う)
createdAt: z.string().datetime()

// 良い例 (Date オブジェクトに自動変換)
createdAt: z.coerce.date()
```

### 1.2 `z.iso.datetime()` (文字列として厳密にバリデーションしたい場合)
Zod 4 以降では、セマンティックなバリデーションが `z.iso` ネイムスペースに集約されています。
※ 内部で `Date` オブジェクトに変換したくない場合に使用。

```typescript
deadline: z.iso.datetime()
```

## 2. 文字列バリデーション (v4 トップレベル関数)
Zod 4 以降、特定のフォーマットを検証する関数は `z.string()` からのチェーンではなく、トップレベル関数として提供されています。これらはツリーシェイキングを最適化し、より厳格な検証を行います。

### 2.1 `z.uuid()`
`z.string().uuid()` は非推奨です。

```typescript
id: z.uuid()
```

### 2.2 `z.url()` と `z.httpUrl()`
`z.string().url()` は非推奨です。プロトコルを限定したい場合は `z.httpUrl()` が便利です。

```typescript
// あらゆる有効な URL
evidenceUrl: z.url()

// http または https のみ
evidenceUrl: z.httpUrl()
```

## 3. デフォルト値の扱い
`.default()` は、入力が `undefined` の場合にのみ適用されます。DB から `null` が返ってくる可能性がある場合は、`.nullable()` と組み合わせて慎重に設計してください。

## 3. バリデーションエラーの日本語化
`z.string().min(1, '必須項目です')` 等、第2引数にカスタムメッセージを明示的に記述します。

## 4. スキーマの拡張
`z.object({ ... }).extend({ ... })` を使用し、ベースとなるスキーマから「作成用」「更新用」のスキーマを派生させます。これにより DRY な定義が可能です。
