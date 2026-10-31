import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1365,height:768}});
const names=[];
page.on('response',r=>{
 const u=r.url();
 if(/notion|s3|amazonaws/.test(u) && /image|file|png|jpg|webp|block/i.test(u)) {
  names.push({status:r.status(),urlHost:new URL(u).hostname,urlPath:new URL(u).pathname.slice(0,95)});
 }
});
try{
 const response=await page.goto('https://mandarinita.notion.site/f3a519c8a8a54776bc51d7411ec49089',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForTimeout(8000);
 const summary=await page.evaluate(()=>({title:document.title,images:[...document.images].slice(0,25).map(i=>({alt:i.alt,src:i.currentSrc.slice(0,95),loaded:i.naturalWidth>0})),bodyText:document.body.innerText.slice(0,550)}));
 console.log(JSON.stringify({httpStatus:response.status(),summary,requests:names.slice(0,35)}));
}catch(e){console.log('PROBE ERROR: '+e.message)}
finally{await browser.close()}
