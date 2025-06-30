from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import Task
from database import SessionLocal
from pydantic import BaseModel
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TaskCreate(BaseModel):
    title: str

class TaskRead(BaseModel):
    id: UUID
    title: str
    completed: bool
    class Config:
        orm_mode = True

@app.get("/tasks", response_model=list[TaskRead])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.post("/tasks", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(title=task.title)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{task_id}/toggle", response_model=TaskRead)
def toggle_task(task_id: UUID, db: Session = Depends(get_db)):
    task = db.query(Task).get(task_id)
    if task:
        task.completed = not task.completed
        db.commit()
        db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: UUID, db: Session = Depends(get_db)):
    task = db.query(Task).get(task_id)
    if task:
        db.delete(task)
        db.commit()
    return {"message": "Deleted"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#class TaskUpdate(BaseModel):
#    completed: bool

#@app.patch("/tasks/{task_id}")
#def update_task_status(task_id: UUID, update: TaskUpdate):
#    db: Session = SessionLocal()
 #   task = db.query(Task).filter(Task.id == task_id).first()
 #   if not task:
  #      raise HTTPException(status_code=404, detail="Task not found")
   # task.completed = update.completed
    #db.commit()
    #db.refresh(task)
    #return task