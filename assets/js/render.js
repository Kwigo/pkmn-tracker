import { formatSpriteName } from "./utils.js";
import { state } from "./state.js";



export function renderGen(pokemonList, grid) {
  if (!Array.isArray(pokemonList)) {
    console.error("Invalid pokemonList:", pokemonList);
    return;
  }
  
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

    // CLICK LOGIC (EDIT MODE)
    card.addEventListener("click", () => {
      if (!state.editMode) return;

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

    // RIGHT CLICK SHINY
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      if (!state.editMode) return;
      if (!p.caught) return;

      p.shiny = !p.shiny;

      renderGen(pokemonList, grid);
      updateGenProgressFromList();
    });

    grid.appendChild(card);
  });
}

/*export function renderGen(pokemonList, grid) {
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

    grid.appendChild(card);
  });
}
*/