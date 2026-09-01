from pydantic import BaseModel
from datetime import datetime
from typing import List

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TasksByDay(BaseModel):
    date: str
    count: int

class TasksByPriority(BaseModel):
    priority: str
    count: int

class AnalyticsSummary(BaseModel):
    totalTasks: int
    completed: int
    inProgress: int
    todo: int
    completionRate: float
    highPriority: int
    averageCompletionTimeHours: float
    tasksByDay: List[TasksByDay]
    tasksByPriority: List[TasksByPriority]

class InsightsResponse(BaseModel):
    insights: List[str]
