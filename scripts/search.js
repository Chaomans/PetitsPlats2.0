import { cleanWords } from "./utils/words.js";

export const search = (str, category = "all") => {
  const words = JSON.parse(localStorage.getItem("words"));
  const toSearch = cleanWords(str)
    .split(" ")
    .filter((word) => word.length > 2);
  const keys = Object.keys(words).filter((key) => matchKey(toSearch, key));
  if (!keys) {
    return [];
  }
  if (category !== "all") {
    return searchCategory(words, keys, category);
  }
  return searchAll(words, keys);
};

const searchCategory = (words, keys, category) => {
  const indices = new Set();
  keys.map((key) => {
    words[key][category].forEach((val) => indices.add(val));
  });
  return Array.from(indices);
};

const searchAll = (words, keys) => {
  const indices = new Set();
  const categories = ["title", "ingredients", "ustensils", "description"];
  categories.map((category) => {
    searchCategory(words, keys, category).forEach((val) => indices.add(val));
  });
  return Array.from(indices);
};

const intersection = (a, b) => {
  return new Set([...a].filter((i) => b.has(a)));
};

// const searchCategory = (words, keys, category) => {
//   let inter;
//   keys.map((key, i) => {
//     // words[key][category].forEach((val) => indices.add(val));
//     if (i > 0) {
//       inter = intersection(new Set(words[key][category]), inter);
//     } else {
//       inter = new Set(words[key][category]);
//     }
//     console.log(`cat: ${category} key: ${key} - ${Array.from(inter)}`);
//   });
//   return Array.from(inter);
// };

// const searchAll = (words, keys) => {
//   let inter;
//   const categories = ["title", "ingredients", "ustensils"];
//   categories.map((category, i) => {
//     // searchCategory(words, keys, category).forEach((val) => inter.add(val));
//     if (i > 0) {
//       inter = intersection(
//         new Set(searchCategory(words, keys, category)),
//         inter
//       );
//     } else {
//       inter = new Set(searchCategory(words, keys, category));
//     }
//   });
//   return Array.from(inter);
// };

/**
 *
 * @param {string[]} words user input
 * @param {string} key word from recipe
 * @returns {boolean} True if word matches a key
 */
const matchKey = (words, key) => {
  let res = false;
  words.forEach((word) => {
    if (key.startsWith(word)) {
      res = true;
    }
  });
  return res;
};
