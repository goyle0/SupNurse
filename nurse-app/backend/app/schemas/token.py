# このファイルはトークンスキーマを定義します

from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """トークンスキーマ"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """トークンデータスキーマ"""
    username: Optional[str] = None