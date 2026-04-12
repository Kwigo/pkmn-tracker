import { loadAllGens } from "./data.js";
import { renderGen } from "./render.js";
import { state } from "./state.js";

loadAllGens();

let allCollapsed = false;

document.getElementById("collapse-all").addEventListener("click", () => {
  const sections = document.querySelectorAll(".gen-section");

  allCollapsed = !allCollapsed;

  sections.forEach(section => {
    section.classList.toggle("collapsed", allCollapsed);
  });

  document.getElementById("collapse-all").textContent =
    allCollapsed ? "Expand All" : "Collapse All";
});

function applyFilter(filter) {
    state.filter = filter;
  
    document.querySelectorAll(".gen-section").forEach(section => {
      const gen = section.dataset.gen;
      const grid = section.querySelector(".gen-grid");
  
      let data = state.data[gen]?.pokemon || [];
  
      if (filter === "caught") {
        data = data.filter(p => p.caught);
      }
      if (filter === "not caught") {
        data = data.filter(p => !p.caught);
      }
      if (filter === "shiny") {
        data = data.filter(p => p.shiny);
      }
  
      renderGen(data, grid);
    });
  }
  
  document.querySelectorAll("#global-filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      applyFilter(btn.innerText.toLowerCase());
    });
  });