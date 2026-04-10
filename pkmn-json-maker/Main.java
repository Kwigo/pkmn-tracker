import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.*;

import static java.lang.System.*;

public class Main {
    public static void main(String[] args) throws IOException {

        Scanner s = new Scanner(System.in);

        out.println("Enter source folder:");
        String inputFolder = s.nextLine();

        out.println("Enter gen (0 for variants/forms):");
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
                    String variantName = parts[2].trim();
                    pokemonList.add(new Pkmn(
                            id,
                            variantName,
                            gen
                    ));
                } else {
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

            String today = LocalDate.now().toString();

            // JSON start + Metadata
            writer.write("{\n");
            writer.write("  \"version\": 1,\n");
            writer.write("  \"lastModified\": \"" + today + "\",\n");
            writer.write("  \"stats\": {\n");
            writer.write("    \"total\": " + pokemonList.size() + ",\n");
            writer.write("    \"caught\": 0,\n");
            writer.write("    \"shiny\": 0\n");
            writer.write("  },\n");

            // Write out Pokemon
            writer.write("  \"pokemon\": [\n");

            for (int i = 0; i < pokemonList.size(); i++) {
                Pkmn p = pokemonList.get(i);

                writer.write("    {\n");
                writer.write("      \"id\": " + p.getId() + ",\n");
                writer.write("      \"name\": \"" + p.getName() + "\",\n");
                writer.write("      \"gen\": " + p.getGen() + ",\n");
                writer.write("      \"caught\": false,\n");
                writer.write("      \"shiny\": false,\n");
                writer.write("      \"caughtDate\": null,\n");
                writer.write("      \"caughtMethod\": null,\n");
                writer.write("      \"sprite\": \"" + p.getSprite() + "\",\n");
                writer.write("      \"tcg\": {\n");
                writer.write("        \"hasCard\": false,\n");
                writer.write("        \"hasFullArt\": false\n");
                writer.write("      }\n");
                writer.write("    }");

                if (i < pokemonList.size() - 1) {
                    writer.write(",");
                }
                writer.write("\n");
            }
            writer.write("  ]\n");
            writer.write("}\n");
        }
        out.println("JSON generated successfully!");
    }
}
