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

  renderRepositories(selected);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langButton));
});

let repositories = null;
let repositoryError = false;

function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function renderRepositories(language = document.documentElement.lang) {
  const grid = document.querySelector("#repo-grid");
  if (!grid) return;

  if (repositoryError) {
    grid.innerHTML = `<div class="repo-empty">${language === "en"
      ? "Repositories could not be loaded. Visit the GitHub profile using the link below."
      : "Repoene kunne ikke lastes. Bruk lenken under for å gå til GitHub-profilen."}</div>`;
    return;
  }

  if (!repositories) return;

  if (repositories.length === 0) {
    grid.innerHTML = `<div class="repo-empty">${language === "en"
      ? "Public code and scripts will appear here as they are released."
      : "Offentlig kode og scripts vises her etter hvert som de publiseres."}</div>`;
    return;
  }

  grid.innerHTML = repositories.map((repo) => {
    const description = repo.description || (language === "en" ? "Open repository on GitHub." : "Åpent repo på GitHub.");
    const updated = new Intl.DateTimeFormat(language === "en" ? "en-GB" : "nb-NO", {
      year: "numeric",
      month: "short",
    }).format(new Date(repo.pushed_at));

    return `
      <a class="repo-card" href="${escapeHtml(repo.html_url)}">
        <h3 class="repo-name">${escapeHtml(repo.name)} <span aria-hidden="true">↗</span></h3>
        <p class="repo-description">${escapeHtml(description)}</p>
        <div class="repo-meta">
          ${repo.language ? `<span><i class="language-dot" aria-hidden="true"></i>${escapeHtml(repo.language)}</span>` : ""}
          <span>${language === "en" ? "Updated" : "Oppdatert"} ${escapeHtml(updated)}</span>
        </div>
      </a>`;
  }).join("");
}

async function loadRepositories() {
  try {
    const response = await fetch("https://api.github.com/users/ottolillebo/repos?per_page=100&sort=pushed", {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const data = await response.json();
    repositories = data
      .filter((repo) => !repo.fork && repo.name !== "ottolillebo.github.io" && !repo.archived)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6);
  } catch (error) {
    repositoryError = true;
    console.warn("Could not load GitHub repositories", error);
  }

  renderRepositories(document.documentElement.lang);
}

document.querySelector("#year").textContent = new Date().getFullYear();

let preferredLanguage = "nb";
try {
  preferredLanguage = localStorage.getItem("language") || "nb";
} catch {
  preferredLanguage = "nb";
}

setLanguage(preferredLanguage);
loadRepositories();
