import { renderGen } from "./render.js";
import { state } from "./state.js";

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

  const list = data.pokemon ?? data;
  renderGen(list, grid);

  updateGenProgress(gen, list, progressText, progressFill);
}

function updateGenProgress(gen, list, textEl, barEl) {
  const total = list.length;
  const caught = list.filter(p => p.caught).length;

  const percent = total === 0 ? 0 : Math.round((caught / total) * 100);

  textEl.textContent = `${caught} / ${total} (${percent}%)`;
  barEl.style.width = `${percent}%`;
}

function updateGenProgressFromList() {
  document.querySelectorAll(".gen-section").forEach(section => {
    const gen = section.dataset.gen;

    const data = state.data[gen]?.pokemon || [];

    const textEl = section.querySelector(".gen-progress-text");
    const barEl = section.querySelector(".gen-progress-fill");

    updateGenProgress(gen, data, textEl, barEl);
  });
}
