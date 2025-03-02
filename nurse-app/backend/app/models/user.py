from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    """ユーザーモデル"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # リレーションシップ
    injections = relationship("Injection", back_populates="created_by_user")
    treatments = relationship("Treatment", back_populates="created_by_user")
    nursing_plans = relationship("NursingPlan", back_populates="created_by_user")
    nursing_records = relationship("NursingRecord", back_populates="created_by_user")