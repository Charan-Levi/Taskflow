import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { taskApi, analyticsApi, type Task, type AnalyticsSummary } from '../services/api'

interface Stat {
  label: string
  value: string | number
  icon: typeof CheckCircle2
  color: string
  bg: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([taskApi.list(), analyticsApi.summary()])
      .then(([t, a]) => {
        if (t.status === 'fulfilled') setTasks(t.value)
        if (a.status === 'fulfilled') setSummary(a.value)
      })
      .finally(() => setLoading(false))
  }, [])

  const stats: Stat[] = [
    {
      label: 'Total Tasks',
      value: summary?.totalTasks ?? tasks.length,
      icon: ListTodo,
      color: 'text-brand-600',
      bg: 'bg-brand-50'
    },
    {
      label: 'In Progress',
      value: summary?.inProgress ?? tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Completed',
      value: summary?.completed ?? tasks.filter((t) => t.status === 'DONE').length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Completion Rate',
      value: summary ? `${(summary.completionRate * 100).toFixed(0)}%` : '0%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ]

  const recent = tasks.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Overview of your tasks and system metrics</p>
        </div>
        <Link
          to="/tasks"
          className="btn-primary"
        >
          Manage tasks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">{s.label}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{s.value}</div>
              </div>
              <div className={`h-11 w-11 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent tasks</h3>
            <Link to="/tasks" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="text-sm text-slate-500 py-8 text-center">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="text-sm text-slate-500 py-8 text-center">
              No tasks yet. Create your first task to get started.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{t.description}</div>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System architecture</h3>
          <ul className="space-y-3 text-sm">
            <ArchItem label="React Frontend" detail="Vite + TypeScript + Tailwind" status="ok" />
            <ArchItem label="Java Backend" detail="Spring Boot · CRUD API" status="ok" />
            <ArchItem label="Python Backend" detail="FastAPI · Analytics" status="ok" />
            <ArchItem label="PostgreSQL" detail="Persistent storage" status="ok" />
          </ul>
        </div>
      </div>
    </div>
  )
}

function ArchItem({ label, detail, status }: { label: string; detail: string; status: 'ok' | 'warn' | 'err' }) {
  const colors = {
    ok: 'bg-emerald-500',
    warn: 'bg-amber-500',
    err: 'bg-red-500'
  }
  return (
    <li className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">{detail}</div>
      </div>
      <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
    </li>
  )
}

export function StatusBadge({ status }: { status: Task['status'] }) {
  const map = {
    TODO: { label: 'To do', cls: 'bg-slate-100 text-slate-700' },
    IN_PROGRESS: { label: 'In progress', cls: 'bg-amber-100 text-amber-700' },
    DONE: { label: 'Done', cls: 'bg-emerald-100 text-emerald-700' }
  } as const
  const { label, cls } = map[status]
  return <span className={`badge ${cls}`}>{label}</span>
}
