from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator
from datetime import datetime
import json

from app.database import Base

class JsonList(TypeDecorator):
    """リストをJSON文字列として保存するカスタム型"""
    impl = Text
    
    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)
    
    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return json.loads(value)

class NursingPlan(Base):
    """看護計画モデル"""
    __tablename__ = "nursing_plans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    patient_name = Column(String)
    problem = Column(Text)
    goal = Column(Text)
    interventions = Column(JsonList)  # ARRAY(String)からJsonListに変更
    start_date = Column(DateTime)
    target_date = Column(DateTime)
    status = Column(String)  # 'active', 'completed', 'cancelled'
    evaluation_notes = Column(Text, nullable=True)
    
    # 作成者と更新者
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)
    updated_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime, nullable=True)

    # リレーションシップ
    created_by_user = relationship("User", foreign_keys=[created_by_id], back_populates="nursing_plans")