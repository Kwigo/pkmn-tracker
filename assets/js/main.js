//async loading of json data
async function loadGen1() {
  //console.log("loading gen1...");

  const res = await fetch("assets/data/gen1.json");
  //console.log("response:", res);

  const data = await res.json();
  //console.log("data:", data);

  data.pokemon.forEach(element => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <img src="assets/sprites/gen${element.gen}/${element.sprite}" />
    <h3>${element.name}</h3>
    <p>#${element.id}</p>
    `;
  document.getElementById("app").appendChild(card);
  });;
}

loadGen1();
