// =====================
// Shared helpers (all pages)
// =====================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const toggleBtn = document.querySelector(".nav-toggle");
const mobileMenu = document.getElementById("mobileMenu");

if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

// =====================
// Fade-in on scroll
// =====================
const fadeElements = document.querySelectorAll(".fade-in");
if (fadeElements.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

// =====================
// Dark mode toggle
// =====================
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    themeToggle.textContent = "Dark Mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// =====================
// Registration form (Home page)
// =====================
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
    li.textContent = `${s.fullName} (${s.email}) — ${s.region} — ${
      s.interests.join(", ") || "No interests selected"
    }`;
    signupList.appendChild(li);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setStatus(message, color = "#111") {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = color;
}

function animateSuccess(message) {
  if (!statusEl) return;
  statusEl.style.transition = "none";
  statusEl.style.opacity = "0";
  statusEl.textContent = message;
  statusEl.style.color = "green";

  setTimeout(() => {
    statusEl.style.transition = "opacity 0.6s ease";
    statusEl.style.opacity = "1";
  }, 30);
}

if (form) {
  renderSignups();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // ✅ Correctly get values (not elements)
    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const region = document.getElementById("region")?.value || "";

    const interests = [...document.querySelectorAll('input[name="interests"]:checked')]
      .map((cb) => cb.value);

    // Validation rules
    const errors = [];
    if (fullName.length < 3) errors.push("Please enter your full name.");
    if (!isValidEmail(email)) errors.push("Please enter a valid email address.");
    if (!region) errors.push("Please select a preferred region.");

    if (errors.length > 0) {
      setStatus(errors.join(" "), "crimson");
      return;
    }

    // Store in localStorage
    const signups = getStoredSignups();
    signups.push({
      fullName,
      email,
      region,
      interests,
      createdAt: new Date().toISOString(),
    });
    storeSignups(signups);

    // Success message (animated)
    animateSuccess(`Thanks, ${fullName}! You’re signed up for updates.`);

    form.reset();
    renderSignups();
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("signups");
    renderSignups();
    setStatus("Stored signups cleared.", "#111");
  });
}

// =====================
// Gallery page: filters + lightbox
// =====================
const filterButtons = document.querySelectorAll(".chip[data-filter]");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

// Filters
if (filterButtons.length && galleryItems.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === "all" || category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
}

// Lightbox open
document.querySelectorAll(".gallery-btn").forEach((button) => {
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

// Lightbox close
function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) lightboxImg.src = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden && e.key === "Escape") closeLightbox();
  });
}
