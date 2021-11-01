export const cusAlert = (state, text) => {
  const alContainer = document.createElement("div");
  alContainer.classList.add("alert");
  alContainer.classList.add(`alert--${state ? "success" : "error"}`);

  setTimeout(() => {
    alContainer.classList.toggle("alert-show");
  }, 100);

  const txt = document.createTextNode(text);
  alContainer.appendChild(txt);
  document.body.insertAdjacentElement("afterbegin", alContainer);

  setInterval(() => {
    alContainer.classList.toggle("alert-show");
    document.body.getElementsByClassName("alert")[0].remove();
  }, 5000);
};
