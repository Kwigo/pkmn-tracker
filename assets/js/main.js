console.log("MAIN JS IS LOADING");
async function loadGen1() {
  console.log("loading gen1...");

  const res = await fetch("assets/data/gen1.json");
  console.log("response:", res);

  const data = await res.json();
  console.log("data:", data);
}

loadGen1();
