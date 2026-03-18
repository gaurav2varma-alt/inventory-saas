require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API WORKING 🚀")
})

// ================= TEST =================
app.get("/test", (req, res) => {
  res.json({ message: "Server OK" })
})

// ================= BRANDS =================
app.get("/brands", (req, res) => {
  res.json([
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" }
  ])
})

// ================= MODELS =================
app.get("/models", (req, res) => {
  res.json([
    { id: 1, name: "iPhone 13" },
    { id: 2, name: "Galaxy S22" }
  ])
})

// ================= PRODUCTS =================
app.get("/products", (req, res) => {
  res.json([])
})

// ================= PURCHASE =================
app.get("/purchases", (req, res) => {
  res.json([])
})

// ================= SALES =================
app.get("/sales", (req, res) => {
  res.json([])
})

// ================= EXPENSE =================
app.get("/expenses", (req, res) => {
  res.json([])
})

// ================= DASHBOARD =================
app.get("/dashboard", (req, res) => {
  res.json({
    salesTotal: 0,
    purchaseTotal: 0,
    expenseTotal: 0,
    profit: 0
  })
})

// ================= PORT =================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
