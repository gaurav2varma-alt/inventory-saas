const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())

// ROOT
app.get("/", (req, res) => {
  res.send("API running")
})


// BRANDS
app.get("/brands", async (req, res) => {
  const { data, error } = await supabase.from("brands").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// MODELS
app.get("/models", async (req, res) => {
  const { data, error } = await supabase.from("models").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// PRODUCTS
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// SERIALS
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


// SALES
app.get("/sales", async (req, res) => {
  const { data, error } = await supabase.from("sales").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// PURCHASES
app.get("/purchases", async (req, res) => {
  const { data, error } = await supabase.from("purchases").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// EXPENSES
app.get("/expenses", async (req, res) => {
  const { data, error } = await supabase.from("expenses").select("*")
  if (error) return res.status(500).json(error)
  res.json(data)
})


// DASHBOARD
app.get("/dashboard", async (req, res) => {

  const sales = await supabase.from("sales").select("total")
  const purchases = await supabase.from("purchases").select("total")
  const expenses = await supabase.from("expenses").select("amount")

  let salesTotal = 0
  let purchaseTotal = 0
  let expenseTotal = 0

  sales.data?.forEach(i => salesTotal += i.total || 0)
  purchases.data?.forEach(i => purchaseTotal += i.total || 0)
  expenses.data?.forEach(i => expenseTotal += i.amount || 0)

  const profit = salesTotal - purchaseTotal - expenseTotal

  res.json({
    salesTotal,
    purchaseTotal,
    expenseTotal,
    profit
  })

})
app.get("/dashboard", async (req, res) => {

  const sales = await supabase.from("sales").select("total")
  const purchases = await supabase.from("purchases").select("total")
  const expenses = await supabase.from("expenses").select("amount")

  let salesTotal = 0
  let purchaseTotal = 0
  let expenseTotal = 0

  sales.data?.forEach(i => salesTotal += i.total || 0)
  purchases.data?.forEach(i => purchaseTotal += i.total || 0)
  expenses.data?.forEach(i => expenseTotal += i.amount || 0)

  const profit = salesTotal - purchaseTotal - expenseTotal

  res.json({
    salesTotal,
    purchaseTotal,
    expenseTotal,
    profit
  })

})

// SERVER
app.listen(5000, () => {
  console.log("Server2 running on 5000")
})