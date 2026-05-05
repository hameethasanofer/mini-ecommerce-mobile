const products = [
  { id: "1", name: "Arc'teryx Shell Jacket", brand: "Arc'teryx", category: "Outerwear", price: 349.99, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80", rating: 4.8, reviews: 2341, description: "Ultimate shell jacket.", colors: ["Obsidian", "Wolf"], sizes: ["S", "M", "L"], stock: 18, discount: 30 },
  { id: "2", name: "Pro Runner X500", brand: "Nike", category: "Footwear", price: 179.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", rating: 4.9, reviews: 5820, description: "Elite performance.", colors: ["Black", "White"], sizes: ["8", "9", "10"], stock: 45, discount: 0 },
  { id: "3", name: "Slim Fit Oxford Shirt", brand: "Ralph Lauren", category: "Tops", price: 89.99, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", rating: 4.6, reviews: 1204, description: "Wardrobe essential.", colors: ["White", "Blue"], sizes: ["M", "L", "XL"], stock: 32, discount: 25 },
  { id: "4", name: "Minimalist Chronograph", brand: "MVMT", category: "Accessories", price: 149.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", rating: 4.7, reviews: 3412, description: "Precision-crafted.", colors: ["Black", "Silver"], sizes: ["One Size"], stock: 9, discount: 0 },
  { id: "5", name: "Urban Commuter Backpack", brand: "Peak Design", category: "Bags", price: 259.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", rating: 4.9, reviews: 7800, description: "MagLatch closure.", colors: ["Black", "Sage"], sizes: ["20L"], stock: 22, discount: 13 },
  { id: "6", name: "Wireless Noise-Cancelling Headphones", brand: "Sony", category: "Electronics", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", rating: 4.8, reviews: 12500, description: "Industry-leading noise cancellation.", colors: ["Black", "Silver"], sizes: ["One Size"], stock: 30, discount: 14 },
  { id: "7", name: "Premium Yoga Mat", brand: "Lululemon", category: "Sports", price: 98.00, image: "https://images.unsplash.com/photo-1601925228048-ed3576b8d39c?w=800&q=80", rating: 4.7, reviews: 4300, description: "Grippy and stable.", colors: ["Black", "Pink"], sizes: ["Standard"], stock: 55, discount: 0 },
  { id: "8", name: "Slim Leather Wallet", brand: "Bellroy", category: "Accessories", price: 79.99, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80", rating: 4.8, reviews: 9100, description: "Slim and functional.", colors: ["Tan", "Navy"], sizes: ["One Size"], stock: 40, discount: 0 }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== "All") {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  res.status(200).json({ success: true, count: result.length, products: result });
};
