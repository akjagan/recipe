const express = require("express");
const products = require("./products.json");
const OrdersController = require("./controller/orders.controller");
const ProductsController = require("./controller/Products.controller");
const RecipesController = require("./controller/Recipes.controller");
const { createDbConnection } = require("./db");

// Environment variables config
require("dotenv").config();

// Create DB connection
createDbConnection();

// Step 1: Create an API server
const API_SERVER = express();

// Add middleware to parse JSON data
API_SERVER.use(express.json());

// Serve static files
API_SERVER.use(express.static("public"));

// Inject routers
API_SERVER.use("/orders", OrdersController);
API_SERVER.use("/products", ProductsController);
API_SERVER.use("/recipes", RecipesController); // Ensure RecipesController is properly injected

// Root route
API_SERVER.get("/", (request, response) => {
  return response.status(200).json({
    message: "Hello World",
    success: true,
  });
});

// Products route: fetch products with pagination
API_SERVER.get("/products", (request, response) => {
  let result = [];
  const { limit, page } = request.query;

  // Handle pagination
  if (limit && page) {
    const start = Number(limit) * (Number(page) - 1);
    const end = Number(limit) * Number(page);
    result = products.data.slice(start, end);
  } else {
    result = products.data;
  }

  return response.status(200).json({
    message: "Products fetched successfully",
    data: result,
    success: true,
  });
});

// Products route: fetch product by ID
API_SERVER.get("/products/:productId", (request, response) => {
  const matchedProduct = products.data.find(
    (_product) => _product.id === Number(request.params.productId)
  );

  if (!matchedProduct) {
    return response.status(404).json({
      message: "Product not found",
      success: false,
    });
  } else {
    return response.status(200).json({
      message: "Product fetched successfully",
      data: matchedProduct,
      success: true,
    });
  }
});

// Products route: create a new product
API_SERVER.post("/products/create", (request, response) => {
  console.log("HERE", request.body);
  return response.json({
    message: "Product created successfully",
    success: true,
  });
});

// Step 2: Start and listen for incoming requests
const PORT = process.env.PORT || 3001;
const HOSTNAME = process.env.HOSTNAME || "localhost";

API_SERVER.listen(PORT, HOSTNAME, () => {
  console.log("Server Started");
  console.log(`http://${HOSTNAME}:${PORT}`);
});

