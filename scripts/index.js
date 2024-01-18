import { cardTemplate } from "./templates/card.js";
import { getAllRecipes, storeSearchedRecipes } from "./utils/recipes.js";
import { searchOnTags } from "./search.js";
import { tagTemplate, addTag, resetTags } from "./templates/tag.js";
import { filterTemplate } from "./templates/filter.js";
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
export const displayRecipes = (recipes, refresh = false) => {
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
  document.querySelector(".count").innerHTML = recipes.length;
  const btnDisplayMore = document.querySelector(".more");
  if (recipes.length <= 10 || limit >= recipes.length) {
    btnDisplayMore.classList.add("hidden");
  } else {
    btnDisplayMore.classList.remove("hidden");
  }
};

const init = async () => {
  resetTags();
  const recipes = await getAllRecipes();
  displayRecipes(recipes);
  storeSearchedRecipes(recipes);

  const filters = document.querySelector(".search_filters");
  filters.appendChild(filterTemplate("Ingrédients", "ingredients"));
  filters.appendChild(filterTemplate("Appareils", "appliances"));
  filters.appendChild(filterTemplate("Ustensils", "ustensils"));

  const btnDisplayMore = document.querySelector(".more");
  btnDisplayMore.addEventListener("click", () => {
    const limit = +document.querySelector(".more").getAttribute("data-limit");
    btnDisplayMore.setAttribute("data-start", `${limit}`);
    btnDisplayMore.setAttribute("data-limit", `${limit + 10}`);
    displayRecipes(JSON.parse(sessionStorage.getItem("searched")));
  });

  let stopWritingTimeout;
  const searchBarInput = document.querySelector(".searchbar-input");
  searchBarInput.addEventListener("keyup", () => {
    clearTimeout(stopWritingTimeout);
    stopWritingTimeout = setTimeout(() => {
      const tags = JSON.parse(sessionStorage.getItem("tags")) ?? [];
      if (searchBarInput.value.length < 3 && !tags.length) {
        displayRecipes(recipes, true);
        storeSearchedRecipes(recipes);
        return;
      }
      const recipesIDs =
        searchBarInput.value.length < 3
          ? searchOnTags(tags)
          : searchOnTags([
              [searchBarInput.value.toLowerCase(), "all"],
              ...tags,
            ]);
      const searched = JSON.parse(sessionStorage.getItem("searched"));
      const _recipes = searched.filter((recipe) =>
        recipesIDs.includes(recipe.id)
      );
      displayRecipes(_recipes, true);
    }, 300);
  });

  searchBarInput.addEventListener("keydown", () =>
    clearTimeout(stopWritingTimeout)
  );

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchBarInput.value.length < 3) {
      return;
    }
    const tag = tagTemplate(searchBarInput.value, "all");
    addTag(tag);
    const tags = JSON.parse(sessionStorage.getItem("tags"));
    const recipesIDs = searchOnTags([
      [searchBarInput.value.toLowerCase(), "all"],
      ...tags,
    ]);
    const searched = JSON.parse(sessionStorage.getItem("searched"));
    const recipes = searched.filter((recipe) => recipesIDs.includes(recipe.id));
    storeSearchedRecipes(recipes);
    displayRecipes(recipes, true);
    searchBarInput.value = "";
  });
};

init();
