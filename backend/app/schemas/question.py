from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class QuestionItem(BaseModel):
    question: str
    category: str
    answer_tip: str


class GenerateRequest(BaseModel):
    role: str = Field(..., min_length=2, max_length=100)
    experience_level: str
    topic: Optional[str] = Field(None, max_length=100)
    num_questions: int = Field(5, ge=1, le=15)


class QuestionSetResponse(BaseModel):
    id: int
    role: str
    experience_level: str
    topic: Optional[str]
    num_questions: int
    questions: list[QuestionItem]
    created_at: datetime

    class Config:
        from_attributes = True


class QuestionSetSummary(BaseModel):
    id: int
    role: str
    experience_level: str
    topic: Optional[str]
    num_questions: int
    created_at: datetime

    class Config:
        from_attributes = True