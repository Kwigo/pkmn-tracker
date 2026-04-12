export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatSpriteName(name) {
  const regions = ["alolan", "galarian", "hisuian", "paldean"];

  let clean = removeAccents(name.toLowerCase().trim());

  let parts = clean.split(/\s+/); // handles multiple spaces
  if (parts.includes("rotom") && parts.length === 2) {
    const form = parts[0];
    return `rotom-${form}`;
  }

  // move region to the end
  if (regions.includes(parts[0])) {
    const region = parts.shift();
    parts.push(region);
  }

  let formatted = parts.join("-");

  return formatted
    .replace("♀", "-f")
    .replace("♂", "-m")
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/:/g, "")
    .replace("mr mime", "mr-mime")
    .replace("unown", "unown-a")
    .replace("mime jr", "mime-jr")
    .replace("type null", "type-null")
    .replace("jangmo o", "jangmo-o")
    .replace("hakamo o", "hakamo-o")
    .replace("kommo o", "kommo-o")
    .replace("tapu koko", "tapu-koko")
    .replace("tapu lele", "tapu-lele")
    .replace("tapu bulu", "tapu-bulu")
    .replace("tapu fini", "tapu-fini")
    .replace("nidoran female", "nidoran-f")
    .replace("nidoran male", "nidoran-m")
    .replace("farfetchd", "farfetchd")
    .replace("sirfetchd", "sirfetchd")
    .replace("deoxys", "deoxys-normal")
    .replace("burmy", "burmy-plant")
    .replace("wormadam", "wormadam-plant")
    .replace("é", "e")
    .replace("furfrou", "furfrou-natural")
    .replace("zygarde", "zygarde-50")
    .replace("basculegion", "basculegion-male")
    .replace("enamorus", "enamorus-incarnate");
}