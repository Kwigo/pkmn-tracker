function formatSpriteName(name) {
  const regions = ["alolan", "galarian", "hisuian", "paldean"];

  let parts = name.toLowerCase().split(" ");

  if (regions.includes(parts[0])) {
    const region = parts.shift();
    parts.push(region);
  }

  let formatted = parts.join("-");

  let name = formatted;
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")     // remove spaces
    .replace("♀", "-f")
    .replace("♂", "-m")
    .replace("nidoranf", "nidoran-f")
    .replace("nidoranm", "nidoran-m")
    .replace(".", "")
    .replace("unown", "unown-a")
    .replace("'", "")
    .replace(":", "-")
    .replace("deoxys", "deoxys-normal")
    .replace("burmy", "burmy-plant")
    .replace("wormadam", "wormadam-plant")
    .replace("mimejr.", "mime-jr")
    .replace("é", "e")
    .replace("furfrou", "furfrou-natural")
    .replace("zygarde", "zygarde-50")
    .replace("tapu", "tapu-");
}
