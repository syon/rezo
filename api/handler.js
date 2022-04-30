const bodyParser = require('body-parser')
const app = require('express')()
const CalcQuest = require('../operation/CalcQuest')

app.use(bodyParser.json())

app.get('/refresh', (req, res) => {
  CalcQuest()
  res.json({ data: 'data' })
})

module.exports = app
