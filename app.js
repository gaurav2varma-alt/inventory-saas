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

    const { data, error } = await supabase
      .from("sales")
      .select("amount")

    if (error) {
      return res.status(500).json(error)
    }

    let total = 0

    if (data) {
      data.forEach(i => {
        total += Number(i.amount)
      })
    }

    res.json({
      salesTotal: total,
      purchaseTotal: 0,
      expenseTotal: 0,
      profit: total
    })

  } catch (err) {

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

  } catch (err) {

    res.status(500).json(err)

  }

})


// ================= PORT =================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})