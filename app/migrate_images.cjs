const fs = require('fs');
const https = require('https');
const path = require('path');
const sharp = require('sharp');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd3d3ZWZxYWJ6dGVobndnaHNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzNjk5NCwiZXhwIjoyMDg2MTEyOTk0fQ.POZW7eL5Ym0S8fczclDnPk1xS5DWjszjCjlaBzIwPX8';
const SUPABASE_HOST = 'aawwwefqabztehnwghsj.supabase.co';
const SUPABASE_URL = `https://${SUPABASE_HOST}`;

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function httpRequest(method, urlPath, body, contentType = 'application/json') {
  return new Promise((resolve, reject) => {
    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    };
    if (contentType) headers['Content-Type'] = contentType;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);

    const req = https.request({
      hostname: SUPABASE_HOST,
      path: urlPath,
      method,
      headers
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadImage(folder, fileName, imageBuffer) {
  const storagePath = `/storage/v1/object/photos/${folder}/${fileName}`;
  
  return new Promise((resolve, reject) => {
    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'x-upsert': 'true'
    };

    const req = https.request({
      hostname: SUPABASE_HOST,
      path: storagePath,
      method: 'POST',
      headers
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(imageBuffer);
    req.end();
  });
}

async function updateRecord(table, id, field, url) {
  const body = JSON.stringify({ [field]: url });
  const res = await httpRequest(
    'PATCH',
    `/rest/v1/${table}?id=eq.${id}`,
    body,
    'application/json'
  );
  return res;
}

async function processBase64Image(base64String) {
  // Remove data:image/xxx;base64, prefix
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Compress to JPEG, max 800px wide, quality 75
  const compressed = await sharp(buffer)
    .resize(800, null, { withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer();
  
  return compressed;
}

async function run() {
  console.log('=== RACEMAN KART IMAGE MIGRATION ===\n');

  // --- PILOTS ---
  console.log('📸 Processing PILOTS...');
  const pilots = JSON.parse(fs.readFileSync('src/data/pilots.json', 'utf8'));
  let pilotCount = 0;
  let pilotErrors = 0;

  for (const pilot of pilots) {
    if (!pilot.photo_url || pilot.photo_url.length < 500) {
      continue; // Not a base64 string, skip
    }

    const slug = slugify(pilot.name);
    const fileName = `${slug}.jpg`;
    
    try {
      console.log(`  🔄 ${pilot.name} (${(pilot.photo_url.length / 1024).toFixed(0)} KB base64)...`);
      
      // Compress
      const compressed = await processBase64Image(pilot.photo_url);
      console.log(`     ✅ Compressed: ${(compressed.length / 1024).toFixed(0)} KB`);
      
      // Upload to Storage
      const uploadRes = await uploadImage('pilots', fileName, compressed);
      if (uploadRes.status !== 200) {
        console.log(`     ⚠️ Upload status: ${uploadRes.status} ${uploadRes.body}`);
        pilotErrors++;
        continue;
      }
      console.log(`     ✅ Uploaded to Storage`);
      
      // Get public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/photos/pilots/${fileName}`;
      
      // Update DB record
      const updateRes = await updateRecord('pilots', pilot.id, 'photo_url', publicUrl);
      console.log(`     ✅ DB updated (${updateRes.status}) → ${publicUrl}`);
      
      pilotCount++;
      
      // Small delay to not overwhelm the API
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`     ❌ Error: ${err.message}`);
      pilotErrors++;
    }
  }

  console.log(`\n📊 Pilots: ${pilotCount} migrated, ${pilotErrors} errors\n`);

  // --- CHAMPIONS ---
  console.log('🏆 Processing CHAMPIONS...');
  const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));
  let champCount = 0;
  let champErrors = 0;

  for (const champ of champions) {
    if (!champ.image_url || champ.image_url.length < 500) {
      continue; // Not a base64 string, skip
    }

    const slug = `${champ.year}-${slugify(champ.pilot_name)}-${slugify(champ.category || 'geral')}`;
    const fileName = `${slug}.jpg`;
    
    try {
      console.log(`  🔄 ${champ.pilot_name} (${champ.year}) (${(champ.image_url.length / 1024).toFixed(0)} KB base64)...`);
      
      // Compress
      const compressed = await processBase64Image(champ.image_url);
      console.log(`     ✅ Compressed: ${(compressed.length / 1024).toFixed(0)} KB`);
      
      // Upload to Storage
      const uploadRes = await uploadImage('champions', fileName, compressed);
      if (uploadRes.status !== 200) {
        console.log(`     ⚠️ Upload status: ${uploadRes.status} ${uploadRes.body}`);
        champErrors++;
        continue;
      }
      console.log(`     ✅ Uploaded to Storage`);
      
      // Get public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/photos/champions/${fileName}`;
      
      // Update DB record
      const updateRes = await updateRecord('champions', champ.id, 'image_url', publicUrl);
      console.log(`     ✅ DB updated (${updateRes.status}) → ${publicUrl}`);
      
      champCount++;
      
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`     ❌ Error: ${err.message}`);
      champErrors++;
    }
  }

  console.log(`\n📊 Champions: ${champCount} migrated, ${champErrors} errors`);
  console.log(`\n🎉 MIGRATION COMPLETE!`);
  console.log(`   Total: ${pilotCount + champCount} images migrated to Supabase Storage`);
}

run().catch(console.error);
