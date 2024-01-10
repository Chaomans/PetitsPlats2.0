import { cardTemplate } from "./templates/card.js";
import { getAllRecipes } from "./utils/recipes.js";

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
 * @param {Recipe[]} recipes
 */
const displayRecipes = (recipes) => {
  const cards = document.querySelector(".cards");
  const start = +document.querySelector(".more").getAttribute("data-start");
  const limit = +document.querySelector(".more").getAttribute("data-limit");
  recipes.slice(start, limit).map((recipe) => {
    const card = cardTemplate(recipe);
    cards.appendChild(card);
  });
};

const init = async () => {
  const recipes = await getAllRecipes();
  displayRecipes(recipes);

  const btnDisplayMore = document.querySelector(".more");
  btnDisplayMore.addEventListener("click", () => {
    const limit = +document.querySelector(".more").getAttribute("data-limit");
    btnDisplayMore.setAttribute("data-start", `${limit}`);
    btnDisplayMore.setAttribute("data-limit", `${limit + 10}`);
    displayRecipes(recipes);
  });
};

init();
