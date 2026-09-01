import axios, { AxiosInstance } from 'axios'

const javaClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_JAVA_API_URL || '/api/java',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

const pythonClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_API_URL || '/api/python',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

;[javaClient, pythonClient].forEach((client) => {
  client.interceptors.response.use(
    (r) => r,
    (err) => {
      const message =
        err.response?.data?.message || err.message || 'Network error'
      return Promise.reject(new Error(message))
    }
  )
})

export interface Task {
  id: number
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
}

export interface AnalyticsSummary {
  totalTasks: number
  completed: number
  inProgress: number
  todo: number
  completionRate: number
  highPriority: number
  averageCompletionTimeHours: number
  tasksByDay: { date: string; count: number }[]
  tasksByPriority: { priority: string; count: number }[]
}

export const taskApi = {
  list: () => javaClient.get<Task[]>('/tasks').then((r) => r.data),
  get: (id: number) => javaClient.get<Task>(`/tasks/${id}`).then((r) => r.data),
  create: (data: TaskInput) => javaClient.post<Task>('/tasks', data).then((r) => r.data),
  update: (id: number, data: Partial<TaskInput>) =>
    javaClient.put<Task>(`/tasks/${id}`, data).then((r) => r.data),
  remove: (id: number) => javaClient.delete(`/tasks/${id}`).then((r) => r.data)
}

export const analyticsApi = {
  summary: () => pythonClient.get<AnalyticsSummary>('/analytics/summary').then((r) => r.data),
  insights: () => pythonClient.get<{ insights: string[] }>('/analytics/insights').then((r) => r.data)
}

export const healthApi = {
  java: () => javaClient.get('/health').then((r) => r.data),
  python: () => pythonClient.get('/health').then((r) => r.data)
}

export { javaClient, pythonClient }
