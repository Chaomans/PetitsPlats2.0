import { cardTemplate } from "./templates/card.js";
import { getAllRecipes, storeSearchedRecipes } from "./utils/recipes.js";
import { searchOnTags } from "./search.js";
import { tagTemplate, resetTags } from "./templates/tag.js";
import { filterTemplate } from "./templates/filter.js";
import { timeouts } from "./utils/timeout.js";
import { updateItemsWithTags } from "./utils/items.js";
import { removePlurals } from "./utils/words.js";

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

/**
 *
 * @param {HTMLDivElement} filter Filter Template
 * @param {string} category Search category
 */
const addEvents = (filter, category) => {
  const head = filter.querySelector(".head");
  head.addEventListener("click", () => {
    filter.classList.toggle("expand");
    filter.querySelector(".filter-body").classList.toggle("hidden");
  });

  const form = filter.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  form.querySelector("input").addEventListener("keyup", (e) => {
    clearTimeout(timeouts[category]);
    timeouts[category] = setTimeout(() => {
      const items = filter.querySelectorAll(".item");
      if (e.target.value.length < 3) {
        items.forEach((item) => item.classList.remove("hidden"));
        return;
      }
      items.forEach((item) => {
        item.innerHTML.includes(e.target.value)
          ? item.classList.remove("hidden")
          : item.classList.add("hidden");
      });
    }, 300);
  });

  form.querySelector("input").addEventListener("keydown", (e) => {
    clearTimeout(timeouts[category]);
  });

  const items = filter.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      addTagFromFilter(item.innerHTML, category);
      filter.classList.toggle("expand");
      filter.querySelector(".filter-body").classList.toggle("hidden");
      form.querySelector("input").value = "";
    });
  });
};

/**
 *
 * @param {HTMLDivElement} tag TagTemplate
 * @returns {boolean}
 */
const canAddtag = (tag) => {
  if (sessionStorage.getItem("tags") == null) return true;
  const tags = JSON.parse(sessionStorage.getItem("tags"));
  const tagname = tag.querySelector("p").innerHTML;
  const tagnames = tags.map((_tag) => _tag[0]);
  if (
    tagnames.includes(tagname) ||
    removePlurals([tagname, ...tagnames]).length === tagnames.length
  ) {
    return false;
  }
  return true;
};

/**
 *
 * @param {string} selected selected item
 * @param {string} category Search category
 */
const addTagFromFilter = (selected, category) => {
  if (selected.length < 3) {
    return;
  }
  const tag = tagTemplate(selected, category);
  if (canAddtag(tag)) {
    addTag(tag);
    const tags = JSON.parse(sessionStorage.getItem("tags"));
    const recipesIDs = searchOnTags([
      [selected.toLowerCase(), category],
      ...tags,
    ]);
    const searched = JSON.parse(sessionStorage.getItem("searched"));
    const recipes = searched.filter((recipe) => recipesIDs.includes(recipe.id));
    storeSearchedRecipes(recipes);
    updateItemsWithTags();
    displayRecipes(recipes, true);
  }
};

/**
 *
 * @param {HTMLDivElement} tag Tag Template
 */
export const addTag = (tag) => {
  const tagname = tag.querySelector("p").innerHTML;
  const category = tag.getAttribute("data-category");
  if (!sessionStorage.getItem("tags")) {
    sessionStorage.setItem("tags", JSON.stringify([[tagname, category]]));
    displayTag(tag);
    return;
  }
  const tags = JSON.parse(sessionStorage.getItem("tags"));
  const tagnames = tags.map((_tag) => _tag[0]);
  if (
    tagnames.includes(tagname) ||
    removePlurals([tagname, ...tagnames]).length === tagnames.length
  ) {
    return;
  }
  tags.push([tagname, category]);
  sessionStorage.setItem("tags", JSON.stringify(tags));
  displayTag(tag);
};

const displayTag = (tag) => {
  const tags = document.querySelector(".tags");
  tags.appendChild(tag);
};

/**
 *
 * @param {string} tagname Tag name
 */
export const removeTag = (tagname) => {
  if (!sessionStorage.getItem("tags")) {
    return;
  }
  const tags = JSON.parse(sessionStorage.getItem("tags")).filter(
    (tag) => tag[0] !== tagname
  );
  sessionStorage.setItem("tags", JSON.stringify(tags));
  if (!tags.length) {
    const recipes = JSON.parse(sessionStorage.getItem("recipes"));
    storeSearchedRecipes(recipes);
    updateItemsWithTags();
    displayRecipes(recipes, true);
    return;
  }
  const recipesIDs = searchOnTags(tags);
  const searched = JSON.parse(sessionStorage.getItem("recipes"));
  const recipes = searched.filter((recipe) => recipesIDs.includes(recipe.id));
  storeSearchedRecipes(recipes);
  updateItemsWithTags();
  displayRecipes(recipes, true);
};

const init = async () => {
  resetTags();
  const recipes = await getAllRecipes();
  displayRecipes(recipes);
  storeSearchedRecipes(recipes);

  const filters = document.querySelector(".search_filters");
  const filterIngredients = filterTemplate("Ingrédients", "ingredients");
  addEvents(filterIngredients, "ingredients");
  filters.appendChild(filterIngredients);
  const filterAppliances = filterTemplate("Appareils", "appliances");
  addEvents(filterAppliances, "appliances");
  filters.appendChild(filterAppliances);
  const filterUstensils = filterTemplate("Ustensils", "ustensils");
  addEvents(filterUstensils, "ustensils");
  filters.appendChild(filterUstensils);

  const btnDisplayMore = document.querySelector(".more");
  btnDisplayMore.addEventListener("click", () => {
    const limit = +document.querySelector(".more").getAttribute("data-limit");
    btnDisplayMore.setAttribute("data-start", `${limit}`);
    btnDisplayMore.setAttribute("data-limit", `${limit + 10}`);
    displayRecipes(JSON.parse(sessionStorage.getItem("searched")));
  });

  const searchBarInput = document.querySelector(".searchbar-input");
  searchBarInput.addEventListener("keyup", () => {
    clearTimeout(timeouts.searchbar);
    timeouts.searchbar = setTimeout(() => {
      const tags = JSON.parse(sessionStorage.getItem("tags")) ?? [];
      if (searchBarInput.value.length < 3 && !tags.length) {
        displayRecipes(recipes, true);
        storeSearchedRecipes(recipes);
        return;
      }
      const tagnames = tags.map((tag) => tag[0]);
      if (
        removePlurals([searchBarInput.value, ...tagnames]).length ===
        tagnames.length
      )
        return;
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
    clearTimeout(timeouts.searchbar)
  );

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchBarInput.value.length < 3) {
      return;
    }
    const tag = tagTemplate(searchBarInput.value, "all");
    if (canAddtag(tag)) {
      addTag(tag);
      const tags = JSON.parse(sessionStorage.getItem("tags"));
      const recipesIDs = searchOnTags([
        [searchBarInput.value.toLowerCase(), "all"],
        ...tags,
      ]);
      const searched = JSON.parse(sessionStorage.getItem("searched"));
      const recipes = searched.filter((recipe) =>
        recipesIDs.includes(recipe.id)
      );
      storeSearchedRecipes(recipes);
      updateItemsWithTags();
      displayRecipes(recipes, true);
    }
    searchBarInput.value = "";
  });
};

init();
