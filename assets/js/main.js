const gens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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

loadGen(1);
