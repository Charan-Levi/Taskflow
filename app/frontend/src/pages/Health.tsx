import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, RefreshCw, Server, Database, Code2 } from 'lucide-react'
import { healthApi } from '../services/api'

interface ServiceStatus {
  name: string
  icon: typeof Server
  status: 'checking' | 'up' | 'down'
  detail?: string
}

export default function Health() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Java Backend (Spring Boot)', icon: Code2, status: 'checking' },
    { name: 'Python Backend (FastAPI)', icon: Code2, status: 'checking' },
    { name: 'PostgreSQL Database', icon: Database, status: 'checking' }
  ])

  const check = async () => {
    setServices((prev) => prev.map((s) => ({ ...s, status: 'checking' })))

    const [j, p] = await Promise.allSettled([healthApi.java(), healthApi.python()])

    setServices([
      {
        name: 'Java Backend (Spring Boot)',
        icon: Code2,
        status: j.status === 'fulfilled' ? 'up' : 'down',
        detail: j.status === 'fulfilled' ? `${j.value.status} · ${j.value.service}` : (j as PromiseRejectedResult).reason?.message
      },
      {
        name: 'Python Backend (FastAPI)',
        icon: Code2,
        status: p.status === 'fulfilled' ? 'up' : 'down',
        detail: p.status === 'fulfilled' ? `${p.value.status} · ${p.value.service}` : (p as PromiseRejectedResult).reason?.message
      },
      {
        name: 'PostgreSQL Database',
        icon: Database,
        status:
          j.status === 'fulfilled' && (j.value as { database?: string }).database
            ? 'up'
            : 'checking',
        detail:
          j.status === 'fulfilled'
            ? (j.value as { database?: string }).database || 'Connected via Java backend'
            : 'Unavailable'
      }
    ])
  }

  useEffect(() => {
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Health</h2>
          <p className="text-sm text-slate-500 mt-1">Live status of all services · auto-refresh every 15s</p>
        </div>
        <button onClick={check} className="btn-secondary">
          <RefreshCw className="h-4 w-4" />
          Check now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.name} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  <s.icon className="h-4.5 w-4.5 text-slate-600" />
                </div>
                <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
              </div>
              <StatusPill status={s.status} />
            </div>
            {s.detail && <div className="text-xs text-slate-500 truncate">{s.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: ServiceStatus['status'] }) {
  if (status === 'up')
    return (
      <span className="badge bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Healthy
      </span>
    )
  if (status === 'down')
    return (
      <span className="badge bg-red-100 text-red-700">
        <XCircle className="h-3 w-3" />
        Down
      </span>
    )
  return (
    <span className="badge bg-slate-100 text-slate-600">
      <RefreshCw className="h-3 w-3 animate-spin" />
      Checking
    </span>
  )
}
