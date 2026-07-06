// ── SIDE CHAT BUBBLES (during selection) ──────────
const FRUIT_LINES={
  'Watermelon': [
    {g:1, kao:'♪( ´∀｀)', txt:'add the watermelon omg yess nyaa 🍉'},
    {g:2, kao:'(⌒▽⌒)☆',  txt:'watermelon slaps!! do it do it!!'},
  ],
  'Lemon': [
    {g:2, kao:'(≧▽≦)',    txt:'ooh lemoooon yes plz!! 🍋'},
    {g:1, kao:'(*´▽｀*)',  txt:'so zesty kawaii～！'},
  ],
  'Blue Raspberry': [
    {g:1, kao:'(ﾉ◕ヮ◕)ﾉ', txt:'add bewwies plz!! 💙'},
    {g:2, kao:'ヾ(≧▽≦*)o', txt:'yess do that nyaa!! 💙'},
  ],
  'Strawberry': [
    {g:2, kao:'(✿◠‿◠)',   txt:'strawberry!! so cute omg 🍓'},
    {g:1, kao:'٩(◕‿◕)۶',  txt:'yesss it smells so good!!'},
  ],
  'Blueberry': [
    {g:1, kao:'(っ˘ڡ˘ς)',  txt:'ooh blueberries are so yummy～！🫐'},
    {g:2, kao:'(◍•ᴗ•◍)',  txt:'add bewwies!! add bewwies!!'},
  ],
  'Grape': [
    {g:2, kao:'(*^_^*)', txt:'grapes!! so fancy nyaa～ 🍇'},
    {g:1, kao:'ヽ(>∀<☆)ノ', txt:'purple drink!!!! sugoi!!'},
  ],
  'Grapefruit': [
    {g:1, kao:'(●´ω●)', txt:'grapefruit!! so grown up hehe 🍊'},
    {g:2, kao:'(⌒▽⌒)☆',    txt:'yes do that!! smells amazing!!'},
  ],
};
const ICE_LINES=[
  {g:2, kao:'(≧◡≦)',     txt:'mint!! so refreshing nyaa 🌿'},
  {g:1, kao:'(*´▽｀*)',   txt:'jelly cubes are so cute omg!!'},
  {g:2, kao:'ヾ(≧▽≦*)o', txt:'ice balls!! so satisfying～！'},
  {g:1, kao:'(ﾉ◕ヮ◕)ﾉ', txt:'more ice!! more ice!! yess!!'},
  {g:2, kao:'(✿◠‿◠)',   txt:'ooh jade ice!! so pretty!!'},
];
const FROZEN_LINES=[
  {g:1, kao:'٩(◕‿◕)۶',  txt:'frozen berries plz!! nyaa 🍓'},
  {g:2, kao:'(◍•ᴗ•◍)',  txt:'frozen blueberries!! yesss!!'},
  {g:1, kao:'ヽ(>∀<☆)ノ', txt:'frozen grapes!! so fancy!!'},
  {g:2, kao:'(っ˘ڡ˘ς)',  txt:'frozen lemon!! ooh ooh!!'},
  {g:1, kao:'(*^_^*)', txt:'frozen melon!! sugoi desu!! 🍉'},
];
const GARNISH_LINES=[
  {g:2, kao:'(≧▽≦)',     txt:'ice lolly on the side?? YES!! 🍭'},
  {g:1, kao:'(*´▽｀*)',   txt:'mini peacock!! so cute nyaa 🦚'},
  {g:2, kao:'ヾ(≧▽≦*)o', txt:'sugar glass!! kawaii!! 🍬'},
  {g:1, kao:'(ﾉ◕ヮ◕)ﾉ', txt:'star pick!! so sparkly!!⭐'},
  {g:2, kao:'(✿◠‿◠)',   txt:'flower garnish!! so pretty!! 🌺'},
  {g:1, kao:'٩(◕‿◕)۶',  txt:'butterfly!! omg omg!! 🦋'},
  {g:2, kao:'(◍•ᴗ•◍)',  txt:'rainbow straw!!!! yess do that!! 🌈'},
  {g:1, kao:'ヽ(>∀<☆)ノ', txt:'jelly diamond!! so cool!! 💎'},
  {g:2, kao:'(*^_^*)', txt:'blossom!! so soft nyaa 🌸'},
  {g:1, kao:'(っ˘ڡ˘ς)',  txt:'tiny cake slice plz!! 🍰'},
];
const DESELECT_LINES=[
  {g:1, kao:'(;_;)', txt:'nooo come back!! 😭'},
  {g:2, kao:'(>_<)',      txt:'aww we wanted that one!!'},
  {g:1, kao:'(╥_╥)',     txt:'why!! why!! nooo'},
  {g:2, kao:'( T_T)',     txt:'put it back put it back!!'},
];

let _sbTimers={1:null,2:null};
const _sbEls={};

function getSideBubble(gNum){
  if(_sbEls[gNum]) return _sbEls[gNum];
  const el=document.createElement('div');
  el.className=`side-bubble g${gNum}`;
  document.body.appendChild(el);
  _sbEls[gNum]=el;
  return el;
}

function showSideBubble(gNum, kao, text, yPct){
  const b=getSideBubble(gNum);
  b.innerHTML=`<span class="sb-kao">${kao}</span>${text}`;
  // vertical position — random-ish in middle third of screen
  const yPos=window.innerHeight*(yPct||0.45);
  b.style.top=yPos+'px';
  b.classList.remove('show');
  void b.offsetHeight;
  b.classList.add('show');
  if(_sbTimers[gNum]) clearTimeout(_sbTimers[gNum]);
  _sbTimers[gNum]=setTimeout(()=>b.classList.remove('show'), 2600);
}

function reactToSelection(gid, i, item, adding){
  if(!adding){
    const d=DESELECT_LINES[Math.floor(Math.random()*DESELECT_LINES.length)];
    showSideBubble(d.g, d.kao, d.txt, 0.38+Math.random()*.2);
    return;
  }
  let lines=null;
  if(gid==='fruitGrid') lines=FRUIT_LINES[item.n];
  else if(gid==='iceGrid') lines=[ICE_LINES[i%ICE_LINES.length]];
  else if(gid==='frozenGrid') lines=[FROZEN_LINES[i%FROZEN_LINES.length]];
  else if(gid==='garnishGrid') lines=[GARNISH_LINES[i%GARNISH_LINES.length]];
  if(!lines||!lines.length) return;
  // show first line immediately, second after a beat
  const l1=lines[0];
  showSideBubble(l1.g, l1.kao, l1.txt, 0.35+Math.random()*.15);
  if(lines[1]){
    const l2=lines[1];
    setTimeout(()=>showSideBubble(l2.g, l2.kao, l2.txt, 0.52+Math.random()*.12), 900);
  }
}

