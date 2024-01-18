import { cleanWords } from "./utils/words.js";

/**
 *
 * @param {string} str User input
 * @param {string[]} categories List of category
 * @returns {number[]} list of recipe indexes
 */
export const search = (str, categories = []) => {
  const words = JSON.parse(sessionStorage.getItem("words"));
  const toSearch = cleanWords(str)
    .split(" ")
    .filter((word) => word.length > 2);
  const results = {};

  toSearch.map((ts) => {
    const keys = Object.keys(words).filter((key) => matchKey([ts], key));
    if (!keys) {
      return [];
    }
    if (!categories.length) {
      categories = ["title", "ingredients", "ustensils", "description"];
    }
    results[ts] = [
      ...new Set(
        keys
          .map((key) =>
            categories.map((category) => searchCategory(words, key, category))
          )
          .flat(2)
      ),
    ];
  });

  return intersection(results);
};

const searchCategory = (words, key, category) => {
  return words[key][category];
};

/**
 *
 * @param {Map<string, number[]>} arrays recipes indexes
 * @returns {number[]} intersection
 */
const intersection = (arrays) => {
  let inter = [];
  const values = Object.values(arrays);
  values.map((val, i) => {
    if (i === 0) {
      inter.push(...val);
    }
    if (i < values.length - 1) {
      inter = inter.filter((v) => values[i + 1].includes(v));
    }
  });
  return inter;
};

/**
 *
 * @param {string[]} words user input
 * @param {string} key word from recipe
 * @returns {boolean} True if word matches a key
 */
const matchKey = (words, key) => {
  let res = false;
  words.forEach((word) => {
    if (key.includes(word)) {
      res = true;
    }
  });
  return res;
};
