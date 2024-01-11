import { cardTemplate } from "./templates/card.js";
import { getAllRecipes, storeSearchedRecipes } from "./utils/recipes.js";
import { search } from "./search.js";
import { tagTemplate, addTag, resetTags } from "./templates/tag.js";

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
  const btn = document.querySelector(".more");
  if (refresh) {
    cards.innerHTML = "";
    btn.setAttribute("data-start", 0);
    btn.setAttribute("data-limit", 10);
  }
  const start = btn.getAttribute("data-start");
  const limit = btn.getAttribute("data-limit");
  recipes.slice(start, limit).map((recipe) => {
    const card = cardTemplate(recipe);
    cards.appendChild(card);
  });
};

const init = async () => {
  resetTags();
  const recipes = await getAllRecipes();
  displayRecipes(recipes);
  storeSearchedRecipes(recipes);

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

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
      // const searched = JSON.parse(localStorage.getItem("searched"));
      const searched = JSON.parse(localStorage.getItem("recipes"));
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
    const tag = tagTemplate(searchBarInput.value);
    addTag(tag);
    searchBarInput.value = "";
  });
};

init();
