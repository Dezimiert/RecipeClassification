const fs = require("fs").promises;
const chalk = require("chalk");
const path = require("path");

const INPUT_FILE = "recipes.json";
const OUTPUT_FILE = "good_recipes.json";

// Function to safely read JSON file
async function safeReadJSON(filename) {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        chalk.yellow(`File ${filename} not found. Creating a new file.`)
      );
      return [];
    }
    console.error(chalk.red(`Error reading ${filename}:`, error.message));
    process.exit(1);
  }
}

// Function to safely write to JSON file
async function safeWriteJSON(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(chalk.red(`Error writing to ${filename}:`, error.message));
    process.exit(1);
  }
}

// Function to ensure output file exists
async function ensureOutputFileExists() {
  try {
    await fs.access(OUTPUT_FILE);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        chalk.yellow(`${OUTPUT_FILE} not found. Creating a new file.`)
      );
      await safeWriteJSON(OUTPUT_FILE, []);
    } else {
      console.error(
        chalk.red(`Error accessing ${OUTPUT_FILE}:`, error.message)
      );
      process.exit(1);
    }
  }
}

// Function to display recipe fields in a visually appealing way
function displayRecipe(recipe) {
  console.log("\n" + chalk.bgCyan.black(" Recipe Details ") + "\n");

  console.log(chalk.yellow("Recipe Info:"));
  console.log(chalk.cyan("Name: ") + (recipe.recipe_name || "N/A"));
  console.log(chalk.cyan("Category: ") + (recipe.recipe_category || "N/A"));
  console.log(chalk.cyan("Cuisine: ") + (recipe.cuisines?.join(", ") || "N/A"));
  console.log(
    chalk.cyan("Dietary Preference: ") +
      (recipe.dietary_preference?.join(", ") || "N/A")
  );
  console.log(
    chalk.cyan("Allergens: ") + (recipe.allergens?.join(", ") || "N/A")
  );

  console.log("\n" + chalk.yellow("AI added Tags:"));
  console.log(
    chalk.cyan("Nutrition: ") + (recipe.nutrition?.join(", ") || "N/A")
  );
  console.log(chalk.cyan("Proteins: ") + (recipe.proteins || "N/A") + "g");
  console.log(
    chalk.cyan("Spice Level: ") + (recipe.spice_level?.join(", ") || "N/A")
  );
  console.log(
    chalk.cyan("Flavours: ") + (recipe.flavours?.join(", ") || "N/A")
  );
  console.log(chalk.cyan("Budget: ") + (recipe.budget || "N/A"));
  console.log(
    chalk.cyan("Suitable for: ") + (recipe.time_of_the_day?.join(", ") || "N/A")
  );
  console.log(
    chalk.cyan("Dish Type: ") + (recipe.dish_type?.join(", ") || "N/A")
  );
  console.log(
    chalk.cyan("Main Ingredients: ") +
      (recipe.main_ingredients?.join(", ") || "N/A")
  );
  console.log(
    chalk.cyan("Prep Time: ") + (recipe.preptime || "N/A") + " minutes"
  );
  console.log(
    chalk.cyan("Cooking Time: ") + (recipe.cooking_time || "N/A") + " minutes"
  );
  console.log(
    chalk.cyan("Prep Method: ") + (recipe.prep_method?.join(", ") || "N/A")
  );
}

// Function to get user input
function getUserInput() {
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

// Main function to process recipes
async function processRecipes() {
  let recipes;
  let goodRecipes;

  try {
    await ensureOutputFileExists();
    recipes = await safeReadJSON(INPUT_FILE);
    goodRecipes = await safeReadJSON(OUTPUT_FILE);
  } catch (error) {
    console.error(chalk.red("Error initializing:", error.message));
    process.exit(1);
  }

  for (let recipe of recipes) {
    displayRecipe(recipe);
    console.log(
      "\n" + chalk.bgYellow.black(" Enter + to add this recipe, or - to skip: ")
    );

    const input = await getUserInput();

    if (input === "+") {
      goodRecipes.push(recipe);
      console.log(chalk.green("Recipe added to good recipes."));
      await safeWriteJSON(OUTPUT_FILE, goodRecipes);
    } else if (input === "-") {
      console.log(chalk.red("Recipe skipped."));
    } else {
      console.log(chalk.red("Invalid input. Recipe skipped."));
    }
  }

  console.log(
    chalk.green(
      `\nProcess complete. ${goodRecipes.length} recipes saved to ${OUTPUT_FILE}`
    )
  );
  process.exit(0);
}

// Start the process
processRecipes().catch((error) => {
  console.error(chalk.red("Unhandled error:", error.message));
  process.exit(1);
});
