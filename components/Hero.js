// components/Hero.js
import Image from 'next/image';

export default function Hero({ onAddTask }) {
  return (
    <section className="hero">
      <Image
        src="/cheertask-logo.svg"
        alt="CheerTask logo"
        width={72}
        height={72}
      />

      <h1>CheerTask</h1>
      <p className="tagline">
        Task planning <strong>without the overwhelm</strong>.
        Smart priority, calendar-aware scheduling, and instant clarity. ✨
      </p>

      <ul className="benefits">
        <li>⚡ Automatic “what should I do next?” sorting</li>
        <li>🗓️ Seamless calendar-sync & free-slot finder</li>
        <li>🤝 Plan with friends & family – no endless polls</li>
      </ul>

      <button className="btn-primary big" onClick={onAddTask}>
        Add my first task
      </button>
    </section>
  );
}
