const gens = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const state = {
    filter: "all",
    data: {} //store all gen data here
};

async function loadAllGens() {
  for (const gen of gens) {
    const res = await fetch(`assets/data/gen${gen}.json`);
    const data = await res.json();

    state.data[gen] = data;

    createGenSection(gen, data);
  }
}

function createGenSection(gen, data) {
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

function updateGenProgress(gen, list, textEl, barEl) {
  const total = list.length;
  const caught = list.filter(p => p.caught).length;

  const percent = total === 0 ? 0 : Math.round((caught / total) * 100);

  textEl.textContent = `${caught} / ${total} (${percent}%)`;
  barEl.style.width = `${percent}%`;
}

function renderGen(pokemonList, grid) {
  grid.innerHTML = "";

  pokemonList.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="assets/sprites/gen${p.gen}/${p.sprite}" />
      <h3>${p.name}</h3>
      <p>#${p.id}</p>
    `;

    grid.appendChild(card);
  });
}

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
    if (filter === "Not caught") {
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

loadAllGens();
