# このファイルはinjectionモデルを定義します

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database import Base

class Injection(Base):
    """注射実施モデル"""
    __tablename__ = "injections"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    patient_name = Column(String)
    medication = Column(String)
    dose = Column(String)
    route = Column(String)
    scheduled_time = Column(DateTime)
    administered_time = Column(DateTime, nullable=True)
    administered_by = Column(String, nullable=True)
    status = Column(String)  # 'scheduled', 'administered', 'cancelled'
    notes = Column(Text, nullable=True)
    
    # 作成者と更新者
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)
    updated_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime, nullable=True)

    # リレーションシップ
    created_by_user = relationship("User", foreign_keys=[created_by_id], back_populates="injections")