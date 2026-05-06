const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");

// Toggle menu
toggle.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent closing immediately
  nav.classList.toggle("show");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove("show");
  }
});
