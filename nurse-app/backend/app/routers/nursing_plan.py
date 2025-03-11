# このファイルはnursing_plan用のルーターを定義します

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_active_user
from app.models.user import User
from app.models.nursing_plan import NursingPlan
from app.schemas.nursing_plan import NursingPlanCreate, NursingPlanUpdate, NursingPlan as NursingPlanSchema, NursingPlanStatus

router = APIRouter()

@router.get("/", response_model=List[NursingPlanSchema])
async def read_nursing_plans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """看護計画の一覧を取得する"""
    nursing_plans = db.query(NursingPlan).offset(skip).limit(limit).all()
    return nursing_plans

@router.post("/", response_model=NursingPlanSchema, status_code=status.HTTP_201_CREATED)
async def create_nursing_plan(
    nursing_plan: NursingPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """新しい看護計画を作成する"""
    db_nursing_plan = NursingPlan(
        **nursing_plan.dict(),
        created_by_id=current_user.id,
        created_at=datetime.now()
    )
    db.add(db_nursing_plan)
    db.commit()
    db.refresh(db_nursing_plan)
    return db_nursing_plan

@router.get("/{nursing_plan_id}", response_model=NursingPlanSchema)
async def read_nursing_plan(
    nursing_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """特定の看護計画を取得する"""
    db_nursing_plan = db.query(NursingPlan).filter(NursingPlan.id == nursing_plan_id).first()
    if db_nursing_plan is None:
        raise HTTPException(status_code=404, detail="看護計画が見つかりません")
    return db_nursing_plan

@router.put("/{nursing_plan_id}", response_model=NursingPlanSchema)
async def update_nursing_plan(
    nursing_plan_id: int,
    nursing_plan: NursingPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """看護計画を更新する"""
    db_nursing_plan = db.query(NursingPlan).filter(NursingPlan.id == nursing_plan_id).first()
    if db_nursing_plan is None:
        raise HTTPException(status_code=404, detail="看護計画が見つかりません")
    
    update_data = nursing_plan.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_nursing_plan, key, value)
    
    db_nursing_plan.updated_by_id = current_user.id
    db_nursing_plan.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_nursing_plan)
    return db_nursing_plan

@router.delete("/{nursing_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nursing_plan(
    nursing_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """看護計画を削除する"""
    db_nursing_plan = db.query(NursingPlan).filter(NursingPlan.id == nursing_plan_id).first()
    if db_nursing_plan is None:
        raise HTTPException(status_code=404, detail="看護計画が見つかりません")
    
    db.delete(db_nursing_plan)
    db.commit()
    return {"detail": "看護計画が削除されました"}

@router.put("/{nursing_plan_id}/complete", response_model=NursingPlanSchema)
async def complete_nursing_plan(
    nursing_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """看護計画を完了状態にする"""
    db_nursing_plan = db.query(NursingPlan).filter(NursingPlan.id == nursing_plan_id).first()
    if db_nursing_plan is None:
        raise HTTPException(status_code=404, detail="看護計画が見つかりません")
    
    if db_nursing_plan.status == NursingPlanStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="中止された看護計画は完了できません")
    
    db_nursing_plan.status = NursingPlanStatus.COMPLETED
    db_nursing_plan.updated_by_id = current_user.id
    db_nursing_plan.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_nursing_plan)
    return db_nursing_plan

@router.put("/{nursing_plan_id}/cancel", response_model=NursingPlanSchema)
async def cancel_nursing_plan(
    nursing_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """看護計画を中止状態にする"""
    db_nursing_plan = db.query(NursingPlan).filter(NursingPlan.id == nursing_plan_id).first()
    if db_nursing_plan is None:
        raise HTTPException(status_code=404, detail="看護計画が見つかりません")
    
    if db_nursing_plan.status == NursingPlanStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="完了した看護計画は中止できません")
    
    db_nursing_plan.status = NursingPlanStatus.CANCELLED
    db_nursing_plan.updated_by_id = current_user.id
    db_nursing_plan.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_nursing_plan)
    return db_nursing_plan