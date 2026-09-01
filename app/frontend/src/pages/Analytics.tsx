import { useEffect, useState } from 'react'
import { Lightbulb, RefreshCw } from 'lucide-react'
import { analyticsApi, type AnalyticsSummary } from '../services/api'

export default function Analytics() {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.allSettled([analyticsApi.summary(), analyticsApi.insights()])
      .then(([s, i]) => {
        if (s.status === 'fulfilled') setData(s.value)
        if (i.status === 'fulfilled') setInsights(i.value.insights)
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">
            Insights powered by the Python analytics service
          </p>
        </div>
        <button onClick={load} className="btn-secondary">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card text-sm text-slate-500 text-center py-12">Loading analytics…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPI
              label="Completion rate"
              value={`${((data?.completionRate ?? 0) * 100).toFixed(0)}%`}
              accent="from-emerald-500 to-teal-500"
            />
            <KPI
              label="Avg. completion time"
              value={`${(data?.averageCompletionTimeHours ?? 0).toFixed(1)} h`}
              accent="from-brand-500 to-purple-500"
            />
            <KPI
              label="High priority tasks"
              value={data?.highPriority ?? 0}
              accent="from-red-500 to-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tasks by priority</h3>
              <BarList
                items={data?.tasksByPriority?.map((x) => ({ label: x.priority, value: x.count })) ?? []}
                color="bg-brand-500"
              />
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tasks created (last 7 days)</h3>
              <BarList
                items={data?.tasksByDay?.map((x) => ({ label: x.date, value: x.count })) ?? []}
                color="bg-emerald-500"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900">Smart insights</h3>
            </div>
            {insights.length === 0 ? (
              <div className="text-sm text-slate-500">No insights available yet.</div>
            ) : (
              <ul className="space-y-2">
                {insights.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function KPI({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
    </div>
  )
}

function BarList({ items, color }: { items: { label: string; value: number }[]; color: string }) {
  if (items.length === 0)
    return <div className="text-sm text-slate-500">No data available yet.</div>
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-slate-700">{it.label}</span>
            <span className="text-slate-500">{it.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-700`}
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
