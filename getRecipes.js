const fs = require("fs");
const axios = require("axios");

const url =
  "https://eu-west-2.aws.data.mongodb-api.com/app/data-ogohe/endpoint/data/v1/action/find";
const apiKey =
  "CUCNNj4LNpMqDuzG82OEghreAMJJzNJlRtMaxnUVOexKRP0lKO5VagP7KTOeQHP9";

async function getAllRecipes() {
  try {
    const response = await axios.post(
      url,
      {
        collection: "recipes",
        database: "main",
        dataSource: "EatCookJoy",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key": apiKey,
        },
      }
    );

    return response.data.documents;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

async function saveRecipesToFile() {
  const recipes = await getAllRecipes();

  if (recipes.length > 0) {
    fs.writeFile("recipes.json", JSON.stringify(recipes, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(
          `Successfully saved ${recipes.length} recipes to recipes.json`
        );
      }
    });
  } else {
    console.log("No recipes found or error occurred.");
  }
}

saveRecipesToFile();
