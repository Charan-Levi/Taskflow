import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { taskApi, type Task, type TaskInput } from '../services/api'
import { StatusBadge } from './Dashboard'

const empty: TaskInput = { title: '', description: '', status: 'TODO', priority: 'MEDIUM' }

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [form, setForm] = useState<TaskInput>(empty)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | Task['status']>('ALL')

  const load = () => {
    setLoading(true)
    taskApi
      .list()
      .then(setTasks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await taskApi.update(editing.id, form)
        toast.success('Task updated')
      } else {
        await taskApi.create(form)
        toast.success('Task created')
      }
      setShowForm(false)
      setEditing(null)
      setForm(empty)
      load()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const onEdit = (t: Task) => {
    setEditing(t)
    setForm({ title: t.title, description: t.description, status: t.status, priority: t.priority })
    setShowForm(true)
  }

  const onDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await taskApi.remove(id)
      toast.success('Task deleted')
      load()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const filtered = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <p className="text-sm text-slate-500 mt-1">Create, update and manage your tasks</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setForm(empty)
            setShowForm(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | Task['status'])}
          >
            <option value="ALL">All statuses</option>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500 py-12 text-center">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-slate-500 py-12 text-center">No tasks match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="py-3 font-medium">Title</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Priority</th>
                  <th className="py-3 font-medium">Updated</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3">
                      <div className="font-medium text-slate-900">{t.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.description}</div>
                    </td>
                    <td className="py-3"><StatusBadge status={t.status} /></td>
                    <td className="py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3 text-xs text-slate-500">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onEdit(t)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editing ? 'Edit task' : 'New task'}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input min-h-[90px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
                >
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const map = {
    LOW: { label: 'Low', cls: 'bg-slate-100 text-slate-600' },
    MEDIUM: { label: 'Medium', cls: 'bg-blue-100 text-blue-700' },
    HIGH: { label: 'High', cls: 'bg-red-100 text-red-700' }
  } as const
  const { label, cls } = map[priority]
  return <span className={`badge ${cls}`}>{label}</span>
}

function Modal({
  children,
  title,
  onClose
}: {
  children: React.ReactNode
  title: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
