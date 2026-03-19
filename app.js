require("dotenv").config()

const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()


// ===== middleware =====

app.use(cors())
app.use(express.json())

// IMPORTANT → html serve karega
app.use(express.static(__dirname))



// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("API WORKING")
})



// ================= LOGIN =================

app.post("/login", async (req, res) => {

  const { email, password } = req.body

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    })

  if (error) {
    return res.status(500).json(error)
  }

  res.json({
    user: data.user,
    session: data.session
  })

})



// ================= SIGNUP =================

app.post("/signup", async (req, res) => {

  const { email, password } = req.body

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password
    })

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)

})



// ================= DASHBOARD =================

app.get("/dashboard", async (req, res) => {

  const user_id = req.query.user_id

  const { data: sales } =
    await supabase
      .from("sales")
      .select("amount")
      .eq("user_id", user_id)


  const { data: purchase } =
    await supabase
      .from("purchase")
      .select("amount")
      .eq("user_id", user_id)


  const { data: expense } =
    await supabase
      .from("expense")
      .select("amount")
      .eq("user_id", user_id)


  let s = 0
  let p = 0
  let e = 0


  sales?.forEach(i => s += Number(i.amount))
  purchase?.forEach(i => p += Number(i.amount))
  expense?.forEach(i => e += Number(i.amount))


  res.json({
    salesTotal: s,
    purchaseTotal: p,
    expenseTotal: e,
    profit: s - p - e
  })

})



// ================= ADD SALE =================

app.post("/add-sale", async (req, res) => {

  const { amount, user_id } = req.body

  const { error } =
    await supabase
      .from("sales")
      .insert([
        { amount, user_id }
      ])

  if (error) {
    return res.status(500).json(error)
  }

  res.json({ ok: true })

})



// ================= ADD PURCHASE =================

app.post("/add-purchase", async (req, res) => {

  const { amount, user_id } = req.body

  const { error } =
    await supabase
      .from("purchase")
      .insert([
        { amount, user_id }
      ])

  if (error) {
    return res.status(500).json(error)
  }

  res.json({ ok: true })

})



// ================= ADD EXPENSE =================

app.post("/add-expense", async (req, res) => {

  const { amount, user_id } = req.body

  const { error } =
    await supabase
      .from("expense")
      .insert([
        { amount, user_id }
      ])

  if (error) {
    return res.status(500).json(error)
  }

  res.json({ ok: true })

})



// ================= START =================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on " + PORT)
})