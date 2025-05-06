// lib/ordering.js
import { supabase } from './supabaseClient'

/**
 * Returns the next integer for the `order` column by finding
 * the current maximum and adding one.
 */
export async function nextOrderValue() {
  const { data, error } = await supabase
    .from('tasks')
    .select('order')
    .order('order', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('nextOrderValue error:', error.message)
    // fallback to 1 so inserts still work
    return 1
  }

  // if no rows yet, start at 1
  const maxOrder = data?.order
  return typeof maxOrder === 'number' ? maxOrder + 1 : 1
}
