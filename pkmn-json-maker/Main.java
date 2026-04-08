import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static java.lang.System.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner s = new Scanner(System.in);

        out.println("Enter source folder:");
        String inputFolder = s.nextLine();

        out.println("Enter gen (use 0 for the variants):");
        int gen = Integer.parseInt(s.nextLine());

        out.println("Enter input filename:");
        File input = new File(inputFolder + "\\" + s.nextLine());

        // Output folder
        String outputFolder = inputFolder + "\\out\\";
        Path outPath = Path.of(outputFolder);
        if (!Files.exists(outPath)) {
            Files.createDirectory(outPath);
        }

        List<Pkmn> pokemonList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(input))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                String[] parts = line.split(",");
                int id = Integer.parseInt(parts[0].trim());
                if (gen == 0) {
                    // Using Variants
                    String variantName = parts[2].trim();
                    pokemonList.add(new Pkmn(
                            id,
                            variantName, // full name like "Alolan Rattata"
                            gen
                    ));
                } else {
                    // Using normal pokedex
                    String name = parts[1].trim();
                    pokemonList.add(new Pkmn(
                            id,
                            name,
                            gen
                    ));
                }
            }
        }

        // Write JSON
        try (BufferedWriter writer = new BufferedWriter(
                new FileWriter(outputFolder + "gen" + gen + ".json"))) {

            writer.write("[\n");

            for (int i = 0; i < pokemonList.size(); i++) {
                Pkmn p = pokemonList.get(i);
                writer.write("  {\n");
                writer.write("    \"ID\": " + p.getId() + ",\n");
                writer.write("    \"Name\": \"" + p.getName() + "\",\n");
                writer.write("    \"Caught\": false,\n");
                writer.write("    \"Shiny\": false,\n");
                writer.write("    \"Gen\": " + p.getGen() + ",\n");
                writer.write("    \"Sprite\": \"" + p.getSprite() + "\"\n");
                writer.write("  }");

                if (i < pokemonList.size() - 1) {
                    writer.write(",");
                }
                writer.write("\n");
            }
            writer.write("]");
        }
        out.println("JSON generated successfully!");
    }
}
