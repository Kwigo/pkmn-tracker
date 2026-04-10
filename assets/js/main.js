const gens = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const state = {
    filter: "all",
    data: {} //store all gen data here
};

async function loadAllGens() {
  for (const gen of GENS) {
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
  header.innerText = `Gen ${gen}`;

  const content = document.createElement("div");
  content.classList.add("gen-content");

  const grid = document.createElement("div");
  grid.classList.add("gen-grid");

  content.appendChild(grid);
  section.appendChild(header);
  section.appendChild(content);
  container.appendChild(section);

  header.addEventListener("click", () => {
  section.classList.toggle("collapsed");
  });

  renderGen(data.pokemon, grid);
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

document.getElementById("collapse-all").addEventListener("click", () => {
  document.querySelectorAll(".gen-section").forEach(section => {
    section.classList.add("collapsed");
  });
});

function applyFilter(filter) {
  state.filter = filter;

  document.querySelectorAll(".gen-section").forEach(section => {
    const gen = section.dataset.gen;
    const grid = section.querySelector(".gen-grid");

    let data = state.data[gen].pokemon;

    if (filter === "caught") {
      data = data.filter(p => p.caught);
    }
    if (filter === "uncaught") {
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
/*
const selector = document.getElementById("gen-selector");

gens.forEach(gen => {
  const btn = document.createElement("button");
  btn.innerText = `Gen ${gen}`;

  btn.addEventListener("click", () => loadGen(gen));

  selector.appendChild(btn);
})

//async loading of json data
async function loadGen(gen) {
  const res = await fetch(`assets/data/gen${gen}.json`);
  const data = await res.json();

  const app = document.getElementById("app");
  app.innerHTML = "";


  data.pokemon.forEach(pkmn => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="assets/sprites/gen${pkmn.gen}/${pkmn.sprite}" />
      <h3>${pkmn.name}</h3>
      <p>#${pkmn.id}</p>
    `;
  app.appendChild(card);
  });;
}

loadGen(1);*/
