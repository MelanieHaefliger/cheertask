// pages/TaskList.js
import { useEffect, useMemo, useState } from 'react'
import { supabase }                     from '../lib/supabaseClient'
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd'
import confetti              from 'canvas-confetti'
import { FaPen, FaTrash }    from 'react-icons/fa'

/* confetti + teddy-bear */
const fireConfetti = () => {
  const end = Date.now() + 500
  const colors = ['#FF37A6', '#43B929', '#FFCAE9']

  ;(function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()

  confetti({
    particleCount: 25,
    spread: 75,
    ticks: 500,
    origin: { y: 0.25 },
    shapes: ['emoji'],
    emojis: ['🐻', '🎉'],
    scalar: 1.2
  })
}

/* scoring helper */
const prioWeight = (p) =>
  p === 'high' ? 3 : p === 'medium' ? 2 : 1

const score = (t) => {
  const hrsLeft = (new Date(t.deadline).getTime() - Date.now()) / 3_600_000
  return hrsLeft <= 0 ? -Infinity : prioWeight(t.priority) / hrsLeft
}

export default function TaskList() {
  const [tasks, setTasks] = useState([])

  /* 1) fetch initial tasks */
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('tasks').select('*')
      if (data) setTasks(data)
    })()
  }, [])

  /* 2) realtime subscription (upsert + delete) */
  useEffect(() => {
    const channel = supabase
      .channel('tasks-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        ({ new: row, old }) => {
          setTasks((prev) => {
            if (row) {
              const without = prev.filter((t) => t.id !== row.id)
              return [...without, row]
            }
            return prev.filter((t) => t.id !== old.id)
          })
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  /* 3) separate into “to do” vs “done” */
  const sorted   = useMemo(
    () =>
      [...tasks]
        .filter((t) => !t.done)
        .sort((a, b) => score(b) - score(a)),
    [tasks]
  )
  const finished = useMemo(() => tasks.filter((t) => t.done), [tasks])

  /* 4) toggle done + confetti */
  const toggle = async (id, done) => {
    await supabase.from('tasks').update({ done }).eq('id', id)
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done } : t))
    )
    if (done) fireConfetti()
  }

  /* 5) manual drag-and-drop */
  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(sorted)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setTasks((prev) => {
      const doneOnes = prev.filter((t) => t.done)
      return [...items, ...doneOnes]
    })
  }

  /* 6) edit handler stub */
  const handleEdit = (task) => {
    // TODO: wire this up to your modal
    alert(`Edit task #${task.id}: "${task.title}"`)
  }

  /* 7) delete handler */
  const handleDelete = async (id) => {
    // remove from DB
    await supabase.from('tasks').delete().eq('id', id)
    // update local state
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  /* 8) row renderer */
  const row = (t, i, prov) => (
    <div
      ref={prov.innerRef}
      {...prov.draggableProps}
      {...prov.dragHandleProps}
      className="trow"
      style={prov.draggableProps.style}
    >
      <span className="drag-col">⋮⋮</span>
      <span className={t.done ? 'done-title' : ''}>{t.title}</span>
      <span>{new Date(t.deadline).toLocaleString()}</span>
      <span>
        <span className={`badge prio-${t.priority}`}>{t.priority}</span>
      </span>
      <span>{t.estimated_duration ? `${t.estimated_duration} min` : '—'}</span>
      {/* checkbox */}
      <span>
        <input
          type="checkbox"
          className="round-check"
          checked={!!t.done}
          onChange={() => toggle(t.id, !t.done)}
        />
      </span>
      {/* edit pen */}
      <span className="edit-col" onClick={() => handleEdit(t)}>
        <FaPen />
      </span>
      {/* delete trash */}
      <span className="delete-col" onClick={() => handleDelete(t.id)}>
        <FaTrash />
      </span>
    </div>
  )

  /* 9) render */
  return (
    <section className="card-shell">
      <h2 style={{ marginBottom: '.8rem' }}>Tasks</h2>
      <button className="smart-btn" onClick={() => setTasks(sorted)}>
        Smart sort
      </button>

      <div className="table">
        <div className="thead">
          <span></span>
          <span>Title</span>
          <span>Due</span>
          <span>Prio</span>
          <span>Dur</span>
          <span></span>
          <span></span>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="live">
            {(prov) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>
                {sorted.map((t, i) => (
                  <Draggable key={t.id} draggableId={String(t.id)} index={i}>
                    {(p) => row(t, i, p)}
                  </Draggable>
                ))}
                {prov.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {finished.length > 0 && (
        <details className="completed-block">
          <summary>Completed ({finished.length})</summary>
          {finished.map((t) => (
            <div
              key={t.id}
              className="trow"
              style={{ gridTemplateColumns: '1fr 38px' }}
            >
              <span className="done-title">{t.title}</span>
              <span>
                <input
                  type="checkbox"
                  className="round-check"
                  checked
                  onChange={() => toggle(t.id, false)}
                />
              </span>
            </div>
          ))}
        </details>
      )}
    </section>
  )
}
