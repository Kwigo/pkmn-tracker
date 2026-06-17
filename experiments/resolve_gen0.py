"""
One-time helper: resolve each gen0 (variant forms) entry to its PokéAPI
pokemon id, so the tracker can build sprite URLs the same numeric way it does
for gens 1-9. Writes assets/data/gen0.json back with a "spriteId" field added.

Run from the repo root:  python experiments/resolve_gen0.py
Requires experiments/pkmn_list.json (the full PokéAPI /pokemon list).
"""
import json, re, unicodedata, urllib.request

ROOT = "."

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "pkmn-tracker-regen"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

# Authoritative name<->id data, straight from PokéAPI (one fetch each).
LIST = fetch("https://pokeapi.co/api/v2/pokemon?limit=100000")
SPECIES = fetch("https://pokeapi.co/api/v2/pokemon-species?limit=100000")

# slug -> pokemon id (covers every form)
slug_to_id = {}
for r in LIST["results"]:
    slug_to_id[r["name"]] = int(r["url"].rstrip("/").split("/")[-1])

# base dex id -> BARE species slug (from the species list, never form-suffixed)
id_to_species = {
    int(r["url"].rstrip("/").split("/")[-1]): r["name"] for r in SPECIES["results"]
}

REGION = {"alolan": "alola", "galarian": "galar", "hisuian": "hisui", "paldean": "paldea"}

def norm(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    s = s.lower().replace("'", "").replace(".", "").replace("%", "")
    s = re.sub(r"[\s/]+", "-", s.strip())
    return s

# Hand overrides for forms whose PokéAPI slug doesn't fall out of the rules,
# keyed by (base id, display name). Verified against the live PokéAPI list.
OVERRIDES = {
    (555, "Galarian Standard Mode"): "darmanitan-galar-standard",
    (774, "Meteor Form"): "minior-red-meteor",
    (774, "Core Form"): "minior-red",
    (646, "White Kyurem"): "kyurem-white",
    (646, "Black Kyurem"): "kyurem-black",
    # Forms PokéAPI files under the bare species slug (no suffix):
    (720, "Hoopa Confined"): "hoopa",
    (888, "Hero of Many Battles"): "zacian",
    (889, "Hero of Many Battles"): "zamazenta",
    (999, "Chest Form"): "gimmighoul",
    (1017, "Teal Mask"): "ogerpon",
    (1024, "Normal Form"): "terapagos",
    # Burmy has no per-cloak sprites in PokéAPI; all map to the base sprite.
    (412, "Plant Cloak"): "burmy",
    (412, "Sandy Cloak"): "burmy",
    (412, "Trash Cloak"): "burmy",
    # Tauros Paldea breeds:
    (128, "Combat Breed"): "tauros-paldea-combat-breed",
    (128, "Blaze Breed"): "tauros-paldea-blaze-breed",
    (128, "Aqua Breed"): "tauros-paldea-aqua-breed",
}

def candidates(entry):
    B, name = entry["id"], entry["name"]
    if (B, name) in OVERRIDES:
        return [OVERRIDES[(B, name)]]

    species = id_to_species.get(B)
    if not species:
        return []

    words = name.split()
    cands = []

    # Regional forms: "Alolan Raichu" -> raichu-alola
    if words[0].lower() in REGION:
        cands.append(f"{species}-{REGION[words[0].lower()]}")
        return cands

    # Rotom appliances: "Heat Rotom" -> rotom-heat
    if len(words) == 2 and words[1].lower() == "rotom":
        cands.append(f"rotom-{norm(words[0])}")
        return cands

    # Generic form descriptor: try full, then with the trailing word dropped.
    d = norm(name)
    cands.append(f"{species}-{d}")
    parts = d.split("-")
    if len(parts) > 1:
        cands.append(f"{species}-{'-'.join(parts[:-1])}")
    return cands

data = json.load(open(f"{ROOT}/assets/data/gen0.json"))
misses = []
for e in data["pokemon"]:
    resolved = None
    for c in candidates(e):
        if c in slug_to_id:
            resolved = slug_to_id[c]
            break
    if resolved:
        e["spriteId"] = resolved
    else:
        misses.append((e["id"], e["name"], candidates(e)))

print(f"resolved {len(data['pokemon']) - len(misses)} / {len(data['pokemon'])}")
if misses:
    print("\nUNRESOLVED:")
    for m in misses:
        print(f"  id={m[0]:<5} {m[1]:<28} tried={m[2]}")
else:
    json.dump(data, open(f"{ROOT}/assets/data/gen0.json", "w"), indent=2, ensure_ascii=False)
    print("\nwrote assets/data/gen0.json with spriteId added")
