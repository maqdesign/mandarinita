import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const dryRun=process.argv.includes('--dry-run');
const manifest=JSON.parse(readFileSync('content/notion-originals-manifest.json','utf8'));
const browser=await chromium.launch({headless:true});
const log=[];
const mimeByMagic = bytes => {
 if(bytes.length>8 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
 if(bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) return 'image/jpeg';
 if(bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP') return 'image/webp';
 return 'unknown';
};
try {
 for(const episode of manifest.episodes){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const url='https://mandarinita.notion.site/'+new URL(episode.notionUrl).pathname.split('/').pop();
  const downloads=new Map();
  const pending=[];
  page.on('response',response => {
   if(response.status()!==200 || !/notionusercontent\.com/.test(response.url())) return;
   const id=episode.panels.map(panel=>panel.notionFileBlock.match(/^notion-file-block:\/\/[^/]+\/([^?]+)/)?.[1]).find(id=>id && response.url().includes(id));
   if(!id)return;
   pending.push(response.body().then(bytes=>downloads.set(id,Buffer.from(bytes))).catch(()=>{}));
  });
  const pageResponse=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(7000);
  const loaded=await page.evaluate(() => [...document.images].map(img=>({src:img.currentSrc || img.src,loaded:img.naturalWidth>0})));
  console.log('Source diagnostic '+JSON.stringify({number:episode.episodeNumber,http:pageResponse.status(),title:await page.title(),imgCount:loaded.length,matching:episode.panels.map(panel=>{const id=panel.notionFileBlock.match(/^notion-file-block:\/\/[^/]+\/([^?]+)/)?.[1];return loaded.some(img=>img.src.includes(id))}),responseBodies:downloads.size}));
  const info={number:episode.episodeNumber,title:episode.title,total:episode.panels.length,downloaded:0,missing:[],files:[]};
  for(const panel of episode.panels){
   const id=panel.notionFileBlock.match(/^notion-file-block:\/\/[^/]+\/([^?]+)/)?.[1];
   if(!id)throw Error('Invalid Notion file reference: '+episode.id);
   await Promise.allSettled(pending);
   const bytes=downloads.get(id);
   if(!bytes){info.missing.push(panel.originalFilename+' original bytes not observed');continue}
   const mime=mimeByMagic(bytes);
   if(mime!=='image/png'){
    info.missing.push(panel.originalFilename+' unexpected bytes '+mime+' (not committing a converted image)');
    continue;
   }
   const path=resolve(panel.destination);
   if(!dryRun){mkdirSync(dirname(path),{recursive:true});writeFileSync(path,bytes);}
   info.downloaded++;
   info.files.push({name:panel.originalFilename,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex').slice(0,16)});
  }
  console.log('Notion import '+JSON.stringify(info));
  log.push(info);
  await page.close();
 }
}finally{await browser.close();}
if(log.some(x=>x.downloaded!==x.total)){
 console.error('INCOMPLETE IMPORT; no incomplete episodes may be published.');
 process.exitCode=1;
}else {
 console.log('ALL ORIGINAL EPISODE PANELS PRESENT AND VALIDATED');
 if(!dryRun){
  for(const ep of manifest.episodes){
   ep.reviewStatus='imported-needs-visual-order-check';
   ep.panels.forEach(p=>p.assetImported=true);
  }
  writeFileSync('content/notion-originals-manifest.json',JSON.stringify(manifest,null,2)+'\n');
 }
}
