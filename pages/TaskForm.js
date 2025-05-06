// pages/TaskForm.js
import React, { useState, useEffect } from 'react'
import { supabase }                   from '../lib/supabaseClient'

export default function TaskForm({ initialData, close }) {
  // ─── form state ──────────────────────────
  const [title,    setTitle]    = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('low')
  const [duration, setDur]      = useState('')
  const [desc,     setDesc]     = useState('')
  const [busy,     setBusy]     = useState(false)

  // preload when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      // strip seconds so datetime-local shows correctly
      setDeadline(initialData.deadline.slice(0,16))
      setPriority(initialData.priority)
      setDur(initialData.estimated_duration?.toString() || '')
      setDesc(initialData.description || '')
    }
  }, [initialData])

  // ─── submit handler ───────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)

    const payload = {
      title,
      deadline,
      priority,
      estimated_duration: duration ? Number(duration) : null,
      description: desc || null,
      done: initialData?.done || false
    }

    let res
    if (initialData) {
      res = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', initialData.id)
    } else {
      res = await supabase
        .from('tasks')
        .insert([payload])
    }

    setBusy(false)

    if (res.error) {
      alert(`Could not save task 🙈\n${res.error.message}`)
    } else {
      // <-- use the provided close() callback
      close()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{initialData ? 'Edit Task' : 'New Task'}</h2>

      <div className="form-grid">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Deadline
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
          />
        </label>

        <label>
          Priority
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Duration (min)
          <select
            value={duration}
            onChange={e => setDur(e.target.value)}
          >
            <option value="">—</option>
            {[15,30,45,60,90,120,150,180].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="full">
          Description (optional)
          <textarea
            rows="3"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="cta-primary" disabled={busy}>
          {busy ? 'Saving…' : initialData ? 'Save' : 'Save Task'}
        </button>
        <button type="button" onClick={() => close()}>
          Cancel
        </button>
      </div>
    </form>
  )
}
