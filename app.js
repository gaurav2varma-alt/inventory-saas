require("dotenv").config()

const express = require("express")
const cors = require("cors")
const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())


// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("API WORKING")
})


// ================= DASHBOARD =================

app.get("/dashboard", async (req, res) => {

  try {

    const { data: sales } = await supabase
      .from("sales")
      .select("amount")

    const { data: purchase } = await supabase
      .from("purchase")
      .select("amount")

    const { data: expense } = await supabase
      .from("expense")
      .select("amount")


    let salesTotal = 0
    let purchaseTotal = 0
    let expenseTotal = 0


    if (sales) {
      sales.forEach(i => {
        salesTotal += Number(i.amount)
      })
    }

    if (purchase) {
      purchase.forEach(i => {
        purchaseTotal += Number(i.amount)
      })
    }

    if (expense) {
      expense.forEach(i => {
        expenseTotal += Number(i.amount)
      })
    }


    const profit = salesTotal - purchaseTotal - expenseTotal


    res.json({
      salesTotal,
      purchaseTotal,
      expenseTotal,
      profit
    })

  }

  catch (err) {

    res.status(500).json(err)

  }

})



// ================= ADD SALE =================

app.post("/add-sale", async (req, res) => {

  const { amount } = req.body

  const { error } = await supabase
    .from("sales")
    .insert([{ amount }])

  if (error) return res.status(500).json(error)

  res.json({ success: true })

})



// ================= ADD PURCHASE =================

app.post("/add-purchase", async (req, res) => {

  const { amount } = req.body

  const { error } = await supabase
    .from("purchase")
    .insert([{ amount }])

  if (error) return res.status(500).json(error)

  res.json({ success: true })

})



// ================= ADD EXPENSE =================

app.post("/add-expense", async (req, res) => {

  const { amount } = req.body

  const { error } = await supabase
    .from("expense")
    .insert([{ amount }])

  if (error) return res.status(500).json(error)

  res.json({ success: true })

})



// ================= MONTHLY CHART =================

app.get("/monthly", async (req, res) => {

  const { data, error } = await supabase
    .from("sales")
    .select("amount, created_at")

  if (error) return res.status(500).json(error)

  const months = [0,0,0,0,0,0,0,0,0,0,0,0]

  data.forEach(row => {

    const d = new Date(row.created_at)

    const m = d.getMonth()

    months[m] += Number(row.amount)

  })

  res.json(months)

})



// ================= PORT =================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})