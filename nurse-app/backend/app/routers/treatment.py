from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from datetime import datetime

router = APIRouter(
    prefix="/api/treatments",
    tags=["treatments"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Treatment])
def get_treatments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    treatments = db.query(models.Treatment).offset(skip).limit(limit).all()
    return treatments

@router.get("/{treatment_id}", response_model=schemas.Treatment)
def get_treatment(treatment_id: str, db: Session = Depends(get_db)):
    treatment = db.query(models.Treatment).filter(models.Treatment.id == treatment_id).first()
    if treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    return treatment

@router.post("/", response_model=schemas.Treatment, status_code=status.HTTP_201_CREATED)
def create_treatment(treatment: schemas.TreatmentCreate, db: Session = Depends(get_db)):
    db_treatment = models.Treatment(**treatment.dict())
    db.add(db_treatment)
    db.commit()
    db.refresh(db_treatment)
    return db_treatment

@router.put("/{treatment_id}", response_model=schemas.Treatment)
def update_treatment(treatment_id: str, treatment: schemas.TreatmentUpdate, db: Session = Depends(get_db)):
    db_treatment = db.query(models.Treatment).filter(models.Treatment.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    update_data = treatment.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_treatment, key, value)
    
    db.commit()
    db.refresh(db_treatment)
    return db_treatment

@router.delete("/{treatment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_treatment(treatment_id: str, db: Session = Depends(get_db)):
    db_treatment = db.query(models.Treatment).filter(models.Treatment.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    db.delete(db_treatment)
    db.commit()
    return {"ok": True}

@router.post("/{treatment_id}/complete", response_model=schemas.Treatment)
def complete_treatment(treatment_id: str, completion_data: schemas.TreatmentComplete, db: Session = Depends(get_db)):
    db_treatment = db.query(models.Treatment).filter(models.Treatment.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    # 既に実施済みの処置の場合
    if db_treatment.status == "completed":
        raise HTTPException(status_code=400, detail="この処置は既に実施済みです")
    
    # 処置実施のデータを更新
    db_treatment.completed_time = completion_data.completed_time
    db_treatment.completed_by = completion_data.completed_by
    db_treatment.notes = completion_data.notes
    db_treatment.status = "completed"
    
    db.commit()
    db.refresh(db_treatment)
    return db_treatment