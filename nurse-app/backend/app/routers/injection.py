from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_active_user
from app.models.user import User
from app.models.injection import Injection
from app.schemas.injection import InjectionCreate, InjectionUpdate, Injection as InjectionSchema, InjectionAdminister

router = APIRouter()

@router.get("/", response_model=List[InjectionSchema])
async def read_injections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """注射実施の一覧を取得する"""
    injections = db.query(Injection).offset(skip).limit(limit).all()
    return injections

@router.post("/", response_model=InjectionSchema, status_code=status.HTTP_201_CREATED)
async def create_injection(
    injection: InjectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """新しい注射実施を作成する"""
    db_injection = Injection(
        **injection.dict(),
        created_by_id=current_user.id,
        created_at=datetime.now()
    )
    db.add(db_injection)
    db.commit()
    db.refresh(db_injection)
    return db_injection

@router.get("/{injection_id}", response_model=InjectionSchema)
async def read_injection(
    injection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """特定の注射実施を取得する"""
    db_injection = db.query(Injection).filter(Injection.id == injection_id).first()
    if db_injection is None:
        raise HTTPException(status_code=404, detail="注射実施が見つかりません")
    return db_injection

@router.put("/{injection_id}", response_model=InjectionSchema)
async def update_injection(
    injection_id: int,
    injection: InjectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """注射実施を更新する"""
    db_injection = db.query(Injection).filter(Injection.id == injection_id).first()
    if db_injection is None:
        raise HTTPException(status_code=404, detail="注射実施が見つかりません")
    
    update_data = injection.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_injection, key, value)
    
    db_injection.updated_by_id = current_user.id
    db_injection.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_injection)
    return db_injection

@router.delete("/{injection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_injection(
    injection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """注射実施を削除する"""
    db_injection = db.query(Injection).filter(Injection.id == injection_id).first()
    if db_injection is None:
        raise HTTPException(status_code=404, detail="注射実施が見つかりません")
    
    db.delete(db_injection)
    db.commit()
    return {"detail": "注射実施が削除されました"}

@router.post("/{injection_id}/administer", response_model=InjectionSchema)
async def administer_injection(
    injection_id: int,
    administration: InjectionAdminister,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """注射実施を記録する"""
    db_injection = db.query(Injection).filter(Injection.id == injection_id).first()
    if db_injection is None:
        raise HTTPException(status_code=404, detail="注射実施が見つかりません")
    
    if db_injection.status == "administered":
        raise HTTPException(status_code=400, detail="この注射はすでに実施済みです")
    
    if db_injection.status == "cancelled":
        raise HTTPException(status_code=400, detail="中止された注射は実施できません")
    
    db_injection.administered_time = administration.administered_time
    db_injection.administered_by = administration.administered_by
    db_injection.status = "administered"
    if administration.notes:
        db_injection.notes = administration.notes
    
    db_injection.updated_by_id = current_user.id
    db_injection.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_injection)
    return db_injection