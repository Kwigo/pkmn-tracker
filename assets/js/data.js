import { state } from "./state.js";
import { createGenSection } from "./ui.js";

export const gens = [1,2,3,4,5,6,7,8,9,0];

export async function loadAllGens() {
  for (const gen of gens) {
    const res = await fetch(`assets/data/gen${gen}.json`);
    const data = await res.json();

    state.data[gen] = data;

    createGenSection(gen, data);
  }
}
