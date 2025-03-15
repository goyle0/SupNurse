from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TreatmentBase(BaseModel):
    patient_id: str
    patient_name: str
    treatment_type: str
    description: Optional[str] = None
    scheduled_time: datetime
    status: str = "scheduled"

class TreatmentCreate(TreatmentBase):
    pass

class TreatmentUpdate(BaseModel):
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    treatment_type: Optional[str] = None
    description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    status: Optional[str] = None
    completed_time: Optional[datetime] = None
    completed_by: Optional[str] = None
    notes: Optional[str] = None

class TreatmentComplete(BaseModel):
    completed_time: datetime
    completed_by: str
    notes: Optional[str] = None

class Treatment(TreatmentBase):
    id: str
    completed_time: Optional[datetime] = None
    completed_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True