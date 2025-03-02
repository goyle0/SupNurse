from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

from app.routers import injection, treatment, nursing_plan, nursing_record, auth
from app.database import engine, Base
from app.dependencies import get_current_user

# データベースの初期化
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="看護支援アプリAPI",
    description="看護業務を支援するためのRESTful API",
    version="1.0.0"
)

# CORS設定
origins = [
    "http://localhost:3000",  # Next.jsのデフォルトポート
    "http://localhost:8000",  # 開発環境用
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(auth.router, tags=["認証"])
app.include_router(
    injection.router,
    prefix="/api/injections",
    tags=["注射実施"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    treatment.router,
    prefix="/api/treatments",
    tags=["処置実施"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    nursing_plan.router,
    prefix="/api/nursing-plans",
    tags=["看護計画"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    nursing_record.router,
    prefix="/api/nursing-records",
    tags=["看護記録"],
    dependencies=[Depends(get_current_user)]
)

@app.get("/")
async def root():
    return {"message": "看護支援アプリAPIへようこそ"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)