const products = [
  { id: 1, name: "Wireless Headphones", price: 5000, image: "https://powermaccenter.com/cdn/shop/files/SNYI100BLU012000x2000.jpg?v=1692058747" },
  { id: 2, name: "Smartwatch", price: 3000, image: "https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_grande.png?v=1722230645" },
  { id: 3, name: "Speaker", price: 1500, image: "https://www.sencor.com/getmedia/6770caad-d0be-4d0d-b5f0-01bbc4c1c555/35059169.jpg.aspx?width=2100&height=2100&ext=.jpg" },
  { id: 4, name: "Fitness Tracker", price: 2000, image: "https://i5.walmartimages.com/seo/Fitbit-Inspire-2-Fitness-Tracker-Black_96b0eb36-17a8-4fde-a725-ff7cf9f5e675.43dfffa5bd5240f137e9c2f289ab339d.jpeg" },
  { id: 5, name: "Mountain Bike Tires", price: 250, image: "https://i.ebayimg.com/images/g/vXEAAOSwjDRlqqn7/s-l1200.jpg" },
  { id: 6, name: "Bike Chain Lubricant", price: 150, image: "https://bici.cc/cdn/shop/files/finish-line-dry-bike-chain-lube-8oz-accessories-maintenance-chain-lube-29413556387903.jpg" },
  { id: 7, name: "Aluminum Pedals", price: 200, image: "https://cdn-sacredride.b-cdn.net/wp-content/uploads/2023/02/OneUp-Components_AluminumPedal_OILSLICK_Top_55942120-af70-4807-8796-838e0ee175d7_1400x.webp" },
  { id: 8, name: "LED Bike Light Set", price: 200, image: "https://down-ph.img.susercontent.com/file/c377885d5700c5957f4fb075a7c033cb" }
];

let cartItems = [];

function renderProducts(filtered = products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  filtered.forEach(product => {
    grid.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₱${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function handleSearch() {
  const input = document.getElementById("search-input").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(input));
  renderProducts(filtered);
  document.getElementById("home-button").classList.remove("hidden");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cartItems.find(i => i.id === id);
  if (item) item.quantity++;
  else cartItems.push({ ...product, quantity: 1 });
  updateCartCount();
  alert(`"${product.name}" added to cart.`);
}

function updateCartCount() {
  const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function showCartModal() {
  const list = document.getElementById("cart-items-list");
  const total = document.getElementById("cart-total");
  list.innerHTML = "";
  let totalPrice = 0;

  cartItems.forEach(item => {
    totalPrice += item.price * item.quantity;
    list.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div>
          <button onclick="decreaseQuantity(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})">+</button>
          <button onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
        <span>₱${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  total.textContent = `Total: ₱${totalPrice.toFixed(2)}`;
  document.getElementById("cart-modal").classList.remove("hidden");
}

function increaseQuantity(id) {
  const item = cartItems.find(i => i.id === id);
  if (item) item.quantity++;
  updateCartCount();
  showCartModal();
}

function decreaseQuantity(id) {
  const item = cartItems.find(i => i.id === id);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) cartItems = cartItems.filter(i => i.id !== id);
  }
  updateCartCount();
  showCartModal();
}

function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  updateCartCount();
  showCartModal();
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function handleCheckoutClick() {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  closeCartModal();

  if (cartItems.length === 0) {
    alert("Your cart is empty. Please add items to proceed.");
    return;
  }

  if (!loggedIn) {
    openSigninModal();
    return;
  }

  document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

function openSigninModal() {
  document.getElementById("signin-modal").classList.remove("hidden");
}

function closeSigninModal() {
  document.getElementById("signin-modal").classList.add("hidden");
}

function openRegisterModal() {
  document.getElementById("register-modal").classList.remove("hidden");
}

function closeRegisterModal() {
  document.getElementById("register-modal").classList.add("hidden");
}

function switchToRegister() {
  closeSigninModal();
  openRegisterModal();
}

function switchToSignin() {
  closeRegisterModal();
  openSigninModal();
}

function handleLogout() {
  localStorage.setItem("isLoggedIn", "false");
  localStorage.removeItem("loggedInUser");
  updateAuthUI();
  document.getElementById("signin-form").reset();
  document.getElementById("register-form").reset();
  alert("You have been succesfully logged out!");
}

function updateAuthUI() {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  document.getElementById("logout-button").classList.toggle("hidden", !loggedIn);
  document.getElementById("login-button").classList.toggle("hidden", loggedIn);
  document.getElementById("register-button").classList.toggle("hidden", loggedIn);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateAuthUI();

  document.getElementById("search-button").addEventListener("click", handleSearch);

  document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const address = e.target.address.value;
    const contact = e.target.contact.value;
    const total = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2);

    alert(`Thank you, ${name}!\nYour order total is ₱${total}.\nShipping to: ${address}\nContact: ${contact}`);
    closeCheckoutModal();
    cartItems = [];
    updateCartCount();
  });

  document.getElementById("register-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(user => user.email === email)) {
      alert("Email is already registered.");
      return;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", email);
    closeRegisterModal();
    updateAuthUI();
    document.getElementById("register-form").reset();
    alert("Registration successful! You are now logged in.");
  });

  document.getElementById("signin-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", email);
    closeSigninModal();
    updateAuthUI();
    document.getElementById("signin-form").reset();
    alert("Logged in successfully!");
  });
});
