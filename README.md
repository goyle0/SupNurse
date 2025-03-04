<!-- このファイルはREADMEです -->

# 看護支援アプリケーション

看護業務を効率化し、患者ケアの質を向上させるための総合支援ツールです。

## 機能

- **注射実施**: 患者の注射スケジュール管理と実施記録
- **処置実施**: 各種処置の計画と実施状況の一元管理
- **看護計画**: 患者ごとの看護計画作成と進捗追跡
- **看護記録**: 日々の観察や介入内容の記録・閲覧

## 技術スタック

### フロントエンド

- Next.js
- Redux (状態管理)
- Chakra UI (UIコンポーネント)
- TypeScript
- React Icons

### バックエンド

- FastAPI (Python)
- SQLAlchemy (ORM)
- JWT認証

## プロジェクト構造

```
nurse-app/
├── components/         # 再利用可能なUIコンポーネント
├── pages/              # ページコンポーネント
├── store/              # Reduxストア
├── styles/             # グローバルスタイル
├── utils/              # ユーティリティ関数
├── backend/            # バックエンドAPI
│   ├── app/            # アプリケーションコード
│   │   ├── models/     # データベースモデル
│   │   ├── routers/    # APIエンドポイント
│   │   └── schemas/    # Pydanticスキーマ
│   └── requirements.txt # Pythonの依存関係
└── package.json        # フロントエンドの依存関係
```

## ブランチ構成

このプロジェクトでは、以下のブランチ構成でGit管理を行っています：

### メインブランチ

- **main**: 本番環境用のブランチ。安定したリリース版のコードを管理
- **develop**: 開発用のメインブランチ。機能開発やバグ修正の統合先

### 機能開発用ブランチ

- **feature/injection**: 注射実施機能の開発用
- **feature/treatment**: 処置実施機能の開発用
- **feature/nursing-plan**: 看護計画機能の開発用
- **feature/nursing-record**: 看護記録機能の開発用

### 修正用ブランチ

- **bugfix**: 通常のバグ修正用
- **hotfix**: 緊急のバグ修正用（本番環境に直接適用可能）

## 開発ワークフロー

1. 機能開発を始める際は、対応する機能ブランチに切り替えます：

   ```bash
   git checkout feature/injection  # 例：注射実施機能を開発する場合
   ```

2. 変更を加えた後、コミットします：

   ```bash
   git add .
   git commit -m "機能の説明"
   ```

3. リモートリポジトリにプッシュします：

   ```bash
   git push origin feature/injection
   ```

4. 機能が完成したら、GitHubでdevelopブランチへのプルリクエストを作成します。

## セットアップ方法

### フロントエンド

```bash
# プロジェクトディレクトリに移動
cd nurse-app

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンド開発サーバーは <http://localhost:3000> で実行されます。

### バックエンド

```bash
# バックエンドディレクトリに移動
cd nurse-app/backend

# 仮想環境の作成（オプション）
python -m venv venv
source venv/bin/activate  # Linuxの場合
# または
venv\Scripts\activate  # Windowsの場合

# 依存パッケージのインストール
pip install -r requirements.txt

# 開発サーバーの起動
uvicorn main:app --reload
```

バックエンドAPIサーバーは <http://localhost:8000> で実行されます。
API ドキュメントは <http://localhost:8000/docs> で確認できます。

## 環境変数の設定

`.env` ファイルをプロジェクトのルートディレクトリに作成し、以下の環境変数を設定します：

```
# フロントエンド用
NEXT_PUBLIC_API_URL=http://localhost:8000

# バックエンド用
DATABASE_URL=sqlite:///./nurse_app.db
SECRET_KEY=your_secret_key_here
```

## コントリビューションガイドライン

### コーディング規約

- TypeScriptファイルはESLintとPrettierの設定に従ってフォーマットしてください
- Pythonファイルは[PEP 8](https://peps.python.org/pep-0008/)に準拠してください
- コンポーネントは機能ごとに分割し、再利用可能な設計を心がけてください
- コメントは日本語で記述し、複雑なロジックには説明を追加してください

### プルリクエストのプロセス

1. 作業前に最新の`develop`ブランチを取得してください
2. 機能ごとに適切なブランチを作成してください
3. 変更が完了したら、テストを実行して問題がないことを確認してください
4. プルリクエストには、変更内容の詳細な説明を含めてください
5. レビュアーからのフィードバックに基づいて修正を行ってください
6. すべての問題が解決されたら、`develop`ブランチにマージされます

## 今後の開発計画

1. ユーザー認証機能の実装
2. データベース連携の強化
3. モバイル対応の改善
4. チャットボット機能の追加

## トラブルシューティング

よくある問題と解決策：

- **APIに接続できない場合**: バックエンドサーバーが起動しているか、`.env`ファイルのAPI URLが正しいか確認してください
- **ビルドエラーが発生する場合**: 依存パッケージが最新かどうか確認し、`npm install`を再実行してください
- **認証エラーが発生する場合**: JWTトークンの有効期限が切れていないか確認してください

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
