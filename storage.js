const KEY = "deepavali-creations-v1";
export function getCreations() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function addCreation({name,image}) {
  const items = getCreations();
  const item = {id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, image, date:Date.now()};
  try { localStorage.setItem(KEY, JSON.stringify([item,...items].slice(0,24))); return item; } catch { return null; }
}
export function deleteCreation(id) { localStorage.setItem(KEY, JSON.stringify(getCreations().filter(x=>x.id!==id))); }
export function dataUrlFromCanvas(canvas) { return canvas.toDataURL("image/png"); }