const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())


// REGISTER
app.post("/register", async (req, res) => {

  const { name, email, password } = req.body

  const { data, error } = await supabase
    .from("users")
    .insert([
      { name, email, password }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)

})


// LOGIN
app.post("/login", async (req, res) => {

  const { email, password } = req.body

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)

  if (error) return res.status(500).json(error)

  res.json(data)

})


// USERS
app.get("/users", async (req, res) => {

  const { data, error } = await supabase
    .from("users")
    .select("*")

  if (error) return res.status(500).json(error)

  res.json(data)

})


app.listen(7000, () => {
  console.log("Auth server running on 7000")
})