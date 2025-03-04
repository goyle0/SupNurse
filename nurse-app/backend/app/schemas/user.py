# このファイルはユーザースキーマを定義します

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    """ユーザーベーススキーマ"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: Optional[bool] = False

class UserCreate(UserBase):
    """ユーザー作成スキーマ"""
    password: str

class UserUpdate(BaseModel):
    """ユーザー更新スキーマ"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    """ユーザー表示スキーマ"""
    id: int

    class Config:
        orm_mode = True