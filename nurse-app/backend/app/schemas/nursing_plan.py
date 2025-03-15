from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class NursingPlanStatus(str, Enum):
    """看護計画のステータス"""
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class NursingPlanBase(BaseModel):
    """看護計画ベーススキーマ"""
    patient_id: str
    patient_name: str
    problem: str
    goal: str
    interventions: List[str]
    start_date: datetime
    target_date: datetime
    status: NursingPlanStatus
    evaluation_notes: Optional[str] = None

class NursingPlanCreate(NursingPlanBase):
    """看護計画作成スキーマ"""
    pass

class NursingPlanUpdate(BaseModel):
    """看護計画更新スキーマ"""
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    problem: Optional[str] = None
    goal: Optional[str] = None
    interventions: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    target_date: Optional[datetime] = None
    status: Optional[NursingPlanStatus] = None
    evaluation_notes: Optional[str] = None

class NursingPlan(NursingPlanBase):
    """看護計画表示スキーマ"""
    id: int
    created_by_id: int
    created_at: datetime
    updated_by_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True