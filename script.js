const defaultWishlistItems = [
  {
    id: "clothing-accessories-bts-basketball-jersey-j-hope-94",
    category: "clothing-accessories",
    title: "BTS Basketball Jersey (J-HOPE 94)",
    price: "$18.99+",
    description: "A BTS Basketball Jersey for teens, perfect for fans of the K-pop group. Available in various sizes and colors.",
    image: "jersey.jpg",
    url: "https://www.etsy.com/listing/4522109554/custom-bts-basketball-jersey-for-teen?gpla=1&gao=1&&utm_source=google&utm_medium=cpc&utm_campaign=shopping_us_en_us_-weddings&utm_custom1=_k_Cj0KCQjw9ZLSBhCcARIsAEhGKgPpvhEsg0fmCQ1viqQDMZEwwS2BADQRl2IHSCFJsSC7L8yBqiGkgmwaAt8cEALw_wcB_k_&utm_content=go_21791667543_169566885998_716586690714_pla-298195655715_c__4522109554_12768591&utm_custom2=21791667543&gad_source=1&gad_campaignid=21791667543&gbraid=0AAAAADtcfRLqxFXzE1Q6QeN4YwgKEjjTB&gclid=Cj0KCQjw9ZLSBhCcARIsAEhGKgPpvhEsg0fmCQ1viqQDMZEwwS2BADQRl2IHSCFJsSC7L8yBqiGkgmwaAt8cEALw_wcB",
  },
  {
    id: "tech-white-and-pink-mechanical-keyboard",
    category: "tech",
    title: "White and Pink Mechanical Keyboard",
    price: "$44.99",
    description: "A stylish mechanical keyboard with customizable switches.",
    image: "keyboard.png",
    url: "https://redragonshop.com/products/60-pink-mechanical-keyboard?variant=39426857140273&country=US&currency=USD&utm_source=google&utm_medium=cpc&utm_campaign=shopping&utm_content=product&utm_campaign=GGPALL&utm_source=Google&utm_medium=cpc&gad_source=1&gad_campaignid=23545058082&gbraid=0AAAAAC2mNQCw1CtVRBSUdc-FYML0Z0j1Q&gclid=Cj0KCQjw9ZLSBhCcARIsAEhGKgMZKa5NgzJR8CVc4tq-QhKdOXPC9AAIpa5R_rs8-fxg-O_13dbVZ9YaAmJVEALw_wcB",
  },
];

const categoryNames = {
  "clothing-accessories": "👗 Clothing/Accessories",
  "tech": "💻 Tech",
  "decor": "🏠 Decor",
  "gaming": "🎮 Gaming",
  "books": "📚 Books",
};

const STORAGE_KEY = "shoppingWishlistState";
const ITEMS_STORAGE_KEY = "shoppingWishlistItems";

// Load saved favorite and purchased states from Local Storage.
const loadWishlistState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Failed to load wishlist state from localStorage:", error);
    return {};
  }
};

// Persist favorite and purchased state so the UI stays consistent after refresh.
const saveWishlistState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save wishlist state to localStorage:", error);
  }
};

// Load saved wishlist items from Local Storage if available.
const loadWishlistItems = () => {
  try {
    const stored = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultWishlistItems;
    }
  } catch (error) {
    console.warn("Failed to load wishlist items from localStorage:", error);
  }

  return defaultWishlistItems;
};

// Persist newly added items so they remain after a refresh.
const saveWishlistItems = (items) => {
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to save wishlist items to localStorage:", error);
  }
};

const wishlistState = loadWishlistState();
let wishlistItems = loadWishlistItems();

const itemsContainer = document.getElementById("items");
const searchInput = document.getElementById("wishlist-search");
const addItemForm = document.getElementById("add-item-form");
let currentSearchTerm = "";

// Build the category buckets from the current item list so new items appear immediately.
const buildCategories = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
};

// Create the card markup for each wishlist item.
const createItemCard = (item) => {
  const card = document.createElement("div");
  card.className = "item-card";

  const savedState = wishlistState[item.id] || { favorite: false, purchased: false };
  const favoriteLabel = savedState.favorite ? "❤️ Favorite" : "🤍 Favorite";
  const purchasedLabel = savedState.purchased ? "☑ Purchased" : "☐ Purchased";

  if (savedState.purchased) {
    card.classList.add("purchased");
  }

  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="item-info">
      <h2>${item.title}</h2>
      <p>Price: ${item.price}</p>
      <p>${item.description}</p>
      <a href="${item.url}" target="_blank"><button class="view-button">View Item</button></a>

      <button class="favorite-button">${favoriteLabel}</button>
      <button class="purchased-button">${purchasedLabel}</button>
      <button class="delete-button">🗑 Delete Item</button>
    </div>
  `;

  const favoriteButton = card.querySelector(".favorite-button");
  if (favoriteButton) {
    favoriteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const isFavorited = favoriteButton.textContent.trim() === "❤️ Favorite";
      favoriteButton.textContent = isFavorited ? "🤍 Favorite" : "❤️ Favorite";
      favoriteButton.style.backgroundColor = isFavorited ? "" : "#ff69b4";

      wishlistState[item.id] = {
        ...wishlistState[item.id],
        favorite: !isFavorited,
      };
      saveWishlistState(wishlistState);
    });
  }

  const purchasedButton = card.querySelector(".purchased-button");
  if (purchasedButton) {
    purchasedButton.addEventListener("click", (event) => {
      event.preventDefault();
      const isPurchased = purchasedButton.textContent.trim() === "☑ Purchased";
      purchasedButton.textContent = isPurchased ? "☐ Purchased" : "☑ Purchased";
      card.classList.toggle("purchased", !isPurchased);

      wishlistState[item.id] = {
        ...wishlistState[item.id],
        purchased: !isPurchased,
      };
      saveWishlistState(wishlistState);
    });
  }

  const deleteButton = card.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      wishlistItems = wishlistItems.filter((wishlistItem) => wishlistItem.id !== item.id);
      delete wishlistState[item.id];
      saveWishlistItems(wishlistItems);
      saveWishlistState(wishlistState);
      renderWishlist(currentSearchTerm);
    });
  }

  return card;
};

// Render the current wishlist and apply the live search filter.
const renderWishlist = (searchTerm = "") => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categories = buildCategories(wishlistItems);
  itemsContainer.innerHTML = "";

  let hasVisibleItems = false;

  Object.keys(categoryNames).forEach((categoryId) => {
    const items = (categories[categoryId] || []).filter((item) => {
      return !normalizedSearch || item.title.toLowerCase().includes(normalizedSearch);
    });

    if (items.length === 0) {
      return;
    }

    hasVisibleItems = true;
    const section = document.createElement("section");
    section.id = categoryId;

    const categoryHeader = document.createElement("div");
    categoryHeader.className = "category";
    categoryHeader.innerHTML = `<h2>${categoryNames[categoryId]}</h2>`;
    section.appendChild(categoryHeader);

    items.forEach((item) => {
      section.appendChild(createItemCard(item));
    });

    itemsContainer.appendChild(section);
  });

  if (!hasVisibleItems) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No wishlist items match your search.";
    itemsContainer.appendChild(emptyState);
  }
};

// Keep the current search term in sync while the user types.
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    currentSearchTerm = event.target.value;
    renderWishlist(currentSearchTerm);
  });
}

// Handle the form submission and add a new item immediately.
if (addItemForm) {
  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(addItemForm);
    const title = String(formData.get("title") || "").trim();
    const price = String(formData.get("price") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const url = String(formData.get("url") || "").trim();

    if (!title || !price || !description || !category) {
      return;
    }

    const newItem = {
      id: `${category}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`,
      category,
      title,
      price,
      description,
      image: image || "placeholder.png",
      url: url || "https://example.com",
    };

    // Add the new item to the live array and save it so it is available after refresh.
    wishlistItems = [...wishlistItems, newItem];
    saveWishlistItems(wishlistItems);
    addItemForm.reset();
    renderWishlist(currentSearchTerm);
  });
}

renderWishlist(currentSearchTerm);
