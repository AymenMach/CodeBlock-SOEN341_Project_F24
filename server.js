const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', (req, res) => {
  try {
    const hpass = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hpass }
    users.push(user)
    res.status(200).semd()
  } catch {
    res.status(500).send()
  }
})

app.post('users/login', async (req, res) => {
  const user = users.find(user => user.name = req.body.name)
  if (user == null) {
    return res.status(401).send('cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
  res.send('Success')
    } else {
      res.send('Not allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)
