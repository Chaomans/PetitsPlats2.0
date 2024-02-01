export const updateItemsWithTags = () => {
  const currentRecipes = JSON.parse(sessionStorage.getItem("searched"));
  const filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => updateItems(filter, currentRecipes));
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
 * @param {Recipe[]} currentRecipes
 * @param {HTMLDivElement} filter
 */
const updateItems = (filter, currentRecipes) => {
  const list = getItemsList(currentRecipes, filter.getAttribute("category"));
  const tags = JSON.parse(sessionStorage.getItem("tags"))
    .filter(
      (item) => item[1] === filter.getAttribute("category") || item[1] === "all"
    )
    .map((item) => item[0]);
  filter.querySelectorAll(".item").forEach((item) => {
    if (
      !list.filter((listItem) =>
        listItem.toLowerCase().includes(item.innerHTML)
      ).length ||
      tags.includes(item.innerHTML)
    ) {
      item.classList.add("exclude");
    } else {
      item.classList.remove("exclude");
    }
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
 * @param {Recipe[]} recipes
 * @param {string} category
 * @returns {string[]}
 */
const getItemsList = (recipes, category) => {
  switch (category) {
    case "appliances":
      return [...new Set(recipes.map((recipe) => recipe.appliance))];
    case "ustensils":
      return [...new Set(recipes.map((recipe) => recipe.ustensils).flat())];
    case "ingredients":
      return [
        ...new Set(
          recipes
            .map((recipe) =>
              recipe.ingredients.map((ingredient) => ingredient.ingredient)
            )
            .flat(2)
        ),
      ];
    default:
      return [];
  }
};
