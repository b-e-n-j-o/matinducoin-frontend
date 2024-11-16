document.addEventListener('DOMContentLoaded', (event) => {
    let elements = document.querySelectorAll(".rolling-text");
  
    elements.forEach((element) => {
      let innerText = element.innerText;
      element.innerHTML = "";
  
      let textContainer = document.createElement("div");
      textContainer.classList.add("block");
  
      for (let letter of innerText) {
        let span = document.createElement("span");
        span.innerText = letter.trim() === "" ? "\xa0" : letter;
        span.classList.add("letter");
        textContainer.appendChild(span);
      }
  
      element.appendChild(textContainer);
      element.appendChild(textContainer.cloneNode(true));
  
      element.addEventListener("mouseover", () => {
        element.classList.add("play");
      });
  
      element.addEventListener("mouseleave", () => {
        element.classList.remove("play");
      });
    });
  });
  