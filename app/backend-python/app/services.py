from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.models import Task
from app.schemas import AnalyticsSummary, TasksByDay, TasksByPriority
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

def get_summary(db: Session) -> AnalyticsSummary:
    total = db.query(func.count(Task.id)).scalar() or 0
    completed = db.query(func.count(case((Task.status == "DONE", 1)))).scalar() or 0
    in_progress = db.query(func.count(case((Task.status == "IN_PROGRESS", 1)))).scalar() or 0
    todo = db.query(func.count(case((Task.status == "TODO", 1)))).scalar() or 0
    high_priority = db.query(func.count(case((Task.priority == "HIGH", 1)))).scalar() or 0

    completion_rate = (completed / total) if total > 0 else 0.0

    done_tasks = db.query(Task).filter(Task.status == "DONE").all()
    if done_tasks and len(done_tasks) > 0:
        total_hours = sum(
            (t.updated_at - t.created_at).total_seconds() / 3600
            for t in done_tasks
            if t.updated_at and t.created_at
        )
        avg_hours = total_hours / len(done_tasks)
    else:
        avg_hours = 0.0

    utc = ZoneInfo("UTC")
    seven_days_ago = datetime.now(utc) - timedelta(days=7)
    daily_counts = (
        db.query(
            func.date(Task.created_at).label("date"),
            func.count(Task.id).label("count")
        )
        .filter(Task.created_at >= seven_days_ago)
        .group_by(func.date(Task.created_at))
        .order_by(func.date(Task.created_at))
        .all()
    )
    tasks_by_day = [TasksByDay(date=str(r.date), count=r.count) for r in daily_counts]

    priority_counts = (
        db.query(Task.priority, func.count(Task.id).label("count"))
        .group_by(Task.priority)
        .all()
    )
    tasks_by_priority = [TasksByPriority(priority=r.priority, count=r.count) for r in priority_counts]

    return AnalyticsSummary(
        totalTasks=total,
        completed=completed,
        inProgress=in_progress,
        todo=todo,
        completionRate=completion_rate,
        highPriority=high_priority,
        averageCompletionTimeHours=round(avg_hours, 2),
        tasksByDay=tasks_by_day,
        tasksByPriority=tasks_by_priority
    )

def get_insights(db: Session) -> list[str]:
    total = db.query(func.count(Task.id)).scalar() or 0
    completed = db.query(func.count(case((Task.status == "DONE", 1)))).scalar() or 0
    high_priority_undone = (
        db.query(func.count(Task.id))
        .filter(Task.priority == "HIGH", Task.status != "DONE")
        .scalar() or 0
    )

    insights = []
    if total == 0:
        insights.append("No tasks yet. Start by creating your first task!")
    else:
        rate = (completed / total) * 100 if total > 0 else 0
        if rate >= 80:
            insights.append(f"Great progress! You've completed {rate:.0f}% of your tasks.")
        elif rate >= 50:
            insights.append(f"You're halfway there with {rate:.0f}% completed. Keep going!")
        else:
            insights.append(f"Focus mode: only {rate:.0f}% done. Try to prioritize pending work.")

    if high_priority_undone > 0:
        insights.append(f"You have {high_priority_undone} high-priority task(s) still in progress.")

    if total >= 10 and completed < total * 0.3:
        insights.append("Consider breaking larger tasks into smaller sub-tasks for better progress tracking.")

    if completed > 0 and high_priority_undone == 0:
        insights.append("All high-priority tasks are done. Excellent prioritization!")

    if not insights:
        insights.append("Keep adding tasks to get personalized insights.")
    return insights
