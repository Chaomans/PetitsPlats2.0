import { addTag, tagTemplate } from "./tag.js";
import { searchOnTags } from "../search.js";
import { storeSearchedRecipes } from "../utils/recipes.js";
import { displayRecipes } from "../index.js";
/**
 *
 * @param {string} name Title of the filter
 * @param {string} category Search category
 * @returns {HTMLDivElement} Advanced search field Template
 */
export const filterTemplate = (name, category) => {
  const filter = document.createElement("div");
  filter.classList.add("filter", "rounded-4");

  const head = document.createElement("div");
  head.classList.add("head");
  const title = document.createElement("p");
  title.classList.add("title");
  title.innerHTML = name;
  const arrow = document.createElement("div");
  arrow.classList.add("arrow");
  head.appendChild(title);
  head.appendChild(arrow);

  const body = document.createElement("div");
  body.classList.add("filter-body", "hidden");

  const form = document.createElement("form");
  const filterInput = document.createElement("input");
  filterInput.setAttribute("type", "text");
  const btn = document.createElement("button");
  form.appendChild(filterInput);
  form.appendChild(btn);
  body.appendChild(form);

  const list = document.createElement("div");
  list.classList.add("filter-list");
  const items = JSON.parse(sessionStorage.getItem(category)).sort();
  items.map((item) => {
    const p = document.createElement("p");
    p.classList.add("item");
    p.innerHTML = item;
    list.appendChild(p);
  });

  body.appendChild(list);

  filter.appendChild(head);
  filter.appendChild(body);

  addEvents(filter, category);

  return filter;
};

/**
 *
 * @param {HTMLDivElement} filter Filter Template
 * @param {string} category Search category
 */
const addEvents = (filter, category) => {
  filter.querySelector(".head").addEventListener("click", () => {
    filter.classList.toggle("expand");
    filter.querySelector(".filter-body").classList.toggle("hidden");
  });

  const form = filter.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector("input");
    addTagFromFilter(selected.value, category);
    selected.value = "";
  });

  let timeout;
  form.querySelector("input").addEventListener("keyup", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const items = filter.querySelectorAll(".item");
      console.log("stop writing");
      if (e.target.value.length < 3) {
        items.forEach((item) => item.classList.remove("hidden"));
      }
      items.forEach((item) => {
        if (!item.innerHTML.includes(e.target.value)) {
          item.classList.toggle("hidden");
        }
      });
    }, 300);
  });

  form.querySelector("input").addEventListener("keydown", (e) => {
    clearTimeout(timeout);
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
 * @param {string} selected selected item
 * @param {string} category Search category
 */
const addTagFromFilter = (selected, category) => {
  if (selected.length < 3) {
    return;
  }
  const tag = tagTemplate(selected, category);
  addTag(tag);
  const tags = JSON.parse(sessionStorage.getItem("tags"));
  const recipesIDs = searchOnTags([
    [selected.toLowerCase(), category],
    ...tags,
  ]);
  const searched = JSON.parse(sessionStorage.getItem("searched"));
  const recipes = searched.filter((recipe) => recipesIDs.includes(recipe.id));
  storeSearchedRecipes(recipes);
  displayRecipes(recipes, true);
};
