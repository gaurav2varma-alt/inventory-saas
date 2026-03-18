require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// Home
app.get("/", (req, res) => {
  res.send("API WORKING")
})

// Dashboard API
app.get("/dashboard", (req, res) => {
  res.json({
    salesTotal: 0,
    purchaseTotal: 0,
    expenseTotal: 0,
    profit: 0
  })
})

// PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
