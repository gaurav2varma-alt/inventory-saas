require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// AUTHENTICATION & SECURITY
// ==========================================

// In-memory token store
const activeTokens = {};

// Protect Routes Middleware
const authenticateToken = (req, res, next) => {
  // Public routes that don't need token
  const publicRoutes = [
    "/",
    "/company-login",
    "/company-register",
    "/login",
    "/register",
    "/brands",
    "/models",
    "/users"
  ];

  // Exact match or base root exclusion
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];
  
  // Validate token mapping
  if (!activeTokens[token]) {
    return res.status(401).json({ success: false, message: "Unauthorized. Invalid or expired token." });
  }

  // Attach verified company_id to request
  req.company_id = activeTokens[token];
  next();
};

app.use(authenticateToken);


// ==========================================
// PUBLIC ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.get("/brands", async (req, res) => {
  const { data, error } = await supabase.from("brands").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/models", async (req, res) => {
  const { data, error } = await supabase.from("models").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/company-register", async (req, res) => {
  const { name, email, password } = req.body;
  const { data, error } = await supabase
    .from("companies")
    .insert([{ name, email, password }])
    .select();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/company-login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("companies")
    .select("id,name,email")
    .eq("email", email)
    .eq("password", password);

  if (error) return res.status(500).json(error);

  if (!data || data.length === 0) {
    return res.status(401).json({ success: false, message: "Invalid login credentials" });
  }

  const company = data[0];
  
  // Generate a random token
  const token = crypto.randomBytes(32).toString("hex");
  activeTokens[token] = company.id;

  res.json({
    success: true,
    token,
    company
  });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const { data, error } = await supabase.from("users").insert([{ name, email, password }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("password", password);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});


// ==========================================
// PROTECTED API ROUTES
// ==========================================

// Helper validation function
const isAuthorized = (req, targetCompanyId) => {
  return targetCompanyId.toString() === req.company_id.toString();
};


// ------------------------------------------
// DASHBOARD API
// ------------------------------------------
app.get("/dashboard/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const sales = await supabase.from("sales").select("total").eq("company_id", company_id);
  const purchases = await supabase.from("purchases").select("total").eq("company_id", company_id);
  const expenses = await supabase.from("expenses").select("amount").eq("company_id", company_id);
  const products = await supabase.from("products").select("id, stock_qty").eq("company_id", company_id);

  let salesTotal = 0;
  let purchaseTotal = 0;
  let expenseTotal = 0;
  let totalStockQty = 0;

  sales.data?.forEach(i => salesTotal += i.total || 0);
  purchases.data?.forEach(i => purchaseTotal += i.total || 0);
  expenses.data?.forEach(i => expenseTotal += i.amount || 0);
  products.data?.forEach(i => totalStockQty += i.stock_qty || 0);

  const profit = salesTotal - purchaseTotal - expenseTotal;
  const totalProducts = products.data ? products.data.length : 0;

  res.json({ salesTotal, purchaseTotal, expenseTotal, profit, totalProducts, totalStockQty });
});


// ------------------------------------------
// PRODUCTS API
// ------------------------------------------
app.get("/products/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("products").select("*").eq("company_id", company_id);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/products", async (req, res) => {
  const { company_id, model_id, purchase_price, sale_price, stock_qty, min_stock } = req.body;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("products").insert([{ company_id, model_id, purchase_price, sale_price, stock_qty, min_stock }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.put("/products/:id", async (req, res) => {
  const { data, error } = await supabase.from("products").update(req.body).eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.delete("/products/:id", async (req, res) => {
  const { data, error } = await supabase.from("products").delete().eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});


// ------------------------------------------
// SERIALS API
// ------------------------------------------
app.get("/serials/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("product_serials").select("*").eq("company_id", company_id);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/serials", async (req, res) => {
  const { company_id, product_id, serial, status } = req.body;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("product_serials").insert([{ company_id, product_id, serial, status }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.put("/serials/:id", async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase.from("product_serials").update({ status }).eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.delete("/serials/:id", async (req, res) => {
  const { data, error } = await supabase.from("product_serials").delete().eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});


// ------------------------------------------
// SALES API
// ------------------------------------------
app.get("/sales/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("sales").select("*").eq("company_id", company_id);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/sales", async (req, res) => {
  const { company_id, customer_id, total } = req.body;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("sales").insert([{ company_id, customer_id, total }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/sale-items", async (req, res) => {
  const { sale_id, product_id, qty, price, total, serial } = req.body;

  const { data: itemData, error: itemError } = await supabase.from("sale_items").insert([{ sale_id, product_id, qty, price, total }]).select();
  if (itemError) return res.status(500).json(itemError);

  const { data: productData, error: productError } = await supabase.from("products").select("stock_qty, company_id").eq("id", product_id).single();
  if (productError) return res.status(500).json(productError);

  const newStock = (productData.stock_qty || 0) - Number(qty);
  const company_id = productData.company_id;

  const { error: updateError } = await supabase.from("products").update({ stock_qty: newStock }).eq("id", product_id);
  if (updateError) return res.status(500).json(updateError);

  const { error: stockTxError } = await supabase.from("stock_transactions").insert([{ company_id, product_id, type: "out", qty: Number(qty), note: `Sale item added for sale ID: ${sale_id}` }]);
  if (stockTxError) return res.status(500).json(stockTxError);

  if (serial) {
    const { error: serialError } = await supabase.from("product_serials").update({ status: "sold" }).eq("serial", serial).eq("product_id", product_id);
    if (serialError) return res.status(500).json(serialError);
  }

  res.json(itemData);
});


// ------------------------------------------
// PURCHASES API
// ------------------------------------------
app.get("/purchases/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("purchases").select("*").eq("company_id", company_id);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/purchases", async (req, res) => {
  const { company_id, vendor_id, total } = req.body;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("purchases").insert([{ company_id, vendor_id, total }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/purchase-items", async (req, res) => {
  const { purchase_id, product_id, qty, price, total } = req.body;

  const { data: itemData, error: itemError } = await supabase.from("purchase_items").insert([{ purchase_id, product_id, qty, price, total }]).select();
  if (itemError) return res.status(500).json(itemError);

  const { data: productData, error: productError } = await supabase.from("products").select("stock_qty, company_id").eq("id", product_id).single();
  if (productError) return res.status(500).json(productError);

  const newStock = (productData.stock_qty || 0) + Number(qty);
  const company_id = productData.company_id;

  const { error: updateError } = await supabase.from("products").update({ stock_qty: newStock }).eq("id", product_id);
  if (updateError) return res.status(500).json(updateError);

  const { error: stockTxError } = await supabase.from("stock_transactions").insert([{ company_id, product_id, type: "in", qty: Number(qty), note: `Purchase item added for purchase ID: ${purchase_id}` }]);
  if (stockTxError) return res.status(500).json(stockTxError);

  res.json(itemData);
});


// ------------------------------------------
// EXPENSES API
// ------------------------------------------
app.get("/expenses/:company_id", async (req, res) => {
  const company_id = req.params.company_id;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("expenses").select("*").eq("company_id", company_id);
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/expenses", async (req, res) => {
  const { company_id, category_id, title, amount, note, expense_date, payment_method_id } = req.body;
  if (!isAuthorized(req, company_id)) return res.status(403).json({ success: false, message: "Forbidden" });

  const { data, error } = await supabase.from("expenses").insert([{ company_id, category_id, title, amount, note, expense_date, payment_method_id }]).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.put("/expenses/:id", async (req, res) => {
  const { data, error } = await supabase.from("expenses").update(req.body).eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.delete("/expenses/:id", async (req, res) => {
  const { data, error } = await supabase.from("expenses").delete().eq("id", req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});


// ==========================================
// SERVER BOOTSTRAP
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
