import { formatSpriteName } from "./utils.js";

export function renderGen(pokemonList, grid) {
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
