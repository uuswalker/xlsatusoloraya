const fs=require('fs'),crypto=require('crypto');
if(!process.argv[2]){console.error('usage: node tools/hash-leads.js leads.csv > upload.csv');process.exit(1);}
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n');
const out=['hashed_phone,conversion_name,conversion_time'];
for(let i=1;i<rows.length;i++){
  if(!rows[i].trim()) continue;
  const cols=rows[i].split(',');
  const wa=cols[0]||'';
  const ts=cols[1]||new Date().toISOString();
  const clean=String(wa).replace(/\D/g,'').replace(/^0/,'62').trim();
  if(clean.length<9) continue;
  const e164='+'+clean;
  const hash=crypto.createHash('sha256').update(e164.trim().toLowerCase()).digest('hex');
  let t;
  try{ t=new Date(ts); if(isNaN(t)) throw 0; t=t.toISOString().replace('T',' ').slice(0,19)+'+07:00'; }catch(e){ t=new Date().toISOString().replace('T',' ').slice(0,19)+'+07:00'; }
  out.push(`${hash},uoD7CPXb27ADEN7y1b8D,${t}`);
}
process.stdout.write(out.join('\n')+'\n');
console.error(`wrote ${out.length-1} rows`);
