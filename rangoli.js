export function initRangoli(toast) {
  const canvas=document.getElementById("rangoliCanvas"),ctx=canvas.getContext("2d");
  let symmetry=8,brush="petal",color="#f5b84b",size=12,drawing=false,last=null,history=[],strokes=[];
  const dpr=Math.min(devicePixelRatio||1,2);
  function setup(){const rect=canvas.getBoundingClientRect(); if(!rect.width)return; const old=document.createElement("canvas");old.width=canvas.width;old.height=canvas.height;old.getContext("2d").drawImage(canvas,0,0);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(Math.max(340,rect.height)*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);redraw();}
  function center(){return {x:canvas.clientWidth/2,y:canvas.clientHeight/2};}
  function save(){history.push(canvas.toDataURL());if(history.length>25)history.shift();}
  function drawStamp(x,y,angle,prev){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,size*.18);ctx.lineCap="round";ctx.shadowColor=color;ctx.shadowBlur=brush==="free"?2:8;
    const r=size;
    if(brush==="dot"){ctx.beginPath();ctx.arc(0,0,r*.42,0,Math.PI*2);ctx.fill();}
    else if(brush==="petal"){ctx.beginPath();ctx.ellipse(0,-r*.7,r*.38,r*.9,0,0,Math.PI*2);ctx.fill();}
    else if(brush==="diamond"){ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r*.55,0);ctx.lineTo(0,r);ctx.lineTo(-r*.55,0);ctx.closePath();ctx.fill();}
    else if(brush==="line"){ctx.beginPath();ctx.moveTo(-r*.8,0);ctx.lineTo(r*.8,0);ctx.stroke();}
    else {ctx.beginPath();ctx.arc(0,0,Math.max(1,r*.18),0,Math.PI*2);ctx.fill();}
    ctx.restore();}
  function stampAt(x,y){const c=center(),dx=x-c.x,dy=y-c.y,dist=Math.hypot(dx,dy),base=Math.atan2(dy,dx);for(let i=0;i<symmetry;i++){const a=i*Math.PI*2/symmetry,rx=c.x+dist*Math.cos(base+a),ry=c.y+dist*Math.sin(base+a);drawStamp(rx,ry,a);}}
  function lineAt(x,y){if(!last){stampAt(x,y);last={x,y};return;}const dx=x-last.x,dy=y-last.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/(size*.55)));for(let j=1;j<=n;j++)stampAt(last.x+dx*j/n,last.y+dy*j/n);last={x,y};}
  function pos(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
  canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);save();last=null;const p=pos(e);lineAt(p.x,p.y);});
  canvas.addEventListener("pointermove",e=>{if(!drawing)return;const p=pos(e);lineAt(p.x,p.y);});
  const end=()=>{drawing=false;last=null;};canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
  function redraw(){ctx.clearRect(0,0,canvas.width/dpr,canvas.height/dpr);ctx.fillStyle="#0b1020";ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);ctx.save();ctx.strokeStyle="#ffffff0b";ctx.lineWidth=1;const c=center();ctx.beginPath();ctx.arc(c.x,c.y,Math.min(c.x,c.y)*.82,0,Math.PI*2);ctx.stroke();ctx.restore();}
  document.getElementById("symmetry").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;symmetry=+b.dataset.value;document.querySelectorAll("#symmetry button").forEach(x=>x.classList.toggle("selected",x===b));});
  document.getElementById("rangoliBrush").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;brush=b.dataset.brush;document.querySelectorAll("#rangoliBrush button").forEach(x=>x.classList.toggle("selected",x===b));});
  document.getElementById("rangoliColors").addEventListener("click",e=>{const b=e.target.closest("[data-color]");if(!b)return;color=b.dataset.color;document.querySelectorAll("#rangoliColors .swatch").forEach(x=>x.classList.toggle("selected",x===b));});
  document.getElementById("rangoliSize").addEventListener("input",e=>{size=+e.target.value;document.getElementById("rangoliSizeValue").value=size;});
  document.getElementById("rangoliClear").addEventListener("click",()=>{save();redraw();});
  document.getElementById("rangoliUndo").addEventListener("click",()=>{const data=history.pop();if(!data){toast("Nothing to undo yet.");return;}const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width/dpr,canvas.height/dpr);};img.src=data;});
  document.getElementById("rangoliGenerate").addEventListener("click",()=>{save();redraw();const c=center(),max=Math.min(c.x,c.y)*.72,palette=["#f5b84b","#d94d5c","#9c78d5","#42a9b0","#f2df9b","#6fa879"];for(let ring=0;ring<5;ring++){const radius=max*(.18+ring*.17),count=symmetry*(ring%2?2:1),col=palette[Math.floor(Math.random()*palette.length)];ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle=col;ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=7;for(let i=0;i<count;i++){const a=i*Math.PI*2/count+Math.random()*.08;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,-radius,Math.max(3,size*.55),Math.max(7,size*(1.2+Math.random())),0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.restore();}ctx.save();ctx.translate(c.x,c.y);ctx.strokeStyle="#f5d28d";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,max*.12,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#f5b84b";ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();ctx.restore();toast("A new rangoli pattern has bloomed.");});
  setup();window.addEventListener("resize",()=>{if(document.getElementById("page-rangoli").classList.contains("active"))setup();});
  return {canvas,resize:setup};
}