async function loadGen1() {
    const res = await fetch("assets/data/gen1.json");
    const data = await res.json();
    console.log(data);
}
