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

        out.println("Enter gen:");
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
                    // 🔥 VARIANT MODE
                    String variantName = parts[2].trim();

                    pokemonList.add(new Pkmn(
                            id,
                            variantName, // full name like "Alolan Rattata"
                            gen
                    ));

                } else {
                    // ✅ NORMAL MODE
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

        out.println("✅ JSON generated successfully!");
    }
}

/*import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

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

        out.println("Enter gen:");
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
                    // VARIANT / FORM MODE
                    String variantName = parts[2].trim();
                    pokemonList.add(new Pkmn(id, variantName, 0));
                } else {
                    // NORMAL POKEMON
                    String name = parts[1].trim();
                    pokemonList.add(new Pkmn(id, name, gen));
                }
            }
        }

        // Use GSON to write JSON nicely
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        try (Writer writer = new FileWriter(outputFolder + "gen" + gen + ".json")) {
            gson.toJson(pokemonList, writer);
        }

        out.println("✅ JSON generated successfully with GSON!");
    }
}*/

/*import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

import static java.lang.System.*;


public class Main {
    public static void main(String[] args) throws IOException {
        //choose input file
        String inputFolder;
        File input;
        String outputFolder;
        int gen;
        String nLine = "\r\n";
        String tab = "\t";
        String c = "\", ";
        String nl = "\"},"+ nLine + tab;
        String begin = "[" + nLine + tab;
        String end = "]";

        String jID = "{\"ID\":";
        String jName = ", \"Name\":\"";
        String jCaught = "\", \"Caught\":false, \"Shiny\":false, ";
        String jGen = "\"Gen\":";
        String jSprite =", \"Sprite\":\"";

        out.println("Enter source Folder:");
        Scanner s = new Scanner(System.in);
        inputFolder = s.nextLine();
        outputFolder = inputFolder + "\\out";
        Path outPath = Path.of(outputFolder);
        if (!Files.exists(outPath)) {
            Files.createDirectory(outPath);
        }

        out.println("Enter gen (0 for variants/other forms):");
        gen = Integer.parseInt(s.nextLine());
        out.println("Enter Input Filename:");
        input = new File(inputFolder + "\\" + s.nextLine());

        FileWriter writer = new FileWriter(outputFolder + "gen" + gen + ".json", true);
        writer.write(begin);

        //read input
        try (BufferedReader br = new BufferedReader(new FileReader(input))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                int id = Integer.parseInt(parts[0].trim());
                String name = parts[1].trim();
                Pkmn entry = new Pkmn(id, name, gen);
                writer.write(jID + entry.getId() + jName + entry.getName() + jCaught + jGen + entry.getGen() + jSprite + entry.getSprite() + nl);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        writer.write(end);
        writer.close();

        //format output





        //save output file


    }
}*/
