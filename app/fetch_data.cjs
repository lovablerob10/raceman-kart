const fs = require('fs');
const https = require('https');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd3d3ZWZxYWJ6dGVobndnaHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzY5OTQsImV4cCI6MjA4NjExMjk5NH0._L7WEn-SmRX2Uiax_5R_sVfOAld63FTctIpUy5RdK0g';

function fetchUrl(urlPath, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'aawwwefqabztehnwghsj.supabase.co',
      path: urlPath,
      method: 'GET',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', () => {
        fs.writeFileSync(filename, data);
        console.log(`Saved ${filename}`);
        resolve();
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function run() {
  try {
    await fetchUrl('/rest/v1/pilots?select=*', 'src/data/fallbackPilots.json');
    await fetchUrl('/rest/v1/champions?select=*&order=year.desc', 'src/data/fallbackChampions.json');
    console.log('All done!');
  } catch (err) {
    console.error(err);
  }
}

run();
