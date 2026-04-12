import { renderGen } from "./render.js";

export function createGenSection(gen, data) {
  const container = document.getElementById("gens-container");

  const section = document.createElement("div");
  section.classList.add("gen-section");
  section.dataset.gen = gen;

  const header = document.createElement("div");
  header.classList.add("gen-header");

  const title = document.createElement("span");
  title.textContent = `Gen ${gen}`;

  const progressText = document.createElement("span");
  progressText.classList.add("gen-progress-text");

  header.appendChild(title);
  header.appendChild(progressText);

  const progressBar = document.createElement("div");
  progressBar.classList.add("gen-progress-bar");

  const progressFill = document.createElement("div");
  progressFill.classList.add("gen-progress-fill");

  progressBar.appendChild(progressFill);

  const content = document.createElement("div");
  content.classList.add("gen-content");

  const grid = document.createElement("div");
  grid.classList.add("gen-grid");

  content.appendChild(grid);

  section.appendChild(header);
  section.appendChild(progressBar);
  section.appendChild(content);

  container.appendChild(section);

  header.addEventListener("click", () => {
    section.classList.toggle("collapsed");
  });

  renderGen(data.pokemon, grid);

  updateGenProgress(gen, data.pokemon, progressText, progressFill);
}

export function updateGenProgress(gen, list, textEl, barEl) {
  const total = list.length;
  const caught = list.filter(p => p.caught).length;

  const percent = total === 0 ? 0 : Math.round((caught / total) * 100);

  textEl.textContent = `${caught} / ${total} (${percent}%)`;
  barEl.style.width = `${percent}%`;
}