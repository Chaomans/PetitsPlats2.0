import { removeTag } from "../index.js";

/**
 *
 * @param {string} tagname Name of the tag
 * @returns {HTMLDivElement} Tag Template Div
 */
export const tagTemplate = (tagname, category) => {
  const tag = document.createElement("div");
  tag.classList.add("tag", "rounded-4");
  tag.setAttribute("data-category", category);
  tag.setAttribute("tabindex", 0);

  const name = document.createElement("p");
  name.innerHTML = tagname;

  const closeBtn = document.createElement("button");
  closeBtn.addEventListener("click", () => {
    removeTag(tagname);
    tag.remove();
  });

  tag.appendChild(name);
  tag.appendChild(closeBtn);

  tag.addEventListener("keyup", (e) => {
    if (
      document.activeElement.getAttribute("category") ===
        tag.getAttribute("category") &&
      e.key === "Enter"
    ) {
      closeBtn.click();
    }
  });

  return tag;
};

export const resetTags = () => {
  sessionStorage.removeItem("tags");
};
