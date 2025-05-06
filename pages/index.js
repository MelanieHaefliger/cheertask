// pages/index.js
import { useState } from 'react'
import Image    from 'next/image'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Tabs     from '../components/Tabs'
import CalendarPlaceholder from '../components/CalendarPlaceholder'
import './styles/cheertask.css'

export default function HomePage() {
  // state for “new” vs “edit” modal
  const [showForm, setShowForm] = useState(false)
  const [initialData, setInitialData] = useState(null)

  // open blank form
  const handleAdd = () => {
    setInitialData(null)
    setShowForm(true)
  }
  // open edit form for task t
  const handleEdit = (t) => {
    setInitialData(t)
    setShowForm(true)
  }

  const tabs = [
    {
      key: 'tasks',
      label: 'Tasks',
      // pass our edit handler down
      content: <TaskList onEdit={handleEdit} />
    },
    {
      key: 'calendar',
      label: 'Calendar',
      content: <CalendarPlaceholder />,
      disabled: false
    }
  ]

  const benefits = [
    '⚡ Automatic “what-should-I-do-next?” sort',
    '🗓️ Seamless calendar-sync',
    '🤖 AI free-slot finder',
    '🤝 Plan with friends – skip the polls'
  ]

  return (
    <div className="page-container">
      {/* ───── HEADER ───── */}
      <header className="app-header">
        <Image src="/cheertask-logo.svg" alt="logo" width={48} height={48} />
        <span className="brand-name">CheerTask</span>
      </header>

      {/* ───── HERO ───── */}
      <section className="hero-band">
        <span className="headline">Make tasks feel fun and get things done!</span>
        <span className="subline">
          Turn chaos into cheerful progress.<br/>
          AI sorts and schedules for you.
        </span>

        <div className="benefit-grid">
          {benefits.map(b => (
            <div key={b} className="benefit-tile">{b}</div>
          ))}
        </div>

        <button className="cta-primary" onClick={handleAdd}>
          Add&nbsp;task
        </button>
      </section>

      {/* ───── TABS ───── */}
      <Tabs tabs={tabs} />

      {/* ───── MODAL FORM ───── */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              ✕
            </button>
            {/* Pass initialData (null = new, object = edit) */}
            <TaskForm
              initialData={initialData}
              close={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
