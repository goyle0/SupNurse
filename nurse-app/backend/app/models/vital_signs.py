from sqlalchemy import Column, Integer, Float, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class VitalSign(Base):
    __tablename__ = "vital_signs"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    timestamp = Column(DateTime, default=datetime.datetime.now)
    vital_type = Column(String, index=True)  # "temperature", "blood_pressure", "pulse", "spo2", "respiration"
    value = Column(Float)
    unit = Column(String)
    is_abnormal = Column(Boolean, default=False)
    notes = Column(String, nullable=True)
    
    patient = relationship("Patient", back_populates="vital_signs")