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
