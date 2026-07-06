// ── SAKURA GLAZE MERITS ───────────────────────────
const GLAZE_PER_VIP = 5;
let glazeBalance = 0;
let ownedItems = {};

const STORE_ITEMS = [
  {section:'Cutlery ✨',items:[
    {e:'🥢',n:'Sakura Chopsticks', price:10},
    {e:'🥄',n:'Pearl Ladle',       price:8},
    {e:'🩴',n:'Crystal Spoon',     price:12},
    {e:'🍴',n:'Gold Fork',         price:15},
    {e:'🪥',n:'Blossom Stirrer',   price:6},
  ]},
  {section:'Cups & Glasses 🍸',items:[
    {e:'🍵',n:'Sakura Teacup',     price:12},
    {e:'🧊',n:'Crystal Goblet',    price:20},
    {e:'🥤',n:'Pearl Bubble Cup',  price:15},
    {e:'🫗',n:'Moon Jar Cup',      price:18},
    {e:'🍸',n:'Gold Cocktail Glass',price:25},
  ]},
  {section:'Decor 🌸',items:[
    {e:'🌸',n:'Sakura Branch',     price:8},
    {e:'🪷',n:'Lotus Coaster',     price:10},
    {e:'✨',n:'Glitter Tray',          price:12},
    {e:'🧸',n:'Mini Bunny Charm',  price:20},
    {e:'🌙',n:'Moon Stirrer',      price:15},
    {e:'🎁',n:'VIP Gift Wrap',     price:30},
    {e:'💫',n:'Star Placemat',     price:10},
  ]},
];

function loadGlaze(){
  try{
    glazeBalance = parseInt(localStorage.getItem('nk_glaze')||'0',10);
    ownedItems = JSON.parse(localStorage.getItem('nk_owned')||'{}');
  }catch(e){ glazeBalance=0; ownedItems={}; }
  // parseInt never throws — a corrupt value arrives as NaN and would defeat every < price guard
  if(!Number.isFinite(glazeBalance)||glazeBalance<0) glazeBalance=0;
  updateGlazeWidget();
}

function saveGlaze(){
  try{
    localStorage.setItem('nk_glaze', String(glazeBalance));
    localStorage.setItem('nk_owned', JSON.stringify(ownedItems));
  }catch(e){}
}

function updateGlazeWidget(){
  const widget = document.getElementById('glazeWidget');
  const center = document.getElementById('glazeCenter');
  const count  = document.getElementById('glazeCount');
  // visible once earned, except over the loading splash (it would sit on top of it, tappable)
  const show = (glazeBalance > 0 || isPantryUnlocked()) && curSc !== 'sLoad';
  widget.classList.toggle('on', show);
  if(center) center.textContent = glazeBalance;
  if(count)  count.textContent  = '🌸 ' + glazeBalance;
}

function earnGlaze(amount, x, y){
  glazeBalance += amount;
  saveGlaze();
  updateGlazeWidget();
  // floating +5 pop
  const pop = document.createElement('div');
  pop.className = 'glaze-pop';
  pop.textContent = '+' + amount + ' 🌸';
  pop.style.left = (x||window.innerWidth/2) + 'px';
  pop.style.top  = (y||window.innerHeight/2) + 'px';
  document.body.appendChild(pop);
  setTimeout(()=>pop.remove(), 1500);
}

function buildStore(){
  // stars
  const sc = document.getElementById('storeStars'); sc.innerHTML='';
  const sp=['✦','✧','🌸','💫','✨','🌟'];
  for(let i=0;i<24;i++){
    const el=document.createElement('div'); el.className='pstar';
    el.textContent=sp[i%sp.length];
    el.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;animation-duration:'+(2+Math.random()*4)+'s;animation-delay:'+(Math.random()*4)+'s;font-size:'+(8+Math.random()*12)+'px;color:rgba(255,183,197,.7)';
    sc.appendChild(el);
  }
  // balance
  document.getElementById('storeBal').textContent = glazeBalance;
  // sections
  const sec = document.getElementById('storeSections'); sec.innerHTML='';
  STORE_ITEMS.forEach(section=>{
    const wrap = document.createElement('div');
    const title = document.createElement('div');
    title.className='store-section-title';
    title.textContent = section.section;
    wrap.appendChild(title);
    const grid = document.createElement('div');
    grid.className='store-grid';
    section.items.forEach((item,i)=>{
      const id = section.section+'_'+i;
      const owned = !!ownedItems[id];
      const canAfford = glazeBalance >= item.price;
      const card = document.createElement('div');
      card.className='store-card'+(owned?' owned':(!canAfford?' cant-afford':''));
      card.innerHTML =
        '<div class="store-em">'+item.e+'</div>'+
        '<div class="store-nm">'+item.n+'</div>'+
        '<div class="store-price">🌸 '+item.price+'</div>'+
        (owned?'<div class="store-owned-badge">Owned!</div>':'');
      if(!owned) card.onclick=()=>buyItem(id,item,card);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    sec.appendChild(wrap);
  });
}

let buyPopTimer=null;
function buyItem(id, item, card){
  if(glazeBalance < item.price){ showToast('Not enough Sakura Glaze! 🌸'); return; }
  glazeBalance -= item.price;
  ownedItems[id] = true;
  saveGlaze();
  updateGlazeWidget();
  // rebuild so this card shows Owned! AND other cards' cant-afford state matches the new balance
  buildStore();
  // show buy pop (replayable — a second purchase within 2.2s must not be cut short)
  document.getElementById('buyPopEm').textContent = item.e;
  document.getElementById('buyPopTxt').textContent = item.n + ' unlocked!';
  document.getElementById('buyPopSub').textContent = 'You have 🌸 ' + glazeBalance + ' Sakura Glaze left';
  const pop = document.getElementById('buyPop');
  if(buyPopTimer)clearTimeout(buyPopTimer);
  pop.classList.remove('on');void pop.offsetHeight;pop.classList.add('on');
  confetti();
  buyPopTimer=setTimeout(()=>{pop.classList.remove('on');buyPopTimer=null;}, 2200);
  showToast('🌸 Purchased! ' + item.e);
}

