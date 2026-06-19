import { state } from "./state.js";
import { updateGenProgressFromList } from "./ui.js";

// PokéAPI's sprite CDN. Every path is keyed by national dex number (p.id),
// so there's no name formatting to do — the id we already have is the key.
const SPRITE_CDN = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon";

function spriteUrl(p) {
  // Gens 1-9 are keyed by national dex number (p.id). Variant forms (gen 0)
  // carry a resolved PokéAPI form id in p.spriteId; fall back to p.id otherwise.
  const id = p.spriteId ?? p.id;
  return `${SPRITE_CDN}/${p.shiny ? "shiny/" : ""}${id}.png`;
}

export function renderGen(pokemonList, grid) {
  if (!Array.isArray(pokemonList)) {
    console.error("Invalid pokemonList:", pokemonList);
    return;
  }

  grid.innerHTML = "";

  pokemonList.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (p.shiny) card.classList.add("shiny");

    const id = String(p.id).padStart(4, "0");

    const caughtText = p.caught
      ? `Caught: ${p.caughtDate || "Unknown"}`
      : "Not caught";

    card.innerHTML = `
      <div class="sprite-wrapper">
        <img class="sprite" src="${spriteUrl(p)}" alt="${p.name}" loading="lazy"
             onerror="this.style.visibility='hidden'" />
      </div>

      <h3>#${id} ${p.name}</h3>
      <p class="catch-date">${caughtText}</p>
    `;

    //EDIT MODE
    card.addEventListener("click", () => {
      if (!state.editMode) return;

      p.caught = !p.caught;

      if (p.caught) {
        p.caughtDate = new Date().toISOString().split("T")[0];
      } else {
        p.caughtDate = null;
        p.shiny = false;
      }

      renderGen(pokemonList, grid);
      updateGenProgressFromList();
    });

    // RIGHT CLICK SHINY (marks caught + shiny in one go)
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      if (!state.editMode) return;

      p.shiny = !p.shiny;

      // A shiny is necessarily caught, so turning shiny on marks it caught too.
      if (p.shiny) {
        p.caught = true;
        if (!p.caughtDate) {
          p.caughtDate = new Date().toISOString().split("T")[0];
        }
      }

      renderGen(pokemonList, grid);
      updateGenProgressFromList();
    });

    grid.appendChild(card);
  });
}
