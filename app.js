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

    // SALES

    const { data: sales } = await supabase
      .from("sales")
      .select("amount")


    // PURCHASE

    const { data: purchase } = await supabase
      .from("purchase")
      .select("amount")


    let salesTotal = 0
    let purchaseTotal = 0


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


    const profit = salesTotal - purchaseTotal


    res.json({
      salesTotal,
      purchaseTotal,
      expenseTotal: 0,
      profit
    })

  }

  catch (err) {

    res.status(500).json(err)

  }

})



// ================= ADD SALE =================

app.post("/add-sale", async (req, res) => {

  try {

    const { amount } = req.body

    const { data, error } = await supabase
      .from("sales")
      .insert([
        {
          amount: amount
        }
      ])

    if (error) {
      return res.status(500).json(error)
    }

    res.json({
      success: true,
      data
    })

  }

  catch (err) {

    res.status(500).json(err)

  }

})



// ================= ADD PURCHASE =================

app.post("/add-purchase", async (req, res) => {

  try {

    const { amount } = req.body

    const { data, error } = await supabase
      .from("purchase")
      .insert([
        {
          amount: amount
        }
      ])

    if (error) {
      return res.status(500).json(error)
    }

    res.json({
      success: true,
      data
    })

  }

  catch (err) {

    res.status(500).json(err)

  }

})



// ================= PORT =================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})