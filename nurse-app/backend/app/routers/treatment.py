from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.treatment import Treatment as TreatmentModel
from app.schemas.treatment import Treatment, TreatmentCreate, TreatmentUpdate, TreatmentComplete
from app.database import get_db
from datetime import datetime

router = APIRouter(
    tags=["treatments"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[Treatment])
def get_treatments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    treatments = db.query(TreatmentModel).offset(skip).limit(limit).all()
    return treatments

@router.get("/{treatment_id}", response_model=Treatment)
def get_treatment(treatment_id: str, db: Session = Depends(get_db)):
    treatment = db.query(TreatmentModel).filter(TreatmentModel.id == treatment_id).first()
    if treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    return treatment

@router.post("/", response_model=Treatment, status_code=status.HTTP_201_CREATED)
def create_treatment(treatment: TreatmentCreate, db: Session = Depends(get_db)):
    db_treatment = TreatmentModel(**treatment.model_dump())
    db.add(db_treatment)
    db.commit()
    db.refresh(db_treatment)
    return db_treatment

@router.put("/{treatment_id}", response_model=Treatment)
def update_treatment(treatment_id: str, treatment: TreatmentUpdate, db: Session = Depends(get_db)):
    db_treatment = db.query(TreatmentModel).filter(TreatmentModel.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    update_data = treatment.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_treatment, key, value)
    
    db.commit()
    db.refresh(db_treatment)
    return db_treatment

@router.delete("/{treatment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_treatment(treatment_id: str, db: Session = Depends(get_db)):
    db_treatment = db.query(TreatmentModel).filter(TreatmentModel.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    db.delete(db_treatment)
    db.commit()
    return {"ok": True}

@router.post("/{treatment_id}/complete", response_model=Treatment)
def complete_treatment(treatment_id: str, completion_data: TreatmentComplete, db: Session = Depends(get_db)):
    db_treatment = db.query(TreatmentModel).filter(TreatmentModel.id == treatment_id).first()
    if db_treatment is None:
        raise HTTPException(status_code=404, detail="処置が見つかりません")
    
    # 既に実施済みの処置の場合
    if db_treatment.status == "completed":
        raise HTTPException(status_code=400, detail="この処置は既に実施済みです")
    
    # 処置実施のデータを更新
    completion_dict = completion_data.model_dump()
    db_treatment.completed_time = completion_dict["completed_time"]
    db_treatment.completed_by = completion_dict["completed_by"]
    db_treatment.notes = completion_dict.get("notes")
    db_treatment.status = "completed"
    
    db.commit()
    db.refresh(db_treatment)
    return db_treatment