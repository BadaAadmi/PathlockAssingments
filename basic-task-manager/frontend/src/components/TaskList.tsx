import React from 'react'
import { Task } from '../types'
import TaskItem from './TaskItem'

type Props = {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, description: string) => void
  onReorder: (draggedId: number, targetId: number) => void
  highlightedId?: number | null
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder, highlightedId }: Props) {
  if (tasks.length === 0) return <div className="text-muted">No tasks</div>
  return (
    <ul className="list-group">
      {tasks.map(t => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} onReorder={onReorder} highlighted={highlightedId === t.id} />
      ))}
    </ul>
  )
}
