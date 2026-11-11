const layerIcons = {
  Backend: "fa-server",
  Frontend: "fa-desktop",
  Database: "fa-database",
  "DevOps / Infra": "fa-cloud",
  Integrations: "fa-plug",
  Testing: "fa-vial",
};

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
let lightboxTrigger = null;

function openLightbox(src, alt, trigger) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxTrigger = trigger;
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lightboxTrigger) {
    lightboxTrigger.focus();
    lightboxTrigger = null;
  }
}

function setupLightbox() {
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createMetaItem(iconClass, label, value) {
  const item = document.createElement("li");
  item.append(
    createElement("i", `fas ${iconClass}`),
    createElement("span", "cs-meta-label", label),
    createElement("span", "", value),
  );
  return item;
}

function renderMeta(project) {
  const metaList = document.getElementById("cs-meta");
  if (project.role) {
    metaList.append(createMetaItem("fa-user", "Role", project.role));
  }
  if (project.date) {
    metaList.append(createMetaItem("fa-calendar", "Date", project.date));
  }
  metaList.hidden = metaList.children.length === 0;
}

function renderLink(anchorId, url) {
  const anchor = document.getElementById(anchorId);
  const hasLink = Boolean(url) && url !== "#";
  anchor.hidden = !hasLink;
  if (hasLink) anchor.href = url;
}

function createGalleryItem(src, alt, label, isCover) {
  const button = createElement("button", "cs-gallery-item");
  button.type = "button";
  button.setAttribute("aria-label", label);

  const img = createElement("img");
  img.src = src;
  img.alt = alt;
  if (!isCover) img.loading = "lazy";

  button.append(img);
  button.addEventListener("click", () => openLightbox(src, alt, button));
  return button;
}

function renderGallery(project) {
  const images = [...new Set([project.img, ...project.gallery])];
  const gallery = document.getElementById("cs-gallery");

  images.forEach((src, index) => {
    const position = index + 1;
    const alt = `${project.title} screenshot ${position}`;
    const label = `Enlarge screenshot ${position} of ${images.length}`;
    gallery.append(createGalleryItem(src, alt, label, index === 0));
  });
  document.getElementById("cs-showcase").hidden = images.length === 0;
}

function renderList(listId, items) {
  const list = document.getElementById(listId);
  items.forEach((text) => list.append(createElement("li", "", text)));
}

function renderChallenges(challenges) {
  const list = document.getElementById("cs-challenges");
  challenges.forEach(({ title, detail }) => {
    const item = document.createElement("li");
    item.append(
      createElement("strong", "", title),
      createElement("span", "", detail),
    );
    list.append(item);
  });
}

function createStackGroup(layer, items) {
  const group = createElement("div", "cs-stack-group glass");
  const heading = createElement("h3");
  const icon = createElement(
    "i",
    `fas ${layerIcons[layer] || "fa-layer-group"}`,
  );
  heading.append(icon, ` ${layer}`);

  const chips = createElement("div", "tech-stack");
  items.forEach((item) => chips.append(createElement("span", "", item)));

  group.append(heading, chips);
  return group;
}

function renderStack(stackByCategory) {
  const layers = Object.entries(stackByCategory);
  const stack = document.getElementById("cs-stack");
  layers.forEach(([layer, items]) => {
    stack.append(createStackGroup(layer, items));
  });
  document.getElementById("cs-stack-section").hidden = layers.length === 0;
}

function renderNarrative(project) {
  document.getElementById("cs-overview").textContent = project.overview;
  document.getElementById("cs-problem").textContent = project.problem;
  document.getElementById("cs-problem-card").hidden = !project.problem;

  renderList("cs-architecture", project.architecture);
  document.getElementById("cs-architecture-section").hidden =
    project.architecture.length === 0;
}

function renderFeaturesAndChallenges(project) {
  const hasFeatures = project.features.length > 0;
  const hasChallenges = project.challenges.length > 0;

  renderList("cs-features", project.features);
  renderChallenges(project.challenges);
  document.getElementById("cs-features-card").hidden = !hasFeatures;
  document.getElementById("cs-challenges-card").hidden = !hasChallenges;
  document.getElementById("cs-features-section").hidden =
    !hasFeatures && !hasChallenges;
}

function showNotFound() {
  document.getElementById("cs-content").hidden = true;
  document.getElementById("cs-not-found").hidden = false;
  document.title = "Project not found | Fady Ashraf";
}

function renderCaseStudy() {
  const projectId = new URLSearchParams(window.location.search).get("id");
  // hasOwn keeps inherited keys such as "constructor" from resolving as ids.
  if (!projectId || !Object.hasOwn(projectsData, projectId)) {
    showNotFound();
    return;
  }

  const project = projectsData[projectId];
  document.title = `${project.title} | Fady Ashraf`;
  document.getElementById("cs-title").textContent = project.title;
  document.getElementById("cs-tagline").textContent = project.tagline;

  renderMeta(project);
  renderLink("cs-live", project.live);
  renderLink("cs-code", project.code);
  renderGallery(project);
  renderNarrative(project);
  renderStack(project.stackByCategory);
  renderFeaturesAndChallenges(project);
  setupLightbox();
}

renderCaseStudy();
