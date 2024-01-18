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
