export function initLightPainting(toast){
  const canvas=document.getElementById("paintCanvas"),ctx=canvas.getContext("2d");let drawing=false,last=null,color="#f5b84b",size=8,brightness=.8,brush="gold",hue=0,history=[];
  function resize(){const old=document.createElement("canvas");old.width=canvas.width;old.height=canvas.height;if(old.width)old.getContext("2d").drawImage(canvas,0,0);const w=canvas.clientWidth||900;canvas.width=Math.round(w* Math.min(devicePixelRatio||1,2));canvas.height=Math.round(w*580/1200*Math.min(devicePixelRatio||1,2));ctx.setTransform(canvas.width/w,0,0,canvas.width/w,0,0);if(old.width)ctx.drawImage(old,0,0,canvas.width,canvas.height);}
  function save(){history.push(canvas.toDataURL());if(history.length>20)history.shift();}
  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function stroke(a,b){ctx.save();ctx.globalAlpha=brightness;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=size;ctx.shadowBlur=brush==="sparkle"?18:22;ctx.shadowColor=brush==="rainbow"?`hsl(${hue},100%,65%)`:color;ctx.strokeStyle=brush==="rainbow"?`hsl(${hue},100%,68%)`:color;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();hue=(hue+3)%360;if(brush==="sparkle"||brush==="particle"){for(let i=0;i<2;i++){const x=b.x+(Math.random()-.5)*size*5,y=b.y+(Math.random()-.5)*size*5;ctx.save();ctx.globalAlpha=Math.random()*.8;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,Math.random()*2+1,0,Math.PI*2);ctx.fill();ctx.restore();}}}
  canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);save();last=point(e);stroke(last,last);});
  canvas.addEventListener("pointermove",e=>{if(!drawing)return;const p=point(e);stroke(last,p);last=p;});
  const end=()=>{drawing=false;last=null;};canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
  canvas.addEventListener("click",e=>{if(drawing)return;const p=point(e);burst(p.x,p.y);});
  function burst(x,y){for(let i=0;i<65;i++){const a=Math.random()*Math.PI*2,d=10+Math.random()*100;ctx.save();ctx.globalAlpha=.9;ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.lineWidth=Math.random()*2+1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d);ctx.stroke();ctx.restore();}}
  document.getElementById("paintBrush").addEventListener("change",e=>brush=e.target.value);
  document.getElementById("paintColors").addEventListener("click",e=>{const b=e.target.closest("[data-color]");if(!b)return;color=b.dataset.color;document.querySelectorAll("#paintColors .swatch").forEach(x=>x.classList.toggle("selected",x===b));});
  document.getElementById("paintSize").addEventListener("input",e=>{size=+e.target.value;document.getElementById("paintSizeValue").value=size;});
  document.getElementById("paintBright").addEventListener("input",e=>{brightness=+e.target.value/100;document.getElementById("paintBrightValue").value=e.target.value+"%";});
  document.getElementById("paintBurst").addEventListener("click",()=>{save();burst(canvas.width/2,canvas.height/2);});
  document.getElementById("paintClear").addEventListener("click",()=>{save();ctx.clearRect(0,0,canvas.width,canvas.height);});
  document.getElementById("paintUndo").addEventListener("click",()=>{const data=history.pop();if(!data){toast("Nothing to undo yet.");return;}const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);};img.src=data;});
  resize();window.addEventListener("resize",resize);return{canvas,resize};
}