// ── FILE SCREEN — swipeable carousel ─────────────
let flIdx=0;
// legacy nk_ck entries can hold arbitrary strings — never interpolate them into markup raw
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function buildFile(){
  const track=document.getElementById('flTrack');
  const dots=document.getElementById('flDots');
  const sub=document.getElementById('flSub');
  const hint=document.getElementById('flSwipeHint');
  track.innerHTML='';dots.innerHTML='';flIdx=0;

  if(!saved.length){
    track.innerHTML=`<div class="fl-slot"><div class="empty-st"><div class="ei">📁</div><p>No cocktails yet!<br>Make your first one and it'll appear here.</p></div></div>`;
    dots.style.display='none';hint.style.display='none';
    sub.textContent='0 creations';
    return;
  }

  dots.style.display='flex';
  hint.style.display=saved.length>1?'block':'none';
  sub.textContent=`${saved.length} creation${saved.length!==1?'s':''}`;

  saved.forEach((c,idx)=>{
    const acc=c.lc||CCOLS[idx%CCOLS.length];
    const slot=document.createElement('div');slot.className='fl-slot';
    const card=document.createElement('div');card.className='ck-card';
    const inner=document.createElement('div');inner.className='ck-card-inner';
    inner.innerHTML=`
      <div class="ck-glow" style="background:${esc(acc)}"></div>
      <div class="ck-num">${String(idx+1).padStart(2,'0')}</div>
      <div class="ck-name">${esc(c.name||'Mystery Mix')}</div>
      <div class="ck-emj">${esc(c.allEmojis||'')}</div>
      <div class="ck-row"><strong>Fruits</strong> — ${esc(Array.isArray(c.fruits)?c.fruits.map(f=>f.e+' '+f.n).join(', '):c.fruits||'')}</div>
      ${c.ice?`<div class="ck-row"><strong>Ice &amp; Extras</strong> — ${esc(c.ice)} ${esc(c.frozen||'')}</div>`:''}
      ${c.garnish?`<div class="ck-row"><strong>Garnish</strong> — ${esc(c.garnish)}</div>`:''}
      ${c.vip?`<div class="ck-row"><strong>VIP ✨</strong> — ${esc(c.vip)}</div>`:''}
      <div class="ck-date">☀  ${esc(c.date||'')}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="ck-dl">⬇ Save Image</button>
        <button class="ck-trash">🗑</button>
      </div>
    `;
    // listeners, not inline onclick — ids with quotes must not become broken attribute JS
    inner.querySelector('.ck-dl').addEventListener('click',()=>dlImg(c.id));
    inner.querySelector('.ck-trash').addEventListener('click',()=>deleteCard(c.id));
    const acc_bar=document.createElement('div');acc_bar.className='ck-acc';acc_bar.style.background=acc;
    card.appendChild(inner);card.appendChild(acc_bar);
    slot.appendChild(card);track.appendChild(slot);

    const dot=document.createElement('div');dot.className='fl-dot'+(idx===0?' act':'');
    dot.onclick=()=>goSlide(idx);
    dots.appendChild(dot);
  });

  flUpdateTrack(false);
  initSwipe();
}

function flUpdateTrack(animate){
  const track=document.getElementById('flTrack');
  if(animate) track.classList.remove('dragging');
  else track.classList.add('dragging');
  track.style.transform=`translateY(${-flIdx*100}%)`;
  document.querySelectorAll('.fl-dot').forEach((d,i)=>d.classList.toggle('act',i===flIdx));
}

function goSlide(i){
  flIdx=Math.max(0,Math.min(saved.length-1,i));
  flUpdateTrack(true);
}

function initSwipe(){
  const stage=document.getElementById('flStage');
  // remove old listeners by cloning
  const fresh=stage.cloneNode(true);
  stage.parentNode.replaceChild(fresh,stage);
  // re-attach track refs
  const track=fresh.querySelector('#flTrack');

  let startX=0,startY=0,dy=0,dragging=false,lockAxis=null;

  function onStart(x,y){startX=x;startY=y;dy=0;dragging=true;lockAxis=null;track.classList.add('dragging');}
  function onMove(x,y){
    if(!dragging)return;
    const mx=x-startX,my=y-startY;
    if(!lockAxis) lockAxis=Math.abs(my)>Math.abs(mx)?'v':'h';
    if(lockAxis==='h'){track.classList.remove('dragging');return;}
    dy=my;
    const base=-flIdx*fresh.offsetHeight;
    track.style.transform=`translateY(${base+dy*0.8}px)`;
  }
  function onEnd(){
    if(!dragging)return; dragging=false;
    if(lockAxis==='v'){
      if(dy<-50&&flIdx<saved.length-1) flIdx++;
      else if(dy>50&&flIdx>0) flIdx--;
    }
    flUpdateTrack(true);
  }

  fresh.addEventListener('touchstart',e=>{const t=e.touches[0];onStart(t.clientX,t.clientY);},{passive:true});
  fresh.addEventListener('touchmove',e=>{const t=e.touches[0];onMove(t.clientX,t.clientY);},{passive:true});
  fresh.addEventListener('touchend',onEnd,{passive:true});
  fresh.addEventListener('mousedown',e=>onStart(e.clientX,e.clientY));
  fresh.addEventListener('mousemove',e=>{if(dragging)onMove(e.clientX,e.clientY);});
  fresh.addEventListener('mouseup',onEnd);
  fresh.addEventListener('mouseleave',onEnd);
}

let _dlCard=null;
function dlImg(id){
  _dlCard=saved.find(c=>String(c.id)===String(id));
  if(!_dlCard)return;
  // regenerate image fresh (not stored in localStorage to save space)
  try{genImage(_dlCard);}
  catch(e){showToast('😢 Could not draw the card picture');_dlCard=null;return;}
  const input=document.getElementById('rmInput');
  input.value=_dlCard.name||'';
  document.getElementById('renameModal').classList.add('on');
  setTimeout(()=>input.focus(),350);
}
function deleteCard(id){
  // find index first
  const idx=saved.findIndex(c=>String(c.id)===String(id));
  if(idx===-1) return;
  saved.splice(idx,1);
  persistCards();
  showToast('🗑 Cocktail deleted!');
  buildFile();
}
function closeRename(e){
  if(e&&e.target!==document.getElementById('renameModal'))return;
  document.getElementById('renameModal').classList.remove('on');
  if(_dlCard)_dlCard.imgDataUrl=null; // don't pin ~0.5MB of base64 on the card
  _dlCard=null;
}
function confirmDownload(){
  if(!_dlCard?.imgDataUrl)return;
  const raw=document.getElementById('rmInput').value.trim()||_dlCard.name||'cocktail';
  const filename=raw.replace(/[^a-zA-Z0-9 _\-()!]/g,'').replace(/\s+/g,'_')||'cocktail';
  const a=document.createElement('a');a.href=_dlCard.imgDataUrl;a.download=filename+'.png';a.click();
  document.getElementById('renameModal').classList.remove('on');
  _dlCard.imgDataUrl=null;
  _dlCard=null;
  showToast('📥 Saved as '+filename+'.png');
}

