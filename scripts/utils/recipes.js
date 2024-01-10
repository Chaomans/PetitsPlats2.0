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
    if (localStorage.getItem("recipes") !== null) {
      return JSON.parse(localStorage.getItem("recipes"));
    }
    const res = await fetch(path, { method: "GET" });
    if (!res.ok) {
      throw new Error("Fetch response not OK");
    }
    const data = await res.json();
    localStorage.setItem("recipes", JSON.stringify(data));
    return data;
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
    if (localStorage.getItem("recipes") !== null) {
      const recipes = JSON.parse(localStorage.getItem("recipes"));
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
    localStorage.setItem("recipes", JSON.stringify(data));
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
