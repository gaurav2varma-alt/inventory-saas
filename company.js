const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())


// COMPANY REGISTER
app.post("/company-register", async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name,
        email,
        password
      }
    ])

  if (error) return res.status(500).json(error)

  res.json(data)

})


// COMPANY LOGIN
app.post("/company-login", async (req, res) => {

  const { email, password } = req.body

  const { data, error } = await supabase
    .from("companies")
    .select("id,name,email")
    .eq("email", email)
    .eq("password", password)

  if (error) return res.status(500).json(error)

  if (!data || data.length === 0) {
    return res.json({
      success: false,
      message: "Invalid login"
    })
  }

  res.json({
    success: true,
    company: data[0]
  })

})

app.listen(8000, () => {
  console.log("Company server running on 8000")
})