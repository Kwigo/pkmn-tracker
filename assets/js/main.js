function formatSpriteName(name) {
  const regions = ["alolan", "galarian", "hisuian", "paldean"];

  let clean = removeAccents(name.toLowerCase());
  let parts = clean.split(" ");

  if (regions.includes(parts[0])) {
    const region = parts.shift();
    parts.push(region);
  }

  let formatted = parts.join("-");

  formatted = formatted
    .toLowerCase()
    .replace("♀", "-f")
    .replace("♂", "-m")
    .replace(/\./g, "")
    .replace("unown", "unown-a")
    .replace("'", "")
    .replace(":", "")
    .replace("deoxys", "deoxys-normal")
    .replace("burmy", "burmy-plant")
    .replace("wormadam", "wormadam-plant")
    .replace("é", "e")
    .replace("furfrou", "furfrou-natural")
    .replace("zygarde", "zygarde-50")

  return formatted;
}

function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

    const id = String(p.id).padStart(4, "0");

    const caughtText = p.caught
      ? `Caught: ${p.catchDate || "Unknown"}`
      : "Not caught";

    card.innerHTML = `
      <div class="sprite-wrapper">
        <img class="sprite" src="assets/sprites/gen${p.gen}/${formatSpriteName(p.name)}.png" />
        ${p.shiny ? `<img class="shiny-sparkle" src="assets/ui/sparkle.gif" />` : ""}
      </div>

      <h3>#${id} ${p.name}</h3>
      <p class="catch-date">${caughtText}</p>
    `;

    // ✅ CLICK LOGIC (EDIT MODE)
    card.addEventListener("click", () => {
      if (!editMode) return;

      p.caught = !p.caught;

      if (p.caught) {
        p.catchDate = new Date().toISOString().split("T")[0];
      } else {
        p.catchDate = null;
        p.shiny = false;
      }

      renderGen(pokemonList, grid);
      updateGenProgressFromList();
    });

    // ✅ RIGHT CLICK SHINY
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      if (!editMode) return;
      if (!p.caught) return;

      p.shiny = !p.shiny;

      renderGen(pokemonList, grid);
      updateGenProgressFromList();
    });

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

let editMode = false;

document.getElementById("edit-mode").addEventListener("click", () => {
  editMode = !editMode;

  document.getElementById("edit-mode").textContent =
    `Edit Mode: ${editMode ? "ON" : "OFF"}`;

  document.body.classList.toggle("edit-mode", editMode);
});

document.getElementById("export-json").addEventListener("click", () => {
  Object.entries(state.data).forEach(([gen, pokemonList]) => {
    const blob = new Blob([JSON.stringify({ pokemon: pokemonList }, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `gen${gen}.json`;
    a.click();

    URL.revokeObjectURL(url);
  });
});

function updateGenProgressFromList() {
  document.querySelectorAll(".gen-section").forEach(section => {
    const gen = section.dataset.gen;

    const data = state.data[gen]?.pokemon || [];

    const textEl = section.querySelector(".gen-progress-text");
    const barEl = section.querySelector(".gen-progress-fill");

    updateGenProgress(gen, data, textEl, barEl);
  });
}
