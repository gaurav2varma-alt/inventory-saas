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
      error:error.message
    })
  }

  if (!data.user) {
    return res.json({
      ok:false
    })
  }

  res.json({
    ok:true,
    user:data.user
  })

})