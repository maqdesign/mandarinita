import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const base='http://127.0.0.1:8765';
const profiles=[
 {name:'mobile',width:390,height:844},
 {name:'tablet',width:768,height:1024},
 {name:'desktop',width:1440,height:900}
];
let failures=0;
for(const profile of profiles){
 const page=await browser.newPage({viewport:{width:profile.width,height:profile.height},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 try {
  await page.goto(base+'/?lang=en',{waitUntil:'networkidle',timeout:30000});
  await page.locator('#hero-title').waitFor({timeout:10000});
  if(await page.locator('html').getAttribute('lang')!=='en')throw Error('English entry link failed');
  await page.locator('#portafolio').scrollIntoViewIfNeeded();
  if(!(await page.locator('#portafolio').isVisible()))throw Error('Portfolio not visible');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+4))throw Error('Horizontal page overflow');
  const cards=page.locator('.work-card [data-reader]');
  await cards.first().click();
  if(!(await page.locator('#reader').evaluate(el=>el.open)))throw Error('Reader did not open');
  await page.locator('#reader-image').waitFor({state:'visible'});
  await page.waitForFunction(() => {
   const img=document.querySelector('#reader-image');
   return img && img.complete && img.naturalWidth>0;
  }, null, {timeout:15000});
  const next=page.locator('.reader-next');
  if(await next.isVisible())await next.click();
  await page.locator('.reader-close').click();
  if(errors.length)throw Error('Page errors: '+errors.join('; '));
  console.log('PASS '+profile.name+' '+profile.width+'×'+profile.height);
 }catch(e){failures++;console.error('FAIL '+profile.name+': '+e.message);}
 await page.close();
}
await browser.close();
if(failures)process.exitCode=1;
