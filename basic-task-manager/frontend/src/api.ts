import { Task } from './types'

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api'
const TASKS_URL = `${API_BASE}/tasks`

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(TASKS_URL)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return (await res.json()) as Task[]
}

export async function createTask(payload: { description: string; isCompleted?: boolean }): Promise<Task> {
  const res = await fetch(TASKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: payload.description, isCompleted: payload.isCompleted ?? false })
  })
  if (!res.ok) throw new Error('Failed to create task')
  return (await res.json()) as Task
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<void> {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, description: payload.description, isCompleted: payload.isCompleted })
  })
  if (!res.ok) throw new Error('Failed to update task')
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${TASKS_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}

// Use PUT for toggle as per assignment (PUT /api/tasks/{id}/toggle)
export async function toggleTask(id: number): Promise<void> {
  const res = await fetch(`${TASKS_URL}/${id}/toggle`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to toggle task')
}
