// Twitch overlay. Reads the tracker's live stats from localStorage and
// updates instantly when the tracker (in the same browser) writes them via
// the `storage` event. Falls back to reading the JSON files directly if the
// tracker hasn't been opened yet this session.

const KEY = "pkmn-tracker-stats";
const gens = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function render(stats, animate = true) {
  setValue("caught", stats.caught, animate);
  setValue("shiny", stats.shiny, animate);

  document.getElementById("total").textContent = stats.total;
  document.getElementById("percent").textContent = stats.percent + "%";

  // Blue fill = caught %, gold fill = shiny % (drawn on top, from the left).
  const shinyPercent = stats.total === 0 ? 0 : (stats.shiny / stats.total) * 100;
  document.getElementById("bar-fill").style.width = stats.percent + "%";
  document.getElementById("shiny-fill").style.width = shinyPercent + "%";
}

function setValue(id, newValue, animate) {
  const el = document.getElementById(id);

  if (!animate) {
    el.textContent = newValue;
    return;
  }

  const oldValue = parseInt(el.textContent) || 0;
  const duration = 300;
  const start = performance.now();

  function step(time) {
    const progress = Math.min((time - start) / duration, 1);
    el.textContent = Math.floor(oldValue + (newValue - oldValue) * progress);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Fallback: compute totals straight from the JSON files (committed state).
async function computeFromJson() {
  let total = 0, caught = 0, shiny = 0;

  for (const gen of gens) {
    try {
      const res = await fetch(`assets/data/gen${gen}.json`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.pokemon;
      if (!Array.isArray(list)) continue;

      total += list.length;
      caught += list.filter(p => p.caught).length;
      shiny += list.filter(p => p.shiny).length;
    } catch (err) {
      console.warn(`Failed to load gen ${gen}`, err);
    }
  }

  const percent = total === 0 ? 0 : Math.round((caught / total) * 100);
  return { total, caught, shiny, percent };
}

async function init() {
  const cached = localStorage.getItem(KEY);

  if (cached) {
    render(JSON.parse(cached), false);
  } else {
    render(await computeFromJson(), false);
  }
}

// Live updates: fires whenever the tracker writes new stats from another
// tab/window in the same browser.
window.addEventListener("storage", (e) => {
  if (e.key === KEY && e.newValue) {
    render(JSON.parse(e.newValue), true);
  }
});

init();
