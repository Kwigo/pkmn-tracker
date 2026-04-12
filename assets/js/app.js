import { loadAllGens } from "./data.js";
import { state } from "./state.js";
import { gens } from "./data.js";
import { createGenSection } from "./ui.js";
import { renderGen } from "./render.js";

loadAllGens();
createGenSection(gens, state.data);

