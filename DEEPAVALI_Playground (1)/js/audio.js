export function initAudio(){
  let context=null,master=null,on=false,oscillators=[];
  async function toggle(){if(on){master.gain.setTargetAtTime(0,context.currentTime,.15);on=false;return false;}try{context ||= new (window.AudioContext||window.webkitAudioContext)();await context.resume();if(!master){master=context.createGain();master.gain.value=0;master.connect(context.destination);const a=context.createOscillator(),b=context.createOscillator(),gain=context.createGain();a.type="sine";b.type="triangle";a.frequency.value=110;b.frequency.value=164.81;gain.gain.value=.018;a.connect(gain);b.connect(gain);gain.connect(master);a.start();b.start();oscillators=[a,b];}master.gain.setTargetAtTime(.55,context.currentTime,.8);on=true;return true;}catch{return false;}}
  return{toggle};
}