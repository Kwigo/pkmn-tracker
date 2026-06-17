// Standalone demo: render Pokémon cards using PokéAPI sprites instead of
// local image files. Nothing here imports from (or affects) assets/js/*.
// It reuses your real assets/data/genN.json files for the roster.

// PokéAPI's sprite repo, served via the jsDelivr CDN. Every path is keyed by
// national dex NUMBER (p.id) — no name formatting needed at all.
const CDN = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon";

// The three sprite styles worth comparing. Each knows how to build its URL
// for both the normal and the shiny variant.
const STYLES = {
  pixel: {
    label: "Game pixel sprites",
    url: (id, shiny) => `${CDN}/${shiny ? "shiny/" : ""}${id}.png`,
  },
  home: {
    label: "Pokémon HOME renders",
    url: (id, shiny) => `${CDN}/other/home/${shiny ? "shiny/" : ""}${id}.png`,
  },
  artwork: {
    label: "Official artwork",
    url: (id, shiny) =>
      `${CDN}/other/official-artwork/${shiny ? "shiny/" : ""}${id}.png`,
  },
};

// Current control values.
const settings = {
  gen: 1,
  style: "pixel",
  shiny: false,
};

const grid = document.getElementById("grid");
const status = document.getElementById("status");

async function loadAndRender() {
  const { gen, style, shiny } = settings;

  status.textContent = `Loading gen ${gen}…`;
  grid.innerHTML = "";

  let list;
  try {
    // Note the ../ — this demo lives in experiments/, the data in assets/data/.
    const res = await fetch(`../assets/data/gen${gen}.json`);
    const data = await res.json();
    list = data.pokemon ?? data;
  } catch (err) {
    status.textContent = `Couldn't load gen ${gen}.json — are you serving the site over http?`;
    console.error(err);
    return;
  }

  status.textContent = `Gen ${gen} — ${list.length} Pokémon · ${STYLES[style].label}${shiny ? " · shiny" : ""}`;

  for (const p of list) {
    const card = document.createElement("div");
    card.className = "card";

    const src = STYLES[style].url(p.id, shiny);
    const id = String(p.id).padStart(4, "0");

    card.innerHTML = `
      <img class="sprite" src="${src}" alt="${p.name}" loading="lazy" />
      <div class="name">#${id} ${p.name}</div>
    `;

    grid.appendChild(card);
  }
}

// Wire up the controls.
document.getElementById("gen").addEventListener("change", (e) => {
  settings.gen = Number(e.target.value);
  loadAndRender();
});

document.getElementById("style").addEventListener("change", (e) => {
  settings.style = e.target.value;
  loadAndRender();
});

document.getElementById("shiny").addEventListener("change", (e) => {
  settings.shiny = e.target.checked;
  loadAndRender();
});

loadAndRender();
