// Shared helpers for all pages
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle (small enhancement)
const toggleBtn = document.querySelector(".nav-toggle");
const mobileMenu = document.getElementById("mobileMenu");

if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

// Registration form logic (Requirement 8: JS data collection & evaluation)
const form = document.getElementById("regForm");
const statusEl = document.getElementById("formStatus");
const signupList = document.getElementById("signupList");
const clearBtn = document.getElementById("clearSignups");

function getStoredSignups() {
  try {
    return JSON.parse(localStorage.getItem("signups") || "[]");
  } catch {
    return [];
  }
}

function storeSignups(signups) {
  localStorage.setItem("signups", JSON.stringify(signups));
}

function renderSignups() {
  if (!signupList) return;
  const signups = getStoredSignups();
  signupList.innerHTML = "";

  if (signups.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No signups yet.";
    signupList.appendChild(li);
    return;
  }

  for (const s of signups.slice(-5).reverse()) {
    const li = document.createElement("li");
    li.textContent = `${s.fullName} (${s.email}) — ${s.region} — ${s.interests.join(", ") || "No interests selected"}`;
    signupList.appendChild(li);
  }
}

function isValidEmail(email) {
  // Simple validation for assignment purposes
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  renderSignups();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const region = document.getElementById("region").value;

    const interests = [...document.querySelectorAll('input[name="interests"]:checked')]
      .map(cb => cb.value);

    // Evaluation rules
    const errors = [];
    if (fullName.length < 3) errors.push("Please enter your full name.");
    if (!isValidEmail(email)) errors.push("Please enter a valid email address.");
    if (!region) errors.push("Please select a preferred region.");

    if (errors.length > 0) {
      if (statusEl) {
        statusEl.textContent = errors.join(" ");
        statusEl.style.color = "crimson";
      }
      return;
    }

    // Data collection: store in localStorage
    const signups = getStoredSignups();
    signups.push({
      fullName,
      email,
      region,
      interests,
      createdAt: new Date().toISOString()
    });
    storeSignups(signups);

    if (statusEl) {
      statusEl.textContent = `Thanks, ${fullName}! You’re signed up for updates.`;
      statusEl.style.color = "green";
    }

    form.reset();
    renderSignups();
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("signups");
    renderSignups();
    if (statusEl) {
      statusEl.textContent = "Stored signups cleared.";
      statusEl.style.color = "#111";
    }
  });
}
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));
statusEl.style.opacity = "0";
statusEl.textContent = `Thanks, ${fullName}! You’re signed up for updates.`;
statusEl.style.color = "green";

setTimeout(() => {
  statusEl.style.transition = "opacity 0.6s ease";
  statusEl.style.opacity = "1";
}, 50);
const toggle = document.getElementById("themeToggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "Light Mode" : "Dark Mode";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "Light Mode";
  }
}
// ===== Gallery page: filters + lightbox =====
const filterButtons = document.querySelectorAll(".chip[data-filter]");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

// Filters
if (filterButtons.length && galleryItems.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        const show = filter === "all" || category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
}

// Lightbox open
document.querySelectorAll(".gallery-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;

    const full = button.dataset.full;
    const alt = button.dataset.alt || "Gallery image";

    lightboxImg.src = full;
    lightboxImg.alt = alt;

    if (lightboxCaption) {
      const title = button.querySelector("strong")?.textContent || "";
      const tag = button.querySelector(".muted")?.textContent || "";
      lightboxCaption.textContent = [title, tag].filter(Boolean).join(" • ");
    }

    lightbox.hidden = false;
    lightboxClose?.focus();
  });
});

// Lightbox close handlers
function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) lightboxImg.src = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    // Click outside the inner area closes
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden && e.key === "Escape") closeLightbox();
  });
}
