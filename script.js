const header = document.querySelector("[data-header]");
const pilotForm = document.querySelector("[data-pilot-form]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

pilotForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  pilotForm.reset();
});
