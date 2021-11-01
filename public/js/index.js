import { handleLogin, handleLogout } from "./authentication";
import { handleCheckout } from "./checkout";
import { updatePassword, updateUser } from "./users";

if (document.getElementById("loginform")) {
  document.getElementById("loginform").addEventListener("submit", handleLogin);
}

if (document.getElementById("logout")) {
  document.getElementById("logout").addEventListener("click", handleLogout);
}
if (document.getElementById("edit-password")) {
  document.getElementById("edit-password").addEventListener("click", (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    updatePassword({ oldPassword, password, passwordConfirm });
  });
}

if (document.getElementById("upuser")) {
  document.getElementById("upuser").addEventListener("click", (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("email", document.getElementById("email").value);
    form.append("name", document.getElementById("name").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateUser(form);
  });
}

if (document.getElementById("checkout-btn")) {
  document
    .getElementById("checkout-btn")
    .addEventListener("click", handleCheckout);
}

const mapContainer = document.getElementById("map");

if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  mapboxgl.accessToken =
    "pk.eyJ1Ijoib21hcm91YWZpIiwiYSI6ImNrYndpY2NxcTBlbTUycm1vaHEyZHNuM3MifQ.CZ92U9jdnIbrQZgResEq9A";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const element = document.createElement("div");
    element.classList = "marker";
    new mapboxgl.Marker({ element }).setLngLat(loc.coordinates).addTo(map);
    new mapboxgl.Popup({ offset: 30 }).setLngLat(loc.coordinates).addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
