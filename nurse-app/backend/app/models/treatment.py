from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime

class Treatment(Base):
    __tablename__ = "treatments"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, index=True)
    patient_name = Column(String)
    treatment_type = Column(String)
    description = Column(Text, nullable=True)
    scheduled_time = Column(DateTime)
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    completed_time = Column(DateTime, nullable=True)
    completed_by = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # ユーザーとの関連を追加
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_user = relationship("User", back_populates="treatments")