const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://aawwwefqabztehnwghsj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd3d3ZWZxYWJ6dGVobndnaHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzY5OTQsImV4cCI6MjA4NjExMjk5NH0._L7WEn-SmRX2Uiax_5R_sVfOAld63FTctIpUy5RdK0g'
);

async function fetchWithRetry(table, select, order, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    console.log(`[${table}] Attempt ${i}...`);
    let query = supabase.from(table).select(select);
    if (order) query = query.order(order.col, { ascending: order.asc });
    const { data, error } = await query;
    if (!error && data) return data;
    console.log(`[${table}] Error:`, error?.message);
    if (i < retries) await new Promise(r => setTimeout(r, 2000));
  }
  return [];
}

(async () => {
  // Fetch pilots
  const pilots = await fetchWithRetry('pilots', '*', { col: 'name', asc: true });
  fs.writeFileSync('src/data/pilots.json', JSON.stringify(pilots, null, 2));
  console.log('Pilots saved:', pilots.length);

  // Fetch champions
  const champions = await fetchWithRetry('champions', '*', { col: 'year', asc: false });
  fs.writeFileSync('src/data/champions.json', JSON.stringify(champions, null, 2));
  console.log('Champions saved:', champions.length);

  // Fetch standings with pilot join
  const standings = await fetchWithRetry(
    'standings',
    'id,points,position,category,pilot:pilot_id(name,photo_url)',
    { col: 'points', asc: false }
  );
  fs.writeFileSync('src/data/standings.json', JSON.stringify(standings, null, 2));
  console.log('Standings saved:', standings.length);

  console.log('\nAll data saved to src/data/');
})();
