// components/CalendarPlaceholder.js
import React from 'react'

export default function CalendarPlaceholder() {
  // Mon–Fri
  const days = ['Mon','Tue','Wed','Thu','Fri']
  // 9am–5pm
  const hours = Array.from({length:9}, (_,i) => 9 + i)

  // three dummy free slots
  const freeSlots = [
    { day: 0, start: 10, duration: 2 },
    { day: 2, start: 14, duration: 1 },
    { day: 4, start: 11, duration: 3 },
  ]

  return (
    <div className="card-shell">
      <h2>Calendar (mock)</h2>
      <div className="calendar-grid">
        {/* header row */}
        <div className="row header">
          <div></div>
          {days.map((d) => <div key={d}>{d}</div>)}
        </div>

        {/* time slots */}
        {hours.map((h) => (
          <React.Fragment key={h}>
            <div className="hour">{h}:00</div>
            {days.map((_, di) => {
              const slot = freeSlots.find(s => s.day === di && s.start === h)
              return slot ? (
                <div
                  key={di}
                  className="free-slot"
                  style={{
                    gridColumn: di + 2,
                    gridRow: hours.indexOf(h) + 2,
                    gridRowEnd: `span ${slot.duration}`
                  }}
                />
              ) : (
                <div key={di}></div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
