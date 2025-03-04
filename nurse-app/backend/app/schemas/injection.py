# このファイルはinjectionスキーマを定義します

from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime
from enum import Enum

class InjectionStatus(str, Enum):
    """注射実施ステータス"""
    SCHEDULED = "scheduled"
    ADMINISTERED = "administered"
    CANCELLED = "cancelled"

class InjectionRoute(str, Enum):
    """注射投与経路"""
    SUBCUTANEOUS = "皮下注射"
    INTRAMUSCULAR = "筋肉注射"
    INTRAVENOUS = "静脈注射"
    INTRADERMAL = "皮内注射"
    OTHER = "その他"

class InjectionBase(BaseModel):
    """注射実施ベーススキーマ"""
    patient_id: str
    patient_name: str
    medication: str
    dose: str
    route: str
    scheduled_time: datetime
    status: InjectionStatus
    notes: Optional[str] = None
    
    @validator('route')
    def validate_route(cls, v):
        valid_routes = [route.value for route in InjectionRoute]
        if v not in valid_routes:
            raise ValueError(f"投与経路は以下のいずれかである必要があります: {', '.join(valid_routes)}")
        return v

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
    status: Optional[InjectionStatus] = None
    notes: Optional[str] = None
    
    @validator('route')
    def validate_route(cls, v):
        if v is None:
            return v
        valid_routes = [route.value for route in InjectionRoute]
        if v not in valid_routes:
            raise ValueError(f"投与経路は以下のいずれかである必要があります: {', '.join(valid_routes)}")
        return v

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