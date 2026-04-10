import { state } from "./state.js";
import { renderGen } from "./render.js";

export function attachCardEvents(card, p, pokemonList, grid) {
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
  });

  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if (!state.editMode || !p.caught) return;

    p.shiny = !p.shiny;

    renderGen(pokemonList, grid);
  });
}
