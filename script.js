const products = [
  { id: 1, name: "Wireless Headphones", price: 15.99, image: "https://powermaccenter.com/cdn/shop/files/SNYI100BLU012000x2000.jpg?v=1692058747" },
  { id: 2, name: "Smartwatch", price: 7.99, image: "https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_grande.png?v=1722230645" },
  { id: 3, name: "Speaker", price: 5.99, image: "https://www.sencor.com/getmedia/6770caad-d0be-4d0d-b5f0-01bbc4c1c555/35059169.jpg.aspx?width=2100&height=2100&ext=.jpg" },
  { id: 4, name: "Fitness Tracker", price: 10.99, image: "https://i5.walmartimages.com/seo/Fitbit-Inspire-2-Fitness-Tracker-Black_96b0eb36-17a8-4fde-a725-ff7cf9f5e675.43dfffa5bd5240f137e9c2f289ab339d.jpeg" },
  { id: 5, name: "Mountain Bike Tires", price: 3.99, image: "https://i.ebayimg.com/images/g/vXEAAOSwjDRlqqn7/s-l1200.jpg" },
  { id: 6, name: "Bike Chain Lubricant", price: 2.99, image: "https://bici.cc/cdn/shop/files/finish-line-dry-bike-chain-lube-8oz-accessories-maintenance-chain-lube-29413556387903.jpg?crop=center&height=1080&v=1718204765&width=1080" },
  { id: 7, name: "Aluminum Pedals", price: 2.99, image: "https://cdn-sacredride.b-cdn.net/wp-content/uploads/2023/02/OneUp-Components_AluminumPedal_OILSLICK_Top_55942120-af70-4807-8796-838e0ee175d7_1400x.webp" },
  { id: 8, name: "LED Bike Light Set", price: 1.99, image: "https://down-ph.img.susercontent.com/file/c377885d5700c5957f4fb075a7c033cb" }
];

let cartItems = [];

function renderProducts(filteredProducts = products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";
  grid.className = "product-grid";

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function handleSearch() {
  const query = document.getElementById("search-input")?.value.toLowerCase() || "";
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    alert(`${product.name} added to cart.`);
  }
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
  }
}

function showCartModal() {
  const modal = document.getElementById("cart-modal");
  const list = document.getElementById("cart-items-list");
  const total = document.getElementById("cart-total");
  if (!modal || !list || !total) return;

  list.innerHTML = "";
  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <div style="display: flex; align-items: center; gap: 5px;">
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="removeFromCart(${item.id})">🗑️</button>
      </div>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    list.appendChild(div);
  });

  total.textContent = `Total: $${totalPrice.toFixed(2)}`;
  modal.classList.remove("hidden");
}

function increaseQuantity(productId) {
  const item = cartItems.find(p => p.id === productId);
  if (item) {
    item.quantity += 1;
    updateCartCount();
    showCartModal();
  }
}

function decreaseQuantity(productId) {
  const item = cartItems.find(p => p.id === productId);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter(p => p.id !== productId);
    }
    updateCartCount();
    showCartModal();
  }
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(p => p.id !== productId);
  updateCartCount();
  showCartModal();
}

function closeCartModal() {
  document.getElementById("cart-modal")?.classList.add("hidden");
}

function handleCheckoutClick() {
  closeCartModal(); // ✅ closes the cart before proceeding

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    alert("Please log in or register before checking out.");
    openSigninModal();
  } else if (cartItems.length === 0) {
    alert("Your cart is empty.");
  } else {
    document.getElementById("checkout-modal")?.classList.remove("hidden");
  }
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal")?.classList.add("hidden");
}

function openSigninModal() {
  document.getElementById("signin-modal")?.classList.remove("hidden");
}

function closeSigninModal() {
  document.getElementById("signin-modal")?.classList.add("hidden");
}

function openRegisterModal() {
  document.getElementById("register-modal")?.classList.remove("hidden");
}

function closeRegisterModal() {
  document.getElementById("register-modal")?.classList.add("hidden");
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
  updateAuthUI();
  alert("You have been logged out.");
}

function updateAuthUI() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  document.getElementById("logout-button")?.classList.toggle("hidden", !isLoggedIn);
  document.getElementById("login-button")?.classList.toggle("hidden", isLoggedIn);
  document.getElementById("register-button")?.classList.toggle("hidden", isLoggedIn);
}

function toggleMenu() {
  const menu = document.getElementById("header-actions");
  menu.classList.toggle("show");
}


document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  updateAuthUI();

  document.getElementById("search-button")?.addEventListener("click", handleSearch);

  document.getElementById("checkout-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = this.name.value;
    const address = this.address.value;
    const contact = this.contact.value;
    alert(`Thank you, ${name}!\nYour order will be shipped to:\n${address}\nContact: ${contact}`);
    this.reset();
    closeCheckoutModal();
    cartItems = [];
    updateCartCount();
  });

  document.getElementById("signin-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      closeSigninModal();
      updateAuthUI();
      alert("You are now logged in!");
    } else {
      alert("Please enter email and password.");
    }
  });

  document.getElementById("register-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      closeRegisterModal();
      updateAuthUI();
      alert("You have registered and are now logged in!");
    } else {
      alert("Please enter email and password.");
    }
  });

  document.getElementById("home-button")?.addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    renderProducts();
  });
});
