const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())

// ---------- TEST ----------

app.get("/", (req, res) => {
  res.send("API running")
})


// ---------- BRANDS ----------

app.get("/brands", async (req, res) => {
  const { data, error } = await supabase.from("brands").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// ---------- MODELS ----------

app.get("/models", async (req, res) => {
  const { data, error } = await supabase.from("models").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// ---------- PRODUCTS ----------

app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*")
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


// ---------- STOCK ----------

app.get("/stock", async (req, res) => {

  const { data, error } = await supabase
    .from("stock_transactions")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/stock", async (req, res) => {

  const {
    company_id,
    product_id,
    type,
    qty,
    note
  } = req.body

  const { data, error } = await supabase
    .from("stock_transactions")
    .insert([
      {
        company_id,
        product_id,
        type,
        qty,
        note
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})


// ---------- SERIAL ----------

app.get("/serials", async (req, res) => {

  const { data, error } = await supabase
    .from("product_serials")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/serials", async (req, res) => {

  const {
    company_id,
    product_id,
    serial,
    status
  } = req.body

  const { data, error } = await supabase
    .from("product_serials")
    .insert([
      {
        company_id,
        product_id,
        serial,
        status
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})


// ---------- SALES ----------

app.get("/sales", async (req, res) => {

  const { data, error } = await supabase
    .from("sales")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/sales", async (req, res) => {

  const {
    company_id,
    customer_id,
    total
  } = req.body

  const { data, error } = await supabase
    .from("sales")
    .insert([
      {
        company_id,
        customer_id,
        total
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})


// ---------- PURCHASE ----------

app.get("/purchases", async (req, res) => {

  const { data, error } = await supabase
    .from("purchases")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/purchases", async (req, res) => {

  const {
    company_id,
    vendor_id,
    total
  } = req.body

  const { data, error } = await supabase
    .from("purchases")
    .insert([
      {
        company_id,
        vendor_id,
        total
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})


// ---------- EXPENSES ----------

app.get("/expenses", async (req, res) => {

  const { data, error } = await supabase
    .from("expenses")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)
})

app.post("/expenses", async (req, res) => {

  const {
    company_id,
    category_id,
    title,
    amount,
    note,
    expense_date,
    payment_method_id
  } = req.body

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        company_id,
        category_id,
        title,
        amount,
        note,
        expense_date,
        payment_method_id
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)
})


// ---------- SERVER ----------

app.listen(5000, () => {
  console.log("Server running on 5000")
})