import { loadAllGens } from "./data.js";
import { renderGen } from "./render.js";
import { state } from "./state.js";

//render the page
loadAllGens();

//collapse button
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

//Apply filters and render pkmn inside each gen
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
  
//Filter buttons   
const buttons = document.querySelectorAll("#global-filters button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilter(btn.innerText.toLowerCase());
  });
});

// set default for "all" button
const allBtn = Array.from(buttons).find(
  btn => btn.innerText.toLowerCase() === "all"
);

if (allBtn) {
  allBtn.classList.add("active");
  applyFilter("all");
}

//Edit mode
const editBtn = document.getElementById("edit-mode");

editBtn.addEventListener("click", () => {
  state.editMode = !state.editMode;

  editBtn.textContent =
    `Edit Mode: ${state.editMode ? "ON" : "OFF"}`;

  document.body.classList.toggle("edit-mode", state.editMode);
});

//DL updated json
document.getElementById("export-json").addEventListener("click", () => {
  Object.entries(state.data).forEach(([gen, value]) => {
    const pokemonList = value.pokemon;

    const blob = new Blob(
      [JSON.stringify({ pokemon: pokemonList }, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `gen${gen}.json`;
    a.click();

    URL.revokeObjectURL(url);
  });
});