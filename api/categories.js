const products = [
  { category: "Outerwear" }, { category: "Footwear" }, { category: "Tops" },
  { category: "Accessories" }, { category: "Bags" }, { category: "Electronics" },
  { category: "Sports" }, { category: "Accessories" }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const categories = ["All", ...new Set(products.map(p => p.category))];
  res.status(200).json({ success: true, categories });
};
