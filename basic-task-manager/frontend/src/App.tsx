import React, { useEffect, useState } from 'react'
import { Task } from './types'
import * as api from './api'
import AddTask from './components/AddTask'
import TaskList from './components/TaskList'

type Filter = 'all' | 'active' | 'completed'

const LS_KEY = 'basic-task-manager:tasks'

// local negative id generator for tasks created while backend is unavailable
let localIdCounter = -1

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [highlightedId, setHighlightedId] = useState<number | null>(null)

  // load from backend, fallback to localStorage
  useEffect(() => {
    let mounted = true
    api.getTasks().then(remote => {
      if (!mounted) return
      setTasks(remote)
      localStorage.setItem(LS_KEY, JSON.stringify(remote))
    }).catch(() => {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setTasks(JSON.parse(raw))
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks))
  }, [tasks])

  async function addTask(description: string) {
    setError(null)
    try {
      const created = await api.createTask({ description })
      setTasks(s => [...s, created])
      setHighlightedId(created.id)
      setTimeout(() => setHighlightedId(null), 2000)
    } catch (e) {
      // fallback: create locally
      const local = { id: localIdCounter--, description, isCompleted: false }
      setTasks((s: Task[]) => [...s, local])
      setHighlightedId(local.id)
      setTimeout(() => setHighlightedId(null), 2000)
      setError('Saved locally (backend unavailable)')
    }
  }

  async function editTask(id: number, description: string) {
    setError(null)
    try {
      await api.updateTask(id, { description })
      setTasks(s => s.map(t => t.id === id ? { ...t, description } : t))
    } catch {
      // fallback local
      setTasks(s => s.map(t => t.id === id ? { ...t, description } : t))
      setError('Edited locally (backend unavailable)')
    }
  }

  function reorderTasks(draggedId: number, targetId: number) {
    setTasks(prev => {
      const copy = [...prev]
      const from = copy.findIndex(t => t.id === draggedId)
      const to = copy.findIndex(t => t.id === targetId)
      if (from === -1 || to === -1) return prev
      const [item] = copy.splice(from, 1)
      copy.splice(to, 0, item)
      return copy
    })
  }

  async function clearCompleted() {
    setError(null)
    const completed = tasks.filter(t => t.isCompleted).map(t => t.id)
    // attempt to delete from backend, but always remove locally
    for (const id of completed) {
      try { await api.deleteTask(id) } catch { /* ignore */ }
    }
    setTasks(s => s.filter(t => !t.isCompleted))
  }

  async function deleteTask(id: number) {
    setError(null)
    try {
      await api.deleteTask(id)
      setTasks(s => s.filter(t => t.id !== id))
    } catch {
      // fallback: local delete
      setTasks(s => s.filter(t => t.id !== id))
      setError('Deleted locally (backend unavailable)')
    }
  }

  async function toggleTask(id: number) {
    setError(null)
    try {
      await api.toggleTask(id)
      setTasks(s => s.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    } catch {
      setTasks(s => s.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
      setError('Toggled locally (backend unavailable)')
    }
  }

  const filtered = tasks
    .filter(t => filter === 'all' || (filter === 'completed') === t.isCompleted || (filter === 'active' && !t.isCompleted))
    .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))

  const total = tasks.length
  const completedCount = tasks.filter(t => t.isCompleted).length
  const activeCount = total - completedCount

  return (
    <div className="container py-4">
      <h1 className="mb-3">Basic Task Manager</h1>
      <AddTask onAdd={addTask} />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="counts">
          <div className="muted-small">Total: <strong>{total}</strong></div>
          <div className="muted-small">Active: <strong>{activeCount}</strong></div>
          <div className="muted-small">Completed: <strong>{completedCount}</strong></div>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control form-control-sm search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="btn-group" role="group">
            <button className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`btn btn-outline-secondary ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
            <button className={`btn btn-outline-secondary ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="mb-2 d-flex justify-content-end">
        <button className="btn btn-sm btn-outline-danger" onClick={clearCompleted} disabled={completedCount === 0}>Clear completed</button>
      </div>

      <TaskList tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} onReorder={reorderTasks} highlightedId={highlightedId} />
    </div>
  )
}
