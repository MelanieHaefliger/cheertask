/* components/Tabs.js */
import { useState } from 'react';

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div className="tabs-wrap">
      {/* bar */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab ${active === t.key ? 'active' : ''}`}
            disabled={t.disabled}
            onClick={() => !t.disabled && setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* content */}
      <div className="tab-content">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}
