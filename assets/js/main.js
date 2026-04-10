//async loading of json data
async function loadGen1() {
  //console.log("loading gen1...");

  const res = await fetch("assets/data/gen1.json");
  //console.log("response:", res);

  const data = await res.json();
  //console.log("data:", data);

  const bulbasaur = data.pokemon[0];
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
  <h3>${bulbasaur.name}</h3>
  <p>#${bulbasaur.id}</p>
  `;
document.getElementById("app").appendChild(card);
}

loadGen1();
