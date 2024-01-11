/**
 *
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
 *
 * @param {Recipe} recipe One recipe fetched from data
 *
 * @returns {HTMLDivElement} Card Template
 */
export const cardTemplate = ({
  id,
  image,
  name,
  ingredients,
  time,
  description,
}) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.id = id;

  const img = document.createElement("img");
  img.src = `assets/images/${image}`;
  img.classList.add("card-img-top");
  img.alt = `exemple de ${name}`;

  const recipeTime = document.createElement("p");
  recipeTime.innerHTML = `${time} min`;
  recipeTime.classList.add("rounded-pill");
  recipeTime.classList.add("time");

  const body = document.createElement("div");
  body.classList.add("card-body");

  const title = document.createElement("h5");
  title.innerHTML = name;
  title.classList.add("card-title");

  const recipe = document.createElement("div");
  recipe.classList.add("card-recipe");
  const recipeHeader = document.createElement("h6");
  recipeHeader.innerHTML = "recette";
  const desc = document.createElement("p");
  desc.innerHTML = description;

  const _ingredients = document.createElement("div");
  _ingredients.classList.add("card-ingredients");
  const _ingredientsHeader = document.createElement("h6");
  _ingredientsHeader.innerHTML = "ingrédients";
  const list = document.createElement("div");
  list.classList.add("row", "row-cols-2");
  ingredients.forEach((ingredient) => {
    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("col");

    const ing_Name = document.createElement("p");
    ing_Name.classList.add("ingredient");
    ing_Name.innerHTML = ingredient["ingredient"];

    const ing_quantity = document.createElement("p");
    ing_quantity.classList.add("quantity");
    ing_quantity.innerHTML = getQuantityStr(ingredient);

    ingredientDiv.appendChild(ing_Name);
    ingredientDiv.appendChild(ing_quantity);
    list.appendChild(ingredientDiv);
  });

  card.appendChild(img);
  card.appendChild(recipeTime);
  body.append(title);
  recipe.appendChild(recipeHeader);
  recipe.appendChild(desc);
  _ingredients.appendChild(_ingredientsHeader);
  _ingredients.appendChild(list);
  body.appendChild(recipe);
  body.appendChild(_ingredients);
  card.appendChild(body);

  return card;
};

const getQuantityStr = (ingredient) => {
  if (!ingredient.hasOwnProperty("quantity")) {
    return "";
  }
  if (!ingredient.hasOwnProperty("unit")) {
    return ingredient["quantity"];
  }
  return [ingredient["quantity"], ingredient["unit"]].join(" ");
};
