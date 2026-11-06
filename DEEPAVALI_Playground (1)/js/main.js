import { initNavigation } from "./navigation.js";
import { initRangoli } from "./rangoli.js";
import { initDiyaVerse } from "./diya-verse.js";
import { initLightPainting } from "./light-painting.js";
import { initGoldenHour } from "./golden-hour.js";
import { initAudio } from "./audio.js";
import { addCreation, getCreations, deleteCreation, dataUrlFromCanvas } from "./storage.js";

const toastEl = document.getElementById("toast");
let toastTimer;
export function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}
const nav = initNavigation();
const audio = initAudio();
const rangoli = initRangoli(toast);
const diya = initDiyaVerse(toast);
const paint = initLightPainting(toast);
const golden = initGoldenHour(toast);

document.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click", () => nav.go(el.dataset.open)));
document.querySelectorAll("[data-page]").forEach(el => el.addEventListener("click", () => nav.go(el.dataset.page)));
document.querySelectorAll("[data-scroll]").forEach(el => el.addEventListener("click", () => document.getElementById(el.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));

document.getElementById("soundToggle").addEventListener("click", async e => {
  const on = await audio.toggle();
  e.currentTarget.classList.toggle("on", on);
  e.currentTarget.querySelector("span:last-child").textContent = on ? "Sound on" : "Sound off";
});

document.getElementById("rangoliSave").addEventListener("click", () => saveCanvas("Rangoli", rangoli.canvas));
document.getElementById("paintSave").addEventListener("click", () => saveCanvas("Light Painting", paint.canvas));
document.getElementById("diyaSave").addEventListener("click", () => {
  const image = diya.snapshot();
  if (image) saveImage("DiyaVerse", image);
});
document.getElementById("galleryGrid").addEventListener("click", e => {
  const card = e.target.closest("[data-delete]");
  if (card) { deleteCreation(card.dataset.delete); renderGallery(); toast("Creation removed from your gallery."); }
  const download = e.target.closest("[data-download]");
  if (download) {
    const item = getCreations().find(x => x.id === download.dataset.download);
    if (item) downloadData(item.image, `${item.name.replace(/\s+/g,"-").toLowerCase()}.png`);
  }
});

function saveCanvas(name, canvas) {
  try { saveImage(name, dataUrlFromCanvas(canvas)); }
  catch { toast("Couldn't save this creation. Try a smaller canvas."); }
}
function saveImage(name, image) {
  const result = addCreation({name, image});
  if (result) { toast("Saved to My Creations."); renderGallery(); }
  else toast("Your browser storage is full. Delete an older creation and try again.");
}
function downloadData(data, filename) {
  const a = document.createElement("a"); a.href = data; a.download = filename; a.click();
}
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  const items = getCreations();
  if (!items.length) {
    grid.innerHTML = `<div class="gallery-empty"><span>✳</span><h3>Your gallery is waiting.</h3><p>Create something in the playground, then save it here.</p><button class="button button-primary" data-page="experiences">Explore experiences ↗</button></div>`;
    grid.querySelector("[data-page]").addEventListener("click", () => nav.go("experiences"));
    return;
  }
  grid.innerHTML = items.map(item => `<article class="creation-card"><img src="${item.image}" alt="${escapeHtml(item.name)} preview"><div class="creation-meta"><strong>${escapeHtml(item.name)}</strong><small>${new Date(item.date).toLocaleString()}</small><div class="creation-actions"><button data-download="${item.id}">Download ↓</button><button data-delete="${item.id}">Delete</button></div></div></article>`).join("");
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
renderGallery();
nav.onChange(page => {
  if (page === "gallery") renderGallery();
  if (page === "diya") diya.activate();
  if (page === "golden") golden.activate();
  if (page === "paint") paint.resize();
  if (page === "rangoli") rangoli.resize();
});
