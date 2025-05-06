import { useState } from 'react';
import TaskForm  from './TaskForm';
import TaskList  from './TaskList';

export default function TaskTabs() {
  const [tab, setTab] = useState('add');  // 'add' | 'list'

  return (
    <>
      <nav className="tabs">
        <button
          onClick={() => setTab('add')}
          className={tab==='add' ? 'tab active' : 'tab'}
        >➕ Add Task</button>

        <button
          onClick={() => setTab('list')}
          className={tab==='list' ? 'tab active' : 'tab'}
        >📋 My Tasks</button>
      </nav>

      {tab === 'add'  && <TaskForm onSaved={() => setTab('list')} />}
      {tab === 'list' && <TaskList />}
    </>
  );
}
