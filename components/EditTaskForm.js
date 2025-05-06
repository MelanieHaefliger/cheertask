// components/EditTaskForm.js
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EditTaskForm({ task, onSave, onClose }) {
  // ─── form state ───────────────────────────────────────────
  const [title, setTitle]                 = useState('')
  const [deadline, setDeadline]           = useState('')
  const [priority, setPriority]           = useState('low')
  const [estimatedDuration, setDuration]  = useState('')
  const [description, setDescription]     = useState('')
  const [saving, setSaving]               = useState(false)

  // initialize state from the incoming `task` prop
  useEffect(() => {
    if (!task) return
    setTitle(task.title)
    // slice to “YYYY-MM-DDThh:mm” for the <input type="datetime-local">
    setDeadline(task.deadline?.slice(0,16) || '')
    setPriority(task.priority)
    setDuration(task.estimated_duration ?? '')
    setDescription(task.description ?? '')
  }, [task])

  // ─── dropdown options ─────────────────────────────────────
  const priorityOptions = [
    { value:'low',    label:'Low'    },
    { value:'medium', label:'Medium' },
    { value:'high',   label:'High'   },
  ]
  const timeOptions = [15,30,45,60,90,120,150,180].map(min => ({
    value: min,
    label: min < 60
      ? `${min} min`
      : min % 60 === 0
        ? `${min/60} h`
        : `${Math.floor(min/60)} h ${min%60} min`
  }))

  // ─── submit handler ──────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const updates = {
      title,
      deadline,                     // “YYYY-MM-DDThh:mm”
      priority,
      estimated_duration: estimatedDuration
        ? Number(estimatedDuration)
        : null,
      description: description || null
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', task.id)
      .single()

    setSaving(false)

    if (error) {
      console.error('Update error:', error)
      alert('Could not update task. See console.')
    } else {
      onSave(data)   // pass the updated row back up to TaskList
    }
  }

  // ─── JSX ──────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="task-form form-grid">
      <h2>Edit Task</h2>

      {/* Title */}
      <label className="full">
        Title
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </label>

      {/* Deadline */}
      <label>
        Deadline
        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
      </label>

      {/* Priority */}
      <label>
        Priority
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          required
        >
          {priorityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Estimated Duration */}
      <label>
        Duration (min)
        <select
          value={estimatedDuration}
          onChange={e => setDuration(e.target.value)}
        >
          <option value="">—</option>
          {timeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Description */}
      <label className="full">
        Description (optional)
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      {/* Actions */}
      <div className="actions full">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save task'}
        </button>
      </div>
    </form>
  )
}
