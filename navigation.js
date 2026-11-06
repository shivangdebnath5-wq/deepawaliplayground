export function initNavigation() {
  const pages = [...document.querySelectorAll(".page")];
  const navButtons = [...document.querySelectorAll(".nav-link")];
  const menu = document.querySelector(".desktop-nav");
  const menuToggle = document.getElementById("menuToggle");
  let current = "home", callback = () => {};
  const map = {home:"home",experiences:"experiences",gallery:"gallery",about:"about",rangoli:"rangoli",diya:"diya",paint:"paint",golden:"golden"};
  function go(name) {
    const id = map[name] || "home";
    current = id;
    pages.forEach(p => p.classList.toggle("active", p.id === `page-${id}`));
    navButtons.forEach(b => b.classList.toggle("active", b.dataset.page === id || (id==="rangoli"||id==="diya"||id==="paint"||id==="golden") && b.dataset.page==="experiences"));
    menu.classList.remove("open");
    window.scrollTo({top:0,behavior:"smooth"});
    callback(id);
  }
  document.querySelectorAll(".wordmark").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go("home")}));
  menuToggle.addEventListener("click",()=>menu.classList.toggle("open"));
  return {go,onChange(fn){callback=fn},get current(){return current}};
}