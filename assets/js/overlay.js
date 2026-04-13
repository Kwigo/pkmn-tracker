const gens = [1,2,3,4,5,6,7,8,9,0];

async function loadStats() {
  let total = 0;
  let caught = 0;
  let shiny = 0;

  for (const gen of gens) {
    try {
      const res = await fetch(`assets/data/gen${gen}.json`);
      const data = await res.json();

      // handle both formats (safety)
      const list = Array.isArray(data) ? data : data.pokemon;

      if (!Array.isArray(list)) continue;

      total += list.length;
      caught += list.filter(p => p.caught).length;
      shiny += list.filter(p => p.shiny).length;

    } catch (err) {
      console.warn(`Failed to load gen ${gen}`, err);
    }
  }

  const percent = total === 0
    ? 0
    : Math.round((caught / total) * 100);

  updateUI({ total, caught, shiny, percent });
}

function updateUI(stats) {
  animateValue("caught", stats.caught);
  document.getElementById("shiny").textContent = stats.shiny;
  document.getElementById("percent").textContent = stats.percent + "%";
}

function animateValue(id, newValue) {
  const el = document.getElementById(id);
  const oldValue = parseInt(el.textContent) || 0;

  const duration = 300;
  const start = performance.now();

  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const value = Math.floor(oldValue + (newValue - oldValue) * progress);

    el.textContent = value;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// initial load
loadStats();

// auto refresh every 5 seconds
setInterval(loadStats, 5000);