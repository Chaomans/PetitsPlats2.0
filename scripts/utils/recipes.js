import { cleanWords, removePlurals } from "./words.js";

const path = "data/recipes.json";

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @returns {Recipe[]} All recipes from data
 */

export const getAllRecipes = async () => {
  try {
    if (sessionStorage.getItem("recipes") !== null) {
      const recipes = JSON.parse(sessionStorage.getItem("recipes"));
      wordifyRecipes(recipes);
      return recipes;
    }
    const res = await fetch(path, { method: "GET" });
    if (!res.ok) {
      throw new Error("Fetch response not OK");
    }
    const recipes = await res.json();
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
    wordifyRecipes(recipes);
    return recipes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {number} id
 * @returns {Recipe} Recipe with matching ID
 */
export const getOneRecipe = async (id) => {
  try {
    if (sessionStorage.getItem("recipes") !== null) {
      const recipes = JSON.parse(sessionStorage.getItem("recipes"));
      const recipe = recipes.filter((recipe) => recipe.id === id)[0];
      if (!recipe.hasOwnProperty("id")) {
        throw new Error(`Recipe with id ${id} does not exist`);
      }
      return recipe;
    }
    const res = await fetch(path, { method: "GET" });
    if (!res.ok) {
      throw new Error("Fetch response not OK");
    }
    const data = await res.json();
    sessionStorage.setItem("recipes", JSON.stringify(data));
    const recipe = data.filter((recipe) => recipe.id === id)[0];
    if (!recipe.hasOwnProperty("id")) {
      throw new Error(`Recipe with id ${id} does not exist`);
    }
    return recipe;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes List of recipes
 */
export const storeSearchedRecipes = (recipes) => {
  sessionStorage.setItem("searched", JSON.stringify(recipes));
  document.querySelector(".count").innerHTML = recipes.length;
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes All recipes from data
 */
const wordifyRecipes = (recipes) => {
  const words = {};
  recipes.map((recipe) => {
    wordify(words, recipe.name, "title", recipe.id);
    wordify(words, recipe.description, "description", recipe.id);
    wordify(words, recipe.ustensils.join(" "), "ustensils", recipe.id);
    wordify(words, recipe.appliance, "appliances", recipe.id);
    const allIngredients = recipe.ingredients.map(
      (ingredient) => ingredient.ingredient
    );
    wordify(words, allIngredients.join(" "), "ingredients", recipe.id);
  });
  sessionStorage.setItem("words", JSON.stringify(words));
  setAdvancedFieldsLists(recipes);
};

/**
 *
 * @param {Map<string, Map<string, number[]>>} words store
 * @param {string} str word(s) to store
 * @param {'title'|'ustensils'|'ingredients'|'description'} origin word origin
 * @param {number} id recipe id
 */
const wordify = (words, str, origin, id) => {
  const list = cleanWords(str).split(" ");
  list.map((word) => {
    if (word.length < 3) {
      return;
    }
    if (!words.hasOwnProperty(word.toLowerCase())) {
      words[word.toLowerCase()] = {
        title: [],
        ustensils: [],
        ingredients: [],
        description: [],
        appliances: [],
      };
    }
    // words[word.toLowerCase()][origin].push(id);
    words[word.toLowerCase()][origin] = Array.from(
      new Set([id, ...words[word.toLowerCase()][origin]])
    );
  });
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes All recipes from data
 */
const setAdvancedFieldsLists = (recipes) => {
  setIngredients(recipes);
  setUstensils(recipes);
  setAppliances(recipes);
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes All recipes from data
 */
const setIngredients = (recipes) => {
  sessionStorage.setItem(
    "ingredients",
    JSON.stringify(
      removePlurals([
        ...new Set(
          recipes
            .map((recipe) =>
              recipe.ingredients.map((ingredient) =>
                cleanWords(ingredient.ingredient)
              )
            )
            .flat()
        ),
      ])
    )
  );
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes All recipes from data
 */
const setUstensils = (recipes) => {
  sessionStorage.setItem(
    "ustensils",
    JSON.stringify([
      ...new Set(
        recipes
          .map((recipe) =>
            recipe.ustensils.map((ustensil) => cleanWords(ustensil))
          )
          .flat()
      ),
    ])
  );
};

/**
 * @typedef {{
 *     id: number,
 *      image: string,
 *      name : string,
 *      servings : number,
 *      ingredients: map<string, string|number>[],
 *      time: number,
 *      description: string,
 *      appliance: string,
 *      ustensils: string[]
 *  }} Recipe
 * @param {Recipe[]} recipes All recipes from data
 */
const setAppliances = (recipes) => {
  sessionStorage.setItem(
    "appliances",
    JSON.stringify([
      ...new Set(recipes.map((recipe) => cleanWords(recipe.appliance)).flat()),
    ])
  );
};
