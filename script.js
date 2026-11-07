const events = [
  {id:1,title:"Neon Nights Music Festival",category:"Music",date:"Dec 14, 2026",time:"6:00 PM",venue:"Lakeview Arena, Bhubaneswar",price:"₹499 onwards",featured:true,image:"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=85",description:"A night of electric performances, incredible sound, and unforgettable energy. Discover emerging artists alongside some of the most exciting names on the independent music scene."},
  {id:2,title:"Future Forward: Tech Summit",category:"Technology",date:"Dec 19, 2026",time:"9:30 AM",venue:"Innovation Hub, Bhubaneswar",price:"Free entry",featured:true,image:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85",description:"Meet builders, founders, and curious minds exploring AI, emerging technology, and the ideas shaping tomorrow. Includes talks, hands-on sessions, and networking."},
  {id:3,title:"The Art of Seeing",category:"Art",date:"Dec 22, 2026",time:"11:00 AM",venue:"Gallery 21, Bhubaneswar",price:"₹199 onwards",featured:false,image:"https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",description:"Step into a vibrant showcase of contemporary art, photography, and visual storytelling by independent creators. A relaxed space to look closer and find inspiration."},
  {id:4,title:"The Founders' Table",category:"Business",date:"Jan 08, 2027",time:"10:00 AM",venue:"The Works, Bhubaneswar",price:"₹299 onwards",featured:false,image:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85",description:"An intimate gathering for aspiring entrepreneurs and experienced founders. Share lessons, build meaningful connections, and leave with practical ideas for your next move."},
  {id:5,title:"The Sunday Food Social",category:"Food",date:"Jan 17, 2027",time:"12:00 PM",venue:"Forest Park Grounds, Bhubaneswar",price:"₹349 onwards",featured:false,image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85",description:"Come hungry. Explore local favourites, creative pop-ups, live cooking, and good company at a food gathering made for sharing and discovering new flavours."},
  {id:6,title:"Reset: Mind & Body",category:"Wellness",date:"Jan 24, 2027",time:"7:00 AM",venue:"Botanical Garden, Bhubaneswar",price:"₹249 onwards",featured:false,image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",description:"Take a breath and reset with guided yoga, mindful movement, and simple wellness practices in a peaceful outdoor setting. Suitable for beginners and regulars alike."}
];

const grid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const eventDialog = document.getElementById("eventDialog");
const registerDialog = document.getElementById("registerDialog");
const selectedEvent = document.getElementById("selectedEvent");

function renderEvents() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = events.filter(event => {
    const matchesText = `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase().includes(term);
    return matchesText && (category === "all" || event.category === category);
  });
  document.getElementById("eventCount").textContent = String(filtered.length).padStart(2, "0");
  document.getElementById("emptyState").hidden = filtered.length !== 0;
  grid.innerHTML = filtered.map(event => `
    <article class="event-card" tabindex="0" role="button" aria-label="View ${event.title}" data-id="${event.id}">
      <div class="event-image"><img src="${event.image}" alt="${event.title}" loading="lazy"><span class="category-pill">${event.category}</span>${event.featured ? '<span class="featured-pill">FEATURED</span>' : ""}</div>
      <div class="event-info"><div class="event-meta"><span>${event.date}</span><span>•</span><span>${event.time}</span></div><h3>${event.title}</h3><p>${event.description.slice(0,105)}...</p><div class="card-bottom"><strong>${event.venue}</strong><span>↗</span></div></div>
    </article>`).join("");
  grid.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", () => showDetails(Number(card.dataset.id)));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showDetails(Number(card.dataset.id)); } });
  });
}

function showDetails(id) {
  const event = events.find(item => item.id === id);
  document.getElementById("dialogContent").innerHTML = `
    <div class="detail-hero"><img src="${event.image}" alt="${event.title}"></div>
    <div class="detail-body"><div class="eyebrow">${event.category.toUpperCase()} ${event.featured ? " • FEATURED EVENT" : ""}</div><h2>${event.title}</h2><p>${event.description}</p>
    <div class="detail-facts"><span>◷ ${event.date} · ${event.time}</span><span>⌖ ${event.venue}</span><strong>${event.price}</strong></div>
    <button class="button button-primary" id="registerForEvent">Register for this event ↗</button></div>`;
  eventDialog.showModal();
  document.getElementById("registerForEvent").addEventListener("click", () => { eventDialog.close(); openRegistration(id); });
}

function openRegistration(id) {
  selectedEvent.innerHTML = events.map(event => `<option value="${event.id}">${event.title}</option>`).join("");
  if (id) selectedEvent.value = String(id);
  document.getElementById("registrationForm").hidden = false;
  document.querySelector(".form-heading").hidden = false;
  document.getElementById("successMessage").hidden = true;
  clearErrors();
  registerDialog.showModal();
}

function clearErrors() {
  ["nameError","emailError","phoneError","eventError"].forEach(id => document.getElementById(id).textContent = "");
}
function validateForm() {
  clearErrors();
  let valid = true;
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  if (name.length < 2 || !/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) { document.getElementById("nameError").textContent = "Enter a valid name (at least 2 characters)."; valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { document.getElementById("emailError").textContent = "Enter a valid email address."; valid = false; }
  if (!/^[6-9]\d{9}$/.test(phone)) { document.getElementById("phoneError").textContent = "Enter a valid 10-digit Indian mobile number."; valid = false; }
  if (!events.some(event => String(event.id) === selectedEvent.value)) { document.getElementById("eventError").textContent = "Please select an event."; valid = false; }
  return valid;
}

document.getElementById("registrationForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm()) return;
  const event = events.find(item => String(item.id) === selectedEvent.value);
  document.getElementById("registrationForm").hidden = true;
  document.querySelector(".form-heading").hidden = true;
  document.getElementById("successText").textContent = `Thanks, ${document.getElementById("fullName").value.trim()}! Your spot for ${event.title} is confirmed.`;
  document.getElementById("successMessage").hidden = false;
});
document.getElementById("doneButton").addEventListener("click", () => registerDialog.close());
document.getElementById("closeDialog").addEventListener("click", () => eventDialog.close());
document.getElementById("closeRegister").addEventListener("click", () => registerDialog.close());
searchInput.addEventListener("input", renderEvents);
categoryFilter.addEventListener("change", renderEvents);
document.getElementById("menuToggle").addEventListener("click", () => {
  const links = document.getElementById("navLinks");
  const isOpen = links.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));
renderEvents();
