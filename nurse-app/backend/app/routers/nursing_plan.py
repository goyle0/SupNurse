from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user

# ここでrouterオブジェクトを定義
router = APIRouter(prefix="/nursing-plans", tags=["看護計画"])

@router.get("/")
def get_nursing_plans(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """看護計画のリストを取得する"""
    return {"message": "看護計画一覧機能は開発中です"}

@router.post("/")
def create_nursing_plan(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """新しい看護計画を登録する"""
    return {"message": "看護計画登録機能は開発中です"}

@router.get("/{plan_id}")
def get_nursing_plan(plan_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """指定されたIDの看護計画情報を取得する"""
    return {"message": f"看護計画ID {plan_id} の詳細機能は開発中です"}