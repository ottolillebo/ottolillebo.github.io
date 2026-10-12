const languageButtons = document.querySelectorAll("[data-lang-button]");
const translatedElements = document.querySelectorAll("[data-nb][data-en]");

function setLanguage(language) {
  const selected = language === "en" ? "en" : "nb";
  document.documentElement.lang = selected;

  translatedElements.forEach((element) => {
    element.textContent = element.dataset[selected];
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langButton === selected));
  });

  try {
    localStorage.setItem("language", selected);
  } catch {
    // The page works normally when storage is unavailable.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langButton));
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

let preferredLanguage = "nb";
try {
  preferredLanguage = localStorage.getItem("language") || "nb";
} catch {
  preferredLanguage = "nb";
}

setLanguage(preferredLanguage);
