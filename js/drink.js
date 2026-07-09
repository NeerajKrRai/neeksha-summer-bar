// ── CANVAS COMPAT ─────────────────────────────────
// roundRect shipped in Safari 16 / Chrome 99 — older WebKit (iOS 15 hand-me-downs) needs this
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    r=Math.min(Number(r)||0,w/2,h/2);
    this.moveTo(x+r,y);
    this.arcTo(x+w,y,x+w,y+h,r);
    this.arcTo(x+w,y+h,x,y+h,r);
    this.arcTo(x,y+h,x,y,r);
    this.arcTo(x,y,x+w,y,r);
    this.closePath();
    return this;
  };
}

// ── STRAW COLOURS ─────────────────────────────────
const STRAW_COLS=[
  {c:'#C97B84',n:'Rose'},    {c:'#52B788',n:'Mint'},
  {c:'#FFD166',n:'Lemon'},   {c:'#5E81F4',n:'Bluebell'},
  {c:'#FF6B6B',n:'Coral'},   {c:'#A29BFE',n:'Lavender'},
  {c:'#F9C74F',n:'Sunflower'},{c:'#43AA8B',n:'Teal'},
  {c:'#F4845F',n:'Peach'},   {c:'#FFFFFF',n:'Pearl'},
];
let straw1Col='#C97B84', straw2Col='#52B788';

function openStrawModal(){
  buildSwatches();
  document.getElementById('strawModal').classList.add('on');
}
function closeStrawModal(){
  document.getElementById('strawModal').classList.remove('on');
  // apply chosen colours to the live straws
  document.getElementById('straw1').style.background=straw1Col;
  document.getElementById('straw2').style.background=straw2Col;
}
function buildSwatches(){
  ['swatchRow1','swatchRow2'].forEach((rowId,gi)=>{
    const row=document.getElementById(rowId);
    row.innerHTML='';
    STRAW_COLS.forEach(({c,n})=>{
      const btn=document.createElement('div');
      btn.className='sm-swatch'+(( gi===0&&c===straw1Col)||(gi===1&&c===straw2Col)?' picked':'');
      btn.style.background=c;
      btn.title=n;
      btn.onclick=(e)=>pickStraw(gi,c,rowId,e.currentTarget);
      row.appendChild(btn);
    });
  });
  updateStrawPreview();
}
function pickStraw(gi,col,rowId,el){
  if(gi===0) straw1Col=col; else straw2Col=col;
  document.querySelectorAll(`#${rowId} .sm-swatch`).forEach(s=>s.classList.remove('picked'));
  el.classList.add('picked');
  updateStrawPreview();
}
function updateStrawPreview(){
  document.getElementById('prevStraw1').style.background=straw1Col;
  document.getElementById('prevStraw2').style.background=straw2Col;
}

// ── DRINK SCREEN ──────────────────────────────────
function initDrink(){
  sipCnt=0;saving=false;document.getElementById('sipBtn').textContent='😋 Take a Sip!';
  const f=gSel.fruitGrid[0];
  const lc=f?.c||'#3a508a',lc2=darken(lc,32);
  const fe=f?.e||'🍋',gs=[...gSel.garnishGrid,...gSel.vip].slice(0,2).map(x=>x.e).join('')||'🌿';
  ckName=`${NAMES[~~(Math.random()*NAMES.length)]} ${f?.n||'Summer'} ${NOUNS[~~(Math.random()*NOUNS.length)]}`;
  document.getElementById('dkName').textContent=ckName;
  document.getElementById('dkTag').textContent=`${gSel.fruitGrid.map(x=>x.e).join(' ')} — a refreshing blend just for you`;
  _fillGlass(document.getElementById('dkGlass'),lc,lc2,'transparent',fe,gs,'dk');
  setGlassFill('dk',1); // fresh drink starts full
  document.getElementById('glAura').style.background=lc;
  // apply straw colours
  document.getElementById('straw1').style.background=straw1Col;
  document.getElementById('straw2').style.background=straw2Col;
  spawnBubbles(lc);
  reqTilt();
  // open straw picker so girls can choose!
  openStrawModal();
}
function darken(hex,a){
  let r=parseInt(hex.slice(1,3),16)-a,g=parseInt(hex.slice(3,5),16)-a,b=parseInt(hex.slice(5,7),16)-a;
  return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');
}
function spawnBubbles(col){
  const l=document.getElementById('bblLayer');l.innerHTML='';
  for(let i=0;i<18;i++){
    const b=document.createElement('div');b.className='bb';
    const sz=6+Math.random()*18;
    b.style.cssText=`width:${sz}px;height:${sz}px;background:${[col,'#C97B84','#52B788'][i%3]};opacity:.32;left:${10+Math.random()*80}%;animation-duration:${4+Math.random()*6}s;animation-delay:${-Math.random()*10}s`;
    l.appendChild(b);
  }
}
// ── GIRL REACTIONS ────────────────────────────────
const GIRL1_STATES=[
  {kao:'♪( ´∀｀)',  speech:'nyaa～ (=^･ω･^=)'},
  {kao:'(*´▽｀*)',   speech:'oishii～！✨'},
  {kao:'(ﾉ◕ヮ◕)ﾉ', speech:'sugoi desu！🌸'},
  {kao:'(≧◡≦)',     speech:'kawaii～！💕'},
  {kao:'٩(◕‿◕)۶',  speech:'maji yabai！🍹'},
  {kao:'(●´ω●)', speech:'fuwa fuwa～ ☁️'},
  {kao:'ヽ(>∀<☆)ノ',speech:'saikou～！🌟'},
  {kao:'(ﾉ^ヮ^)ﾉ',  speech:'ureshii！！🎉'},
  {kao:'( ˘ ³˘)♥',   speech:'daisuki～ 💖'},
  {kao:'(っ˘ڡ˘ς)',   speech:'okawariii！🍓'},
];
const GIRL2_STATES=[
  {kao:'人(´∀｀ )♪', speech:'oshiii～！(≧▽≦)'},
  {kao:'(⌒▽⌒)☆',   speech:'umai umai！🍋'},
  {kao:'(*^_^*)', speech:'hau～ totemo！🌺'},
  {kao:'(◍•ᴗ•◍)',   speech:'itadakimasu！🙏'},
  {kao:'ヾ(≧▽≦*)o', speech:'kimochi ii～！💫'},
  {kao:'(✿◠‿◠)',    speech:'natsukashii～ ☀️'},
  {kao:'(๑˃ᴗ˂)ﻌ',  speech:'mofu mofu～！🍇'},
  {kao:'꒰˘̩̩̩⌣˘̩̩̩꒱',   speech:'suki！！！💙'},
  {kao:'(ᗒᗨᗕ)',     speech:'totemo oishii！🌊'},
  {kao:'٩(｡•́‿•̀｡)۶',speech:'mou ippai！✨'},
];

let bubbleTimer1=null, bubbleTimer2=null;
const _bubbles={};

function getBubble(num){
  if(_bubbles[num]) return _bubbles[num];
  const b=document.createElement('div');
  b.className='speech-bubble';
  b.id='bubble'+num;
  document.body.appendChild(b);
  _bubbles[num]=b;
  return b;
}

function showBubble(num, text){
  const kao=document.getElementById('kao'+num);
  if(!kao) return;
  const b=getBubble(num);
  b.textContent=text;

  const rect=kao.getBoundingClientRect();
  const bWidth=Math.min(130, window.innerWidth*0.35);
  const left=Math.max(8, Math.min(window.innerWidth-bWidth-8, rect.left+rect.width/2-bWidth/2));
  const top=rect.top-80;

  b.style.left=left+'px';
  b.style.top=top+'px';
  b.style.width=bWidth+'px';
  b.style.transform='translateY(8px) scale(.88)';
  b.style.opacity='0';

  // force reflow then animate in
  void b.offsetHeight;
  b.style.transition='opacity .28s ease, transform .28s cubic-bezier(.34,1.3,.64,1)';
  b.style.transform='translateY(0) scale(1)';
  b.style.opacity='1';

  const prev=num===1?bubbleTimer1:bubbleTimer2;
  if(prev) clearTimeout(prev);
  const t=setTimeout(()=>{
    b.style.transform='translateY(-6px) scale(.9)';
    b.style.opacity='0';
  }, 2000);
  if(num===1) bubbleTimer1=t; else bubbleTimer2=t;
}

function takeSip(){
  sipCnt++;
  // the cup drains a little with every sip — empty by the last (9th) sip
  drainGlassTo('dk', Math.max(0, 1 - sipCnt/9), 550);
  const idx=Math.min(sipCnt-1, GIRL1_STATES.length-1);
  const s1=GIRL1_STATES[idx];
  const s2=GIRL2_STATES[idx];

  // update kaomoji faces
  document.getElementById('kao1').textContent=s1.kao;
  document.getElementById('kao2').textContent=s2.kao;

  // alternate who speaks first
  if(sipCnt%2===1){
    showBubble(1, s1.speech);
    setTimeout(()=>showBubble(2, s2.speech), 600);
  } else {
    showBubble(2, s2.speech);
    setTimeout(()=>showBubble(1, s1.speech), 600);
  }

  // big reaction emoji overlay
  const r=document.getElementById('sipR');
  const bigEmojis=['✨','🌸','💫','🍓','🌟','💕','🎉','🍹','💖','🌺'];
  r.textContent=bigEmojis[sipCnt%bigEmojis.length];
  r.classList.remove('pop');void r.offsetHeight;r.classList.add('pop');

  if(sipCnt===3) document.getElementById('sipBtn').textContent='🎊 Motto ippai！Keep sipping!';
  if(sipCnt===6) document.getElementById('sipBtn').textContent='💖 Mou ichido！One more sip!';
  if(sipCnt===9) saveDrink();
}
let saving=false;
function saveDrink(){
  // tilt fires every ~900ms and the buttons stay live — one drink must save exactly once
  if(saving)return; saving=true;
  const card=mkCard();
  saved.unshift(card);
  persistCards();
  // Sakura Glaze is earned here — 5 per VIP ingredient in the finished cocktail
  gSel.vip.forEach((x,k)=>setTimeout(()=>earnGlaze(GLAZE_PER_VIP, window.innerWidth/2+((k%3)-1)*70, window.innerHeight*0.32+k*10), 350+k*180));
  checkUnlock();
  // the unlock overlay brings its own confetti at a higher z — ours would animate unseen behind it
  if(!document.getElementById('unlockOverlay').classList.contains('on'))confetti();
  showToast('✅ Saved to your file! 📁');
  resetRun();
  autoNavTimer=setTimeout(()=>{autoNavTimer=null;go('sDash');},1900);
}
function mkCard(){
  return{
    name:ckName,
    fruits:gSel.fruitGrid.map(f=>({e:f.e,n:f.n,c:f.c})),
    ice:gSel.iceGrid.map(x=>x.pack?x.herbs.map(h=>h.split(' ')[0]).join(' '):x.e).join(' ')||'🧊',
    frozen:gSel.frozenGrid.map(x=>x.e).join(' ')||'',
    garnish:gSel.garnishGrid.map(x=>x.e).join(' ')||'✨',
    vip:gSel.vip.map(x=>x.e).join(' ')||'',
    allEmojis:[...gSel.fruitGrid,...gSel.garnishGrid,...gSel.vip].slice(0,7).map(x=>x.e).join(''),
    lc:gSel.fruitGrid[0]?.c||'#3a508a',
    date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),
    id:Date.now(),imgDataUrl:null,
  };
}
function resetRun(){
  ['fruitGrid','iceGrid','frozenGrid','garnishGrid'].forEach(gid=>{
    gSel[gid]=[];
    document.querySelectorAll(`#${gid} .ic`).forEach(el=>el.classList.remove('sg','sr'));
  });
  gSel.vip=[];
  previewEmojis=[];
  resetSwitch();
  updFrCnt();
}

// ── CANVAS IMAGE EXPORT ───────────────────────────
function fitCvsText(ctx,txt,max){
  let t=String(txt);
  if(ctx.measureText(t).width<=max)return t;
  while(t.length>3&&ctx.measureText(t+'…').width>max)t=t.slice(0,-1);
  return t+'…';
}
function genImage(card){
  const cvs=document.getElementById('expCvs'),ctx=cvs.getContext('2d');
  const W=800,H=480;
  const col=card.lc||'#3a508a'; // legacy cards can lack lc
  // bg
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#242c26');bg.addColorStop(1,'#1a1e1b');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  // colour wash left
  ctx.fillStyle=col;ctx.globalAlpha=.15;ctx.fillRect(0,0,260,H);ctx.globalAlpha=1;
  // left accent bar
  ctx.fillStyle=col;ctx.fillRect(0,0,5,H);
  // subtle grid lines
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // draw glass
  drawCvsGlass(ctx,45,60,150,H-90,col);
  // title — shrink to fit the 800px card, long names must not clip
  const nm=String(card.name||'Cocktail');
  let fs=46;ctx.font='700 46px Georgia,serif';
  while(fs>22&&ctx.measureText(nm).width>505){fs-=2;ctx.font='700 '+fs+'px Georgia,serif';}
  ctx.fillStyle='#F5EFE6';ctx.fillText(nm,265,86);
  // rose accent under title
  ctx.fillStyle=col;ctx.globalAlpha=.55;ctx.fillRect(265,96,Math.min(ctx.measureText(nm).width,480),2);ctx.globalAlpha=1;
  // date
  ctx.fillStyle='#7B8FA1';ctx.font='500 19px Arial,sans-serif';ctx.fillText('☀  Made on '+(card.date||''),265,130);
  // divider
  ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(265,150);ctx.lineTo(750,150);ctx.stroke();
  // rows
  const rows=[
    {label:'FRUITS',val:(Array.isArray(card.fruits)?card.fruits.map(f=>f.e+' '+f.n).join('  '):card.fruits||''),y:190},
    {label:'GARNISH',val:card.garnish||'✨',y:255},
    {label:'ICE & EXTRAS',val:(card.ice||'🧊')+(card.frozen?' '+card.frozen:''),y:320},
  ];
  if(card.vip)rows.push({label:'VIP SPARKLES ✨',val:card.vip,y:385});
  rows.forEach(row=>{
    ctx.fillStyle='#7B8FA1';ctx.font='600 14px Arial,sans-serif';ctx.fillText(row.label,265,row.y-18);
    ctx.fillStyle='#E2D5C4';ctx.font='26px Arial,sans-serif';ctx.fillText(fitCvsText(ctx,row.val,485),265,row.y);
  });
  // branding
  ctx.fillStyle='rgba(255,255,255,0.18)';ctx.font='500 16px Arial,sans-serif';
  ctx.fillText("Neeksha's Summer Bar  🍹",265,440);
  // save
  card.imgDataUrl=cvs.toDataURL('image/png');
  // keep in memory only — don't write large image back to localStorage
}

function drawCvsGlass(ctx,x,y,w,h,col){
  const cx=x+w/2;
  // liquid
  const lq=ctx.createLinearGradient(0,y+h*.28,0,y+h);
  lq.addColorStop(0,col);lq.addColorStop(1,darken(col,38));
  ctx.beginPath();ctx.moveTo(x+w*.1,y+h*.3);ctx.lineTo(x+w*.9,y+h*.3);ctx.lineTo(x+w*.78,y+h);ctx.lineTo(x+w*.22,y+h);ctx.closePath();
  ctx.fillStyle=lq;ctx.globalAlpha=.88;ctx.fill();ctx.globalAlpha=1;
  // ice blocks
  ['rgba(255,255,255,0.42)','rgba(255,255,255,0.35)'].forEach((c,i)=>{
    ctx.fillStyle=c;ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(x+w*.18+i*28,y+h*.42+i*14,w*.28,h*.18,5);ctx.fill();ctx.stroke();
  });
  // glass outline
  const gf=ctx.createLinearGradient(x,y,x+w,y);
  gf.addColorStop(0,'rgba(255,255,255,0.5)');gf.addColorStop(.5,'rgba(255,255,255,0.1)');gf.addColorStop(1,'rgba(255,255,255,0.5)');
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w*.78,y+h);ctx.lineTo(x+w*.22,y+h);ctx.closePath();
  ctx.fillStyle=gf;ctx.globalAlpha=.55;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1.5;ctx.stroke();
  // rim
  ctx.beginPath();ctx.roundRect(x,y,w,12,6);ctx.fillStyle='rgba(255,255,255,0.55)';ctx.fill();
  // shine
  ctx.beginPath();ctx.moveTo(x+5,y+16);ctx.lineTo(x+20,y+16);ctx.lineTo(x+12,y+h*.68);ctx.lineTo(x-2,y+h*.68);ctx.closePath();
  ctx.fillStyle='rgba(255,255,255,0.14)';ctx.fill();
  // base
  ctx.beginPath();ctx.roundRect(x+w*.2,y+h,w*.6,12,6);ctx.fillStyle='rgba(255,255,255,0.18)';ctx.fill();
}

