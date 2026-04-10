import { formatSpriteName } from "./utils.js";

export function renderGen(pokemonList, grid) {
  grid.innerHTML = "";

  pokemonList.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="sprite-wrapper">
        <img class="sprite" src="assets/sprites/gen${p.gen}/${formatSpriteName(p.name)}.png" />
        ${p.shiny ? `<img class="shiny-sparkle" src="assets/ui/sparkle.gif" />` : ""}
      </div>

      <h3>${p.name}</h3>
    `;

    grid.appendChild(card);
  });
}
