/**
 *
 * @param {string} name Title of the filter
 * @param {string} category Search category
 * @returns {HTMLDivElement} Advanced search field Template
 */
export const filterTemplate = (name, category) => {
  const filter = document.createElement("div");
  filter.classList.add("filter", "rounded-4");
  filter.setAttribute("category", category);

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
  items.map((item, i) => {
    const p = document.createElement("p");
    p.id = i;
    p.classList.add("item");
    p.innerHTML = item;
    list.appendChild(p);
  });

  body.appendChild(list);

  filter.appendChild(head);
  filter.appendChild(body);

  return filter;
};
