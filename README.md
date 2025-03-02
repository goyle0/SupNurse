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

## 今後の開発計画

1. ユーザー認証機能の実装
2. データベース連携の強化
3. モバイル対応の改善
4. チャットボット機能の追加

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
