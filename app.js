// Mock products
const products = [
  { id: 1, name: "IoT Sensor A1", price: 49.99, desc: "Smart temperature & humidity sensor" },
  { id: 2, name: "Smart Plug P9", price: 19.90, desc: "Energy monitoring smart plug" },
  { id: 3, name: "Gateway G3", price: 299.00, desc: "Edge IoT gateway" }
];

// Utils
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function load(key) { return JSON.parse(localStorage.getItem(key) || "[]"); }

// Shop Page
if (document.getElementById("product-list")) {
  const container = document.getElementById("product-list");
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p><p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <a href="product.html?id=${p.id}">View</a>`;
    container.appendChild(div);
  });
}

// Product Detail
if (document.getElementById("product-detail")) {
  const id = new URLSearchParams(window.location.search).get("id");
  const p = products.find(x => x.id == id);
  if (p) {
    document.getElementById("product-detail").innerHTML =
      `<h2>${p.name}</h2><p>${p.desc}</p><p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>`;
  }
}

// Cart + Checkout
if (document.getElementById("cart")) {
  renderCart();
  document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const cart = load("cart");
    if (!cart.length) return alert("Cart is empty!");
    const orders = load("orders");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder = { id: Date.now(), name, email, total, status: "Processing" };
    orders.push(newOrder);
    save("orders", orders);
    save("cart", []);
    alert("Order placed!");
    window.location.href = "dashboard.html";
  });
}

function renderCart() {
  const cart = load("cart");
  const container = document.getElementById("cart");
  container.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `${item.name} - $${item.price} x ${item.qty}
      <button onclick="removeFromCart(${item.id})">Remove</button>`;
    container.appendChild(div);
  });
}

// Dashboard
if (document.getElementById("stats")) {
  const orders = load("orders");
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  document.getElementById("stats").innerHTML =
    `<p>Total Revenue: $${revenue.toFixed(2)}</p><p>Total Orders: ${orders.length}</p>`;
  const tbody = document.querySelector("#orders tbody");
  orders.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${o.id}</td><td>${o.name}</td><td>$${o.total.toFixed(2)}</td><td>${o.status}</td>`;
    tbody.appendChild(tr);
  });
}

// Cart functions
function addToCart(id) {
  const p = products.find(x => x.id == id);
  let cart = load("cart");
  const existing = cart.find(i => i.id == id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  save("cart", cart);
  alert("Added to cart!");
}
function removeFromCart(id) {
  let cart = load("cart").filter(i => i.id != id);
  save("cart", cart);
  renderCart();
}
