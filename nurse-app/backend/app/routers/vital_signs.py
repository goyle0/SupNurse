from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import vital_signs as models
from app.schemas import vital_signs as schemas

router = APIRouter(prefix="/vital-signs", tags=["vital-signs"])

# 異常値の閾値設定
VITAL_THRESHOLDS = {
    "temperature": {"min": 35.0, "max": 38.0, "unit": "°C"},
    "blood_pressure_systolic": {"min": 90, "max": 140, "unit": "mmHg"},
    "blood_pressure_diastolic": {"min": 60, "max": 90, "unit": "mmHg"},
    "pulse": {"min": 60, "max": 100, "unit": "bpm"},
    "spo2": {"min": 95, "max": 100, "unit": "%"},
    "respiration": {"min": 12, "max": 20, "unit": "bpm"}
}

def check_abnormal(vital_type, value):
    """バイタルサインが異常値かどうかをチェック"""
    if vital_type not in VITAL_THRESHOLDS:
        return False
    
    threshold = VITAL_THRESHOLDS[vital_type]
    return value < threshold["min"] or value > threshold["max"]

@router.post("/", response_model=schemas.VitalSign)
def create_vital_sign(vital: schemas.VitalSignCreate, db: Session = Depends(get_db)):
    is_abnormal = check_abnormal(vital.vital_type, vital.value)
    db_vital = models.VitalSign(**vital.dict(), is_abnormal=is_abnormal)
    db.add(db_vital)
    db.commit()
    db.refresh(db_vital)
    return db_vital

@router.get("/patient/{patient_id}", response_model=schemas.VitalSignsResponse)
def get_patient_vital_signs(
    patient_id: int, 
    vital_type: Optional[str] = None,
    days: Optional[int] = Query(7, description="過去何日間のデータを取得するか"),
    db: Session = Depends(get_db)
):
    query = db.query(models.VitalSign).filter(models.VitalSign.patient_id == patient_id)
    
    if vital_type:
        query = query.filter(models.VitalSign.vital_type == vital_type)
    
    if days:
        start_date = datetime.now() - timedelta(days=days)
        query = query.filter(models.VitalSign.timestamp >= start_date)
    
    vital_signs = query.order_by(models.VitalSign.timestamp).all()
    abnormal_count = len([v for v in vital_signs if v.is_abnormal])
    
    return {"vital_signs": vital_signs, "abnormal_count": abnormal_count}