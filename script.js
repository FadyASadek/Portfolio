const projectsData = {
  sales_system: {
    title: "Sales & Installment Management System",
    desc: "A sophisticated enterprise-level application built with .NET Core MVC to manage complex financial installment plans. It features advanced business logic for automated installment scheduling, rescheduling on new sales, and prioritized payment distribution across ledgers. The system includes a comprehensive financial dashboard powered by Chart.js for real-time analytics like Collection Rate calculations, all architected using 3-Tier Architecture, Repository, Unit of Work, and the Result Pattern for professional-grade error handling.",
    tech: [
      "C#",
      ".NET Core MVC",
      "SQL Server",
      "Chart.js",
      "3-Tier Architecture",
      "Result Pattern",
    ],
    img: "/image/s1.png",
    live: "https://fadyashrafsadek.runasp.net/Account/Login?ReturnUrl=%2F",
    code: "#",
  },
  icpc_natu: {
    title: "ICPC NATU Community Platform",
    desc: "An automated educational ecosystem designed to streamline competitive programming training. The platform integrates directly with the Codeforces API via a custom .NET Core Background Service (IHostedService) that monitors member submissions using secure SHA512 hashing. It features a real-time leaderboard, educational roadmaps, and a multi-role management system (Admin, HR, Content), all built on Clean Architecture (3-Tier) principles to ensure maximum scalability and performance.",
    tech: [
      "ASP.NET Core",
      "Background Service",
      "Clean Architecture",
      "Codeforces API",
      "Identity",
    ],
    img: "/image/s8.png",
    live: "https://icpcnatu.runasp.net/",
    code: "#",
  },
  clinic_api: {
    title: "Clinic Booking System - RESTful API",
    desc: "A high-performance RESTful API engineered for modern healthcare management. It features a dynamic scheduling engine, a complete appointment lifecycle, and a patient review system. The backend follows Clean Architecture principles with a focus on security through JWT-based Role-Based Access Control (Admin, Doctor, Patient). Performance is optimized using server-side filtering, sorting, and pagination, while the Result Pattern ensures consistent and robust error responses.",
    tech: ["C#", ".NET 8 WebAPI", "JWT Auth", "Clean Architecture", "EF Core"],
    img: "/image/api-icon-flat-style-software-integration-vector-illustration-isolated-background-algorithm-programming-sign-business-concept_157943-13795.avif",
    live: "#",
    code: "https://github.com/FadyASadek/Clinic-System-API.git",
  },
  ecommerce_market: {
    title: "Multi-Vendor E-commerce Marketplace",
    desc: "A full-scale e-commerce solution supporting multiple vendors with dedicated dashboards for Admins, Sellers, and Customers. The project implements a robust shopping cart system powered by AJAX for real-time updates without page reloads. Architected using the Repository pattern and ASP.NET Core Identity, the system provides a clean, maintainable codebase capable of handling product management, order processing, and secure user transactions.",
    tech: [
      "ASP.NET Core MVC",
      "Entity Framework",
      "SQL Server",
      "AJAX",
      "Identity",
    ],
    img: "/image/OIP.webp",
    live: "#",
    code: "https://github.com/FadyASadek/E-commerce-Marketplace.git",
  },
  student_mgmt: {
    title: "Student Management System",
    desc: "A modern full-stack application designed for educational data management. It leverages an Angular frontend for a highly responsive user experience and a RESTful .NET Core Web API for the backend. The UI is built with Tailwind CSS to provide a clean, contemporary interface, while the backend ensures efficient CRUD operations and data integrity through SQL Server.",
    tech: ["Angular", "Tailwind CSS", ".NET API", "SQL Server", "TypeScript"],
    img: "/image/230325905-16c648bb-b364-4f1e-a755-426615f5ec54.png",
    live: "#",
    code: "https://github.com/FadyASadek/Student-Management-System.git",
  },
  jwt_auth: {
    title: "JWT-Authentication & Security Project",
    desc: "A deep dive into modern web security, this project implements a full-stack authentication and authorization flow. It demonstrates how to secure API endpoints using JSON Web Tokens (JWT) in a .NET backend and manage user state in an Angular frontend, focusing on best practices for protecting sensitive data and preventing unauthorized access.",
    tech: ["Angular", ".NET Web API", "JWT", "Security Best Practices"],
    img: "/image/Screenshot 2026-02-14 190946.png",
    live: "#",
    code: "https://github.com/FadyASadek/JWT-Authentication-.Net-Angular.git",
  },
  qr_maker: {
    title: "QR Code Generator Service",
    desc: "A lightweight, responsive web tool developed to create custom QR codes on the fly. Built with pure JavaScript, it interacts with third-party APIs and utilizes real-time DOM manipulation to allow users to generate, customize, and download QR codes instantly with a focus on speed and ease of use.",
    tech: ["JavaScript", "DOM Manipulation", "External API", "Responsive UI"],
    img: "/image/Screenshot 2026-02-14 191914.png",
    live: "https://fadyasadek.github.io/QR-code-maker/",
    code: "https://github.com/FadyASadek/QR-code-maker.git",
  },
  memory_game: {
    title: "Interactive Memory Blocks Game",
    desc: "A front-end challenge that focuses on complex state management and game logic. This interactive card-matching game was built from scratch using pure vanilla JavaScript, featuring custom animations, scoring logic, and difficulty levels to demonstrate proficiency in core programming concepts and UI interactions.",
    tech: ["JavaScript", "HTML5", "CSS3 Animations", "Game Logic"],
    img: "/image/game.png",
    live: "https://fadyasadek.github.io/Memory-Blocks-Game/",
    code: "https://github.com/FadyASadek/Memory-Blocks-Game.git",
  },
  qasr_alsalam: {
    title: "Qasr Al-Salam Restaurant Digital Menu",
    desc: "A premium digital menu developed for 'Qasr Al-Salam' restaurant, focusing on visual appeal and seamless mobile interaction. The project uses HTML, CSS, and JS to create a multi-category menu with smooth transitions, responsive layouts for all device sizes, and an intuitive interface that mimics a physical menu's ease of navigation.",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
    img: "/image/قصر السلام.png",
    live: "https://qasr-el-salam.runasp.net/",
    code: "#",
  },
};

const modal = document.getElementById("project-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalStack = document.getElementById("modal-stack");
const modalLive = document.getElementById("modal-live");
const modalCode = document.getElementById("modal-code");

function openModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  // 1. تعبئة البيانات الأساسية
  modalImg.src = project.img;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.desc;

  // 2. تعبئة التقنيات
  modalStack.innerHTML = "";
  project.tech.forEach((tech) => {
    const span = document.createElement("span");
    span.textContent = tech;
    modalStack.appendChild(span);
  });

  // 3. المنطق الذكي للأزرار (Smart Buttons Logic)

  // فحص زرار Live Demo
  if (project.live && project.live !== "#" && project.live !== "") {
    modalLive.style.display = "inline-flex"; // إظهار الزر
    modalLive.href = project.live;
  } else {
    modalLive.style.display = "none"; // إخفاء الزر
  }

  // فحص زرار GitHub Code
  if (project.code && project.code !== "#" && project.code !== "") {
    modalCode.style.display = "inline-flex"; // إظهار الزر
    modalCode.href = project.code;
  } else {
    modalCode.style.display = "none"; // إخفاء الزر
  }

  // فتح المودال
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

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
