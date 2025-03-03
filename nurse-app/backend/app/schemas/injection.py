# このファイルはinjectionスキーマを定義します

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InjectionBase(BaseModel):
    """注射実施ベーススキーマ"""
    patient_id: str
    patient_name: str
    medication: str
    dose: str
    route: str
    scheduled_time: datetime
    status: str  # 'scheduled', 'administered', 'cancelled'
    notes: Optional[str] = None

class InjectionCreate(InjectionBase):
    """注射実施作成スキーマ"""
    pass

class InjectionUpdate(BaseModel):
    """注射実施更新スキーマ"""
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    medication: Optional[str] = None
    dose: Optional[str] = None
    route: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    administered_time: Optional[datetime] = None
    administered_by: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class InjectionAdminister(BaseModel):
    """注射実施記録スキーマ"""
    administered_time: datetime
    administered_by: str
    notes: Optional[str] = None

class Injection(InjectionBase):
    """注射実施表示スキーマ"""
    id: int
    administered_time: Optional[datetime] = None
    administered_by: Optional[str] = None
    created_by_id: int
    created_at: datetime
    updated_by_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True