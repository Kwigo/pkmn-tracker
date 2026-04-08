public class Pkmn {
    private int id;
    private String name;
    private boolean caught = false;
    private boolean shiny = false;
    private int gen;
    private String sprite;

    public Pkmn(int id, String name, int gen) {
        this.id = id;
        this.name = name;
        this.gen = gen;
        this.sprite = name
                .toLowerCase()
                .replace("♀", "f")
                .replace("♂", "m")
                .replace("'", "")
                .replace(". ", "")
                .replace(" ", "_")
                + ".png";
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public int getGen() { return gen; }
    public String getSprite() { return sprite; }
    public boolean isCaught() { return caught; }
    public boolean isShiny() { return shiny; }
}