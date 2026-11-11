const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("toggle");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("toggle");
    });
  });
}

const PROJECTS_PREVIEW_COUNT = 6;
const projectsGrid = document.getElementById("projects-grid");
const projectsToggle = document.getElementById("projects-toggle");

if (projectsGrid && projectsToggle) {
  const cards = Array.from(projectsGrid.querySelectorAll(".bento-item"));
  if (cards.length > PROJECTS_PREVIEW_COUNT) {
    const labelSpan = projectsToggle.querySelector(".btn-view-all-label");
    let isCollapsed = true;

    const setCollapsed = (collapsed) => {
      isCollapsed = collapsed;
      cards.forEach((card, index) => {
        if (index >= PROJECTS_PREVIEW_COUNT) {
          card.classList.toggle("is-collapsed", collapsed);
        }
      });
      projectsToggle.setAttribute("aria-expanded", String(!collapsed));
      labelSpan.textContent = collapsed
        ? `View All Projects (${cards.length})`
        : "Show Less";
    };

    setCollapsed(true);
    projectsToggle.hidden = false;

    projectsToggle.addEventListener("click", () => {
      const nextCollapsed = !isCollapsed;
      setCollapsed(nextCollapsed);
      if (nextCollapsed) {
        document.getElementById("projects").scrollIntoView();
      }
    });
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".scroll-reveal")
  .forEach((el) => observer.observe(el));

const themeBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

if (localStorage.getItem("theme")) {
  htmlElement.setAttribute("data-theme", localStorage.getItem("theme"));
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}
