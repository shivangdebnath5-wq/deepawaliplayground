export function initGoldenHour(toast){
  const canvas=document.getElementById("goldenCanvas"),ctx=canvas.getContext("2d"),slider=document.getElementById("timeSlider"),label=document.getElementById("timeLabel");let active=false,homes=[],raf=0,stage=68;
  function draw(){const w=canvas.width,h=canvas.height,t=stage/100;const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,mix("#ed9b62","#080d22",t));sky.addColorStop(.58,mix("#d57d54","#17172c",t));sky.addColorStop(1,"#151526");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    const sunY=130+(t*180);ctx.beginPath();ctx.arc(1110,sunY,55,0,Math.PI*2);ctx.fillStyle=`rgba(255,195,117,${.9-t*.8})`;ctx.shadowColor="#ffb56c";ctx.shadowBlur=70;ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle="#171a2b";ctx.fillRect(0,470,w,150);
    homes=[];const blocks=[{x:65,y:240,w:245,h:235},{x:345,y:180,w:270,h:295},{x:665,y:255,w:220,h:220},{x:935,y:195,w:340,h:280}];
    blocks.forEach((b,i)=>{ctx.fillStyle=["#28273a","#30283b","#25263a","#302a3c"][i];ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle="#3c3040";ctx.beginPath();ctx.moveTo(b.x-18,b.y);ctx.lineTo(b.x+b.w/2,b.y-85);ctx.lineTo(b.x+b.w+18,b.y);ctx.closePath();ctx.fill();ctx.fillStyle="#b37b52";ctx.fillRect(b.x+b.w*.42,b.y+b.h-90,b.w*.17,90);
      const cols=3,rows=2;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=b.x+28+c*(b.w-70)/(cols-1),y=b.y+55+r*72;const lit=(t>.23&&Math.random()>.02)||homes.some(h=>h.i===i&&h.on);ctx.fillStyle=lit?"#eebd73":"#11182a";ctx.fillRect(x,y,30,37);if(lit){ctx.fillStyle="#ffdb91";ctx.globalAlpha=.16;ctx.fillRect(x-9,y-9,48,55);ctx.globalAlpha=1;}}
      homes.push({x:b.x,y:b.y-85,w:b.w,h:b.h+85,i,on:false});});
    // Street and rangoli details
    ctx.fillStyle="#a8784d";ctx.globalAlpha=.25;ctx.fillRect(0,490,w,3);ctx.globalAlpha=1;
    for(let i=0;i<24;i++){const x=30+i*58,y=485+(i%2)*25;ctx.fillStyle="#dca75e";ctx.shadowColor="#ffc46c";ctx.shadowBlur=12;ctx.beginPath();ctx.ellipse(x,y,8,3,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    // Hanging festive lights
    ctx.strokeStyle="#b28b6a";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,80);ctx.quadraticCurveTo(700,220,1400,85);ctx.stroke();for(let i=0;i<34;i++){const x=i*43,y=95+Math.sin(i/33*Math.PI)*90;ctx.fillStyle=`hsl(${35+i*2},85%,${t>0.2?65:45}%)`;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=t>0.25?13:2;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();}ctx.shadowBlur=0;
    // Stars
    if(t>.45){for(let i=0;i<100;i++){const x=(i*137)%w,y=(i*71)%360;ctx.fillStyle=`rgba(255,236,196,${.15+((i%5)/10)})`;ctx.fillRect(x,y,2,2);}}
    // Firework-like distant bursts, purely decorative
    if(t>.82){for(let j=0;j<3;j++){const x=260+j*440,y=115+(j%2)*55;for(let i=0;i<18;i++){const a=i*Math.PI/9;ctx.strokeStyle=`hsla(${35+j*35},85%,70%,.55)`;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*12,y+Math.sin(a)*12);ctx.lineTo(x+Math.cos(a)* (45+(i%3)*8),y+Math.sin(a)*(45+(i%3)*8));ctx.stroke();}}}
  }
  function mix(a,b,t){const pa=a.match(/\w\w/g).map(x=>parseInt(x,16)),pb=b.match(/\w\w/g).map(x=>parseInt(x,16));return "#"+pa.map((v,i)=>Math.round(v*(1-t)+pb[i]*t).toString(16).padStart(2,"0")).join("");}
  function render(){if(!active)return;draw();raf=requestAnimationFrame(render);}
  function activate(){active=true;draw();}
  slider.addEventListener("input",()=>{stage=+slider.value;label.textContent=stage<20?"EVENING":stage<48?"PREPARATION":stage<82?"FESTIVE NIGHT":"CELEBRATION";draw();});
  canvas.addEventListener("click",e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const hx=x*canvas.width/r.width,hy=y*canvas.height/r.height;const h=homes.find(a=>hx>=a.x&&hx<=a.x+a.w&&hy>=a.y&&hy<=a.y+a.h);if(h){h.on=!h.on;draw();toast(h.on?"A home has been illuminated.":"The lights have been dimmed.");}});
  document.getElementById("goldenReset").addEventListener("click",()=>{stage=0;slider.value=0;label.textContent="EVENING";homes=[];draw();});
  return{activate};
}