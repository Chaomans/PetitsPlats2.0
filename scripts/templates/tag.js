import { searchOnTags } from "../search.js";
import { storeSearchedRecipes } from "../utils/recipes.js";
import { displayRecipes } from "../index.js";

/**
 *
 * @param {string} tagname Name of the tag
 * @returns {HTMLDivElement} Tag Template Div
 */
export const tagTemplate = (tagname, category) => {
  const tag = document.createElement("div");
  tag.classList.add("tag", "rounded-4");
  tag.setAttribute("data-category", category);

  const name = document.createElement("p");
  name.innerHTML = tagname;

  const closeBtn = document.createElement("button");
  closeBtn.addEventListener("click", () => {
    removeTag(tagname);
    tag.remove();
  });

  tag.appendChild(name);
  tag.appendChild(closeBtn);

  return tag;
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
 * @param {*} tagname Tag name
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
    displayRecipes(recipes, true);
    return;
  }
  const recipesIDs = searchOnTags(tags);
  const searched = JSON.parse(sessionStorage.getItem("recipes"));
  const recipes = searched.filter((recipe) => recipesIDs.includes(recipe.id));
  storeSearchedRecipes(recipes);
  displayRecipes(recipes, true);
};

export const resetTags = () => {
  sessionStorage.removeItem("tags");
};
