/**
 *
 * @param {string} tagname Name of the tag
 * @returns {HTMLDivElement} Tag Template Div
 */
export const tagTemplate = (tagname) => {
  const tag = document.createElement("div");
  tag.classList.add("tag", "rounded-4");

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
  if (!sessionStorage.getItem("tags")) {
    sessionStorage.setItem("tags", JSON.stringify([tagname]));
    displayTag(tag);
    return;
  }
  const tags = new Set(JSON.parse(sessionStorage.getItem("tags")));
  tags.add(tagname);
  sessionStorage.setItem("tags", JSON.stringify(Array.from(tags)));
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
  const tags = new Set(JSON.parse(sessionStorage.getItem("tags")));
  tags.delete(tagname);
  sessionStorage.setItem("tags", JSON.stringify(Array.from(tags)));
};

export const resetTags = () => {
  sessionStorage.removeItem("tags");
};
