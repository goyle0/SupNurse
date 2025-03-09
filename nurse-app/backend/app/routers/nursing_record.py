from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user

# ここでrouterオブジェクトを定義
router = APIRouter(prefix="/nursing-records", tags=["看護記録"])

@router.get("/")
def get_nursing_records(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """看護記録のリストを取得する"""
    return {"message": "看護記録一覧機能は開発中です"}

@router.post("/")
def create_nursing_record(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """新しい看護記録を登録する"""
    return {"message": "看護記録登録機能は開発中です"}

@router.get("/{record_id}")
def get_nursing_record(record_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """指定されたIDの看護記録情報を取得する"""
    return {"message": f"看護記録ID {record_id} の詳細機能は開発中です"}