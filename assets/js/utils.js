export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatSpriteName(name) {
  const regions = ["alolan", "galarian", "hisuian", "paldean"];

  let clean = removeAccents(name.toLowerCase());
  let parts = clean.split(" ");

  if (regions.includes(parts[0])) {
    const region = parts.shift();
    parts.push(region);
  }

  return parts.join("-")
    .toLowerCase()
    .replace("♀", "-f")
    .replace("♂", "-m")
    .replace(/\./g, "")
    .replace("unown", "unown-a")
    .replace("'", "")
    .replace(":", "")
    .replace("deoxys", "deoxys-normal")
    .replace("burmy", "burmy-plant")
    .replace("wormadam", "wormadam-plant")
    .replace("é", "e")
    .replace("furfrou", "furfrou-natural")
    .replace("zygarde", "zygarde-50")
}
