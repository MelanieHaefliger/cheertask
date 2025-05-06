// pages/test.js (using the Pages Router)
import { supabase } from '../lib/supabaseClient';

export default function TestPage() {
  async function fetchTasks() {
    console.log("Fetching tasks...");
    const { data, error } = await supabase.from('tasks').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Supabase Connection</h1>
      <button onClick={fetchTasks}>Fetch Tasks</button>
    </div>
  );
}

