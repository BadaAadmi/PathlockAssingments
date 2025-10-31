import React, { useState, useRef, useEffect } from 'react'

type Props = {
  onAdd: (description: string) => void
}

export default function AddTask({ onAdd }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    onAdd(v)
    setText('')
  }
  return (
    <form className="d-flex mb-3" onSubmit={submit}>
      <input ref={ref} className="form-control me-2" placeholder="New task (press Enter to add)" value={text} onChange={e => setText(e.target.value)} />
      <button className="btn btn-primary" type="submit">Add</button>
    </form>
  )
}
