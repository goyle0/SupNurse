from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/treatments", tags=["処置"])

@router.get("/")
def get_treatments(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """処置のリストを取得する"""
    return {"message": "処置一覧機能は開発中です"}

@router.post("/")
def create_treatment(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """新しい処置を登録する"""
    return {"message": "処置登録機能は開発中です"}

@router.get("/{treatment_id}")
def get_treatment(treatment_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """指定されたIDの処置情報を取得する"""
    return {"message": f"処置ID {treatment_id} の詳細機能は開発中です"}
