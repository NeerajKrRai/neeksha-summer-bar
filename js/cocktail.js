// ── GLASS SVG ─────────────────────────────────────
function makeGlass(el,opts){
  const lc=opts.lc||'#3a508a',lc2=opts.lc2||'#1a2858';
  const sc=opts.sc||'#C97B84',fe=opts.fe||'🍋',gs=opts.gs||'🌿';
  const id='g'+Math.random().toString(36).slice(2,6);
  if(opts.asWrap){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 150 220');svg.setAttribute('fill','none');
    svg.style.width=opts.w||'clamp(96px,26vw,148px)';
    _fillGlass(svg,lc,lc2,sc,fe,gs,id);
    el.appendChild(svg);
  } else _fillGlass(el,lc,lc2,sc,fe,gs,id);
}
function _fillGlass(svg,lc,lc2,sc,fe,gs,id){
  svg.innerHTML=`
  <defs>
    <linearGradient id="gl${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="white" stop-opacity=".52"/><stop offset="44%" stop-color="white" stop-opacity=".1"/><stop offset="100%" stop-color="white" stop-opacity=".52"/>
    </linearGradient>
    <linearGradient id="lq${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${lc}"/><stop offset="100%" stop-color="${lc2}"/>
    </linearGradient>
    <linearGradient id="sh${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="white" stop-opacity=".32"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <filter id="bl${id}"><feGaussianBlur stdDeviation="2.5"/></filter>
  </defs>
  <ellipse cx="75" cy="216" rx="40" ry="5.5" fill="rgba(0,0,0,.22)" filter="url(#bl${id})"/>
  <polygon points="18,22 132,22 110,200 40,200" fill="url(#gl${id})" stroke="rgba(255,255,255,.32)" stroke-width="1.8"/>
  <polygon id="lqfill${id}" points="26,80 124,80 110,200 40,200" fill="url(#lq${id})" opacity=".9"/>
  <ellipse id="lqtop${id}" cx="75" cy="80" rx="49" ry="9" fill="white" opacity=".2"/>
  <rect x="44" y="110" width="24" height="20" rx="5" fill="rgba(255,255,255,.4)" stroke="rgba(255,255,255,.65)" stroke-width="1.2"/>
  <rect x="76" y="122" width="22" height="18" rx="5" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.6)" stroke-width="1"/>
  <rect x="50" y="152" width="18" height="15" rx="4" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.5)" stroke-width="1"/>
  <rect x="12" y="15" width="126" height="11" rx="5.5" fill="rgba(255,255,255,.52)" stroke="rgba(255,255,255,.75)" stroke-width="1.4"/>
  <rect x="98" y="7" width="9" height="105" rx="4.5" fill="${sc}" transform="rotate(7,98,7)" opacity=".88"/>
  <polygon points="22,32 38,32 34,152 18,152" fill="url(#sh${id})"/>
  <circle cx="118" cy="28" r="15" fill="${lc}" opacity=".82" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>
  <text x="118" y="34" text-anchor="middle" font-size="13">${fe}</text>
  <text x="75" y="74" text-anchor="middle" font-size="12">${gs}</text>
  <rect x="33" y="198" width="84" height="13" rx="6.5" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.28)" stroke-width="1.4"/>
  `;
}

// ── LIQUID LEVEL (the cup empties as you sip) ──────
// Glass is a trapezoid: sides (18,22)->(40,200) and (132,22)->(110,200), bottom y=200.
// f = fill fraction, 1 = full (liquid top y=80), 0 = empty (top y=200).
function setGlassFill(id,f){
  f=Math.max(0,Math.min(1,f));
  const fill=document.getElementById('lqfill'+id);
  if(!fill)return;
  fill._f=f;
  const yTop=200-120*f;
  const xL=18+22*(yTop-22)/178, xR=132-22*(yTop-22)/178;
  fill.setAttribute('points',`${xL.toFixed(1)},${yTop.toFixed(1)} ${xR.toFixed(1)},${yTop.toFixed(1)} 110,200 40,200`);
  const top=document.getElementById('lqtop'+id);
  if(top){ top.setAttribute('cy',yTop.toFixed(1)); top.setAttribute('rx',((xR-xL)/2).toFixed(1)); top.setAttribute('opacity',f>0.02?0.2:0); }
}
const _glassTimer={};
function drainGlassTo(id,target,ms){
  const fill=document.getElementById('lqfill'+id);
  if(!fill)return;
  if(_glassTimer[id])clearTimeout(_glassTimer[id]);
  const start=(fill._f!==undefined)?fill._f:1, delta=target-start, t0=performance.now();
  (function step(){
    const p=Math.min(1,(performance.now()-t0)/(ms||500)), e=1-Math.pow(1-p,3); // easeOutCubic
    setGlassFill(id,start+delta*e);
    if(p<1)_glassTimer[id]=setTimeout(step,16);
  })();
}

