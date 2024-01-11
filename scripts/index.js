import { cardTemplate } from "./templates/card.js";
import { getAllRecipes, storeSearchedRecipes } from "./utils/recipes.js";
import { search } from "./search.js";

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
const displayRecipes = (recipes, refresh = false) => {
  const cards = document.querySelector(".cards");
  const start = +document.querySelector(".more").getAttribute("data-start");
  const limit = +document.querySelector(".more").getAttribute("data-limit");
  if (refresh) {
    cards.innerHTML = "";
  }
  recipes.slice(start, limit).map((recipe) => {
    const card = cardTemplate(recipe);
    cards.appendChild(card);
  });
};

const init = async () => {
  const recipes = await getAllRecipes();
  displayRecipes(recipes);
  storeSearchedRecipes(recipes);

  const btnDisplayMore = document.querySelector(".more");
  btnDisplayMore.addEventListener("click", () => {
    const limit = +document.querySelector(".more").getAttribute("data-limit");
    btnDisplayMore.setAttribute("data-start", `${limit}`);
    btnDisplayMore.setAttribute("data-limit", `${limit + 10}`);
    displayRecipes(JSON.parse(localStorage.getItem("searched")));
  });

  const searchBarInput = document.querySelector(".searchbar-input");
  searchBarInput.addEventListener("change", () => {
    if (searchBarInput.value.length > 2) {
      const recipesIDs = search(searchBarInput.value.toLowerCase());
      const searched = JSON.parse(localStorage.getItem("searched"));
      const recipes = searched.filter((recipe) =>
        recipesIDs.includes(recipe.id)
      );
      storeSearchedRecipes(recipes);
      displayRecipes(recipes, true);
    } else {
      const recipes = JSON.parse(localStorage.getItem("recipes"));
      storeSearchedRecipes(recipes);
      displayRecipes(recipes, true);
    }
  });
};

init();
