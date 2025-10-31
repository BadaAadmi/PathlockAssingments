import React, { useState, useRef } from 'react'
import { Task } from '../types'

type Props = {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, description: string) => void
  onReorder: (draggedId: number, targetId: number) => void
  highlighted?: boolean
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, onReorder, highlighted }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(task.description)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function save() {
    const v = value.trim()
    if (!v) return
    if (v !== task.description) onEdit(task.id, v)
    setEditing(false)
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setValue(task.description); setEditing(false) }
  }

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${highlighted ? 'task-new' : ''}`}
      draggable
      onDragStart={e => e.dataTransfer.setData('text/plain', String(task.id))}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault()
        const dragged = Number(e.dataTransfer.getData('text/plain'))
        if (!Number.isNaN(dragged) && dragged !== task.id) onReorder(dragged, task.id)
      }}
    >
      <div style={{ flex: 1 }}>
        <input className="form-check-input me-2" type="checkbox" checked={task.isCompleted} onChange={() => onToggle(task.id)} />
        {!editing ? (
          <span onDoubleClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 50) }} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>{task.description}</span>
        ) : (
          <input ref={inputRef} className="task-edit-input" value={value} onChange={e => setValue(e.target.value)} onKeyDown={onKey} onBlur={save} />
        )}
      </div>
      <div>
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditing(s => !s)}>{editing ? 'Cancel' : 'Edit'}</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  )
}
