const express = require("express");
const cors = require("cors");
const { products } = require("./data");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Mini Ecommerce API is running 🚀" });
});

// ─── Products ────────────────────────────────────────────────────────────────

// GET all products (with optional category, search, brand & price filters)
app.get("/api/products", (req, res) => {
  const { category, search, sort, brand, minPrice, maxPrice } = req.query;
  let result = [...products];

  if (category && category !== "All") {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (brand && brand !== "All") {
    result = result.filter(
      (p) => p.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  if (minPrice) {
    result = result.filter((p) => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter((p) => p.price <= parseFloat(maxPrice));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  res.json({ success: true, count: result.length, products: result });
});

// GET single product by ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, product });
});

// GET product categories
app.get("/api/categories", (req, res) => {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  res.json({ success: true, categories });
});

// ─── Cart ────────────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

const CART_FILE = path.join(__dirname, "cart.json");

// Load cart from file or initialize
let cart = [];
if (fs.existsSync(CART_FILE)) {
  try {
    cart = JSON.parse(fs.readFileSync(CART_FILE, "utf-8"));
  } catch (e) {
    cart = [];
  }
}

const saveCart = () => {
  fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
};

app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, cart, total: parseFloat(total.toFixed(2)) });
});

app.post("/api/cart", (req, res) => {
  const { productId, quantity = 1, color, size } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && item.color === color && item.size === size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      cartItemId: `${productId}-${Date.now()}`,
      productId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      color: color || product.colors[0],
      size: size || product.sizes[0],
      quantity,
    });
  }
  saveCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, message: "Item added", cart, total: parseFloat(total.toFixed(2)) });
});

app.patch("/api/cart/:cartItemId", (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  const itemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (itemIndex === -1) return res.status(404).json({ success: false, message: "Cart item not found" });

  if (quantity <= 0) cart.splice(itemIndex, 1);
  else cart[itemIndex].quantity = quantity;

  saveCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, cart, total: parseFloat(total.toFixed(2)) });
});

app.delete("/api/cart/:cartItemId", (req, res) => {
  const { cartItemId } = req.params;
  const itemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (itemIndex === -1) return res.status(404).json({ success: false, message: "Cart item not found" });
  cart.splice(itemIndex, 1);
  saveCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, message: "Item removed", cart, total: parseFloat(total.toFixed(2)) });
});

app.delete("/api/cart", (req, res) => {
  cart.length = 0;
  saveCart();
  res.json({ success: true, message: "Cart cleared", cart: [], total: 0 });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛍️  Mini Ecommerce API running at http://localhost:${PORT}\n`);
  console.log(`  GET  /api/products       → All products`);
  console.log(`  GET  /api/products/:id   → Single product`);
  console.log(`  GET  /api/categories     → All categories`);
  console.log(`  GET  /api/cart           → View cart`);
  console.log(`  POST /api/cart           → Add to cart`);
  console.log(`  PATCH /api/cart/:id      → Update quantity`);
  console.log(`  DELETE /api/cart/:id     → Remove item\n`);
});
