const express = require("express")
const cors = require("cors")
require("dotenv").config()

const { createClient } = require("@supabase/supabase-js")

const app = express()

app.use(cors())
app.use(express.json())

// ✅ Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// ✅ Root check
app.get("/", (req, res) => {
  res.send("API running 🚀")
})

/* ===========================
   PRODUCTS
=========================== */

app.get("/products/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/products", async (req, res) => {
  const {
    company_id,
    model_id,
    purchase_price,
    sale_price,
    stock_qty,
    min_stock
  } = req.body

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        company_id,
        model_id,
        purchase_price,
        sale_price,
        stock_qty,
        min_stock
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})

/* ===========================
   SALES
=========================== */

app.get("/sales/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)
})

/* ===========================
   PURCHASES
=========================== */

app.get("/purchases/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)
})

/* ===========================
   EXPENSES
=========================== */

app.get("/expenses/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)
})

/* ===========================
   SERIALS / IMEI
=========================== */

app.get("/serials/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data, error } = await supabase
    .from("product_serials")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)
})

/* ===========================
   DASHBOARD
=========================== */

app.get("/dashboard/:company_id", async (req, res) => {
  const { company_id } = req.params

  const { data: sales } = await supabase
    .from("sales")
    .select("total")
    .eq("company_id", company_id)

  const { data: purchases } = await supabase
    .from("purchases")
    .select("total")
    .eq("company_id", company_id)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("company_id", company_id)

  const { data: products } = await supabase
    .from("products")
    .select("stock_qty")
    .eq("company_id", company_id)

  const salesTotal = sales?.reduce((a, b) => a + (b.total || 0), 0) || 0
  const purchaseTotal =
    purchases?.reduce((a, b) => a + (b.total || 0), 0) || 0
  const expenseTotal =
    expenses?.reduce((a, b) => a + (b.amount || 0), 0) || 0

  const totalStockQty =
    products?.reduce((a, b) => a + (b.stock_qty || 0), 0) || 0

  const totalProducts = products?.length || 0

  const profit = salesTotal - purchaseTotal - expenseTotal

  res.json({
    salesTotal,
    purchaseTotal,
    expenseTotal,
    profit,
    totalProducts,
    totalStockQty
  })
})

/* ===========================
   SERVER
=========================== */

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
