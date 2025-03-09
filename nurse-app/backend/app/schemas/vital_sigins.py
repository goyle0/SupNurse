from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class VitalSignBase(BaseModel):
    patient_id: int
    timestamp: datetime = Field(default_factory=datetime.now)
    vital_type: str
    value: float
    unit: str
    notes: Optional[str] = None

class VitalSignCreate(VitalSignBase):
    pass

class VitalSignUpdate(BaseModel):
    value: Optional[float] = None
    notes: Optional[str] = None
    is_abnormal: Optional[bool] = None

class VitalSign(VitalSignBase):
    id: int
    is_abnormal: bool
    
    class Config:
        orm_mode = True

class VitalSignsResponse(BaseModel):
    vital_signs: List[VitalSign]
    abnormal_count: int