from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.question_set import QuestionSet
from app.schemas.question import GenerateRequest, QuestionSetResponse, QuestionSetSummary
from app.services.groq_service import generate_questions, GroqGenerationError

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.post("/generate", response_model=QuestionSetResponse, status_code=201)
def generate(payload: GenerateRequest, db: Session = Depends(get_db)):
    try:
        questions = generate_questions(
            role=payload.role,
            experience_level=payload.experience_level,
            topic=payload.topic,
            num_questions=payload.num_questions,
        )
    except GroqGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    question_set = QuestionSet(
        role=payload.role,
        experience_level=payload.experience_level,
        topic=payload.topic,
        num_questions=len(questions),
        questions=questions,
    )
    db.add(question_set)
    db.commit()
    db.refresh(question_set)
    return question_set


@router.get("/history", response_model=list[QuestionSetSummary])
def get_history(db: Session = Depends(get_db), limit: int = 20):
    return (
        db.query(QuestionSet)
        .order_by(desc(QuestionSet.created_at))
        .limit(limit)
        .all()
    )


@router.get("/{question_set_id}", response_model=QuestionSetResponse)
def get_question_set(question_set_id: int, db: Session = Depends(get_db)):
    question_set = db.query(QuestionSet).filter(QuestionSet.id == question_set_id).first()
    if not question_set:
        raise HTTPException(status_code=404, detail="Question set not found")
    return question_set


@router.delete("/{question_set_id}", status_code=204)
def delete_question_set(question_set_id: int, db: Session = Depends(get_db)):
    question_set = db.query(QuestionSet).filter(QuestionSet.id == question_set_id).first()
    if not question_set:
        raise HTTPException(status_code=404, detail="Question set not found")
    db.delete(question_set)
    db.commit()