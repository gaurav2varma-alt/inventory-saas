require("dotenv").config()

const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()


app.use(cors())
app.use(express.json())

app.use(express.static(__dirname))



app.get("/", (req, res) => {
  res.send("API WORKING")
})



app.post("/login", async (req, res) => {

  const { email, password } = req.body

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    })

  if (error) {
    return res.json({
      ok:false,
      msg:error.message
    })
  }

  res.json({
    ok:true,
    user:data.user
  })

})



app.post("/signup", async (req, res) => {

  const { email, password } = req.body

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password
    })

  if (error) {
    return res.json(error)
  }

  res.json(data)

})



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



app.post("/add-sale", async (req, res) => {

  const { amount, user_id } = req.body

  await supabase
    .from("sales")
    .insert([{ amount, user_id }])

  res.json({ ok:true })

})


app.post("/add-purchase", async (req, res) => {

  const { amount, user_id } = req.body

  await supabase
    .from("purchase")
    .insert([{ amount, user_id }])

  res.json({ ok:true })

})


app.post("/add-expense", async (req, res) => {

  const { amount, user_id } = req.body

  await supabase
    .from("expense")
    .insert([{ amount, user_id }])

  res.json({ ok:true })

})



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running")
})