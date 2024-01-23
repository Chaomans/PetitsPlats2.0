/**
 *
 * @param {string} words line of text
 * @returns {string} text with words only
 * @example
 * cleanWords('this-is my text(yes it is).')
 * // 'this is my text yes it is'
 */
export const cleanWords = (words) => {
  return words
    .replace(/[^\w\sàâäãéèêëìîïôöòóç]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

/**
 *
 * @param {string} word single word
 * @returns {string} word without common accents
 * @example
 * removeAccents("forêt") // foret
 */
export const removeAccents = (word) => {
  return word
    .replace(/[àâäã]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[ìîï]/g, "i")
    .replace(/[ôöòó]/g, "o")
    .replace(/[ç]/g, "c");
};

/**
 *
 * @param {string[]} ingredients
 * @returns {string[]}
 */
export const removePlurals = (ingredients) => {
  return ingredients.filter((plural) => {
    const include = ingredients.filter(
      (ingredient) =>
        plural.toLowerCase().includes(ingredient.toLowerCase()) &&
        plural.localeCompare(ingredient) === 1 &&
        plural.length - ingredient.length === 1 &&
        plural.slice(-1) === "s"
    );
    if (include.length) {
      return false;
    }
    return true;
  });
};
