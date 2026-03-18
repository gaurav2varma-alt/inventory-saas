const express = require("express")
const cors = require("cors")

const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())


// PRODUCTS BY COMPANY

app.get("/products/:company_id", async (req, res) => {

  const company_id = req.params.company_id

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)

})


// SALES BY COMPANY

app.get("/sales/:company_id", async (req, res) => {

  const company_id = req.params.company_id

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)

})


// EXPENSE BY COMPANY

app.get("/expenses/:company_id", async (req, res) => {

  const company_id = req.params.company_id

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("company_id", company_id)

  if (error) return res.status(500).json(error)

  res.json(data)

})


app.listen(9000, () => {
  console.log("SaaS server running on 9000")
})