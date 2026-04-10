import { renderGen } from "./render.js";

export function createGenSection(gen, data, container) {
  const section = document.createElement("div");
  section.classList.add("gen-section");
  section.dataset.gen = gen;

  const header = document.createElement("div");
  header.classList.add("gen-header");
  header.innerText = `Gen ${gen}`;

  const grid = document.createElement("div");
  grid.classList.add("gen-grid");

  section.appendChild(header);
  section.appendChild(grid);
  container.appendChild(section);

  renderGen(data.pokemon ?? data, grid);
}