const express = require('express')
const Compute = require('./lib/Compute')
const Quest = require('./lib/Quest')

const app = express()
app.use(express.json())

app.get('/quests', (req, res) => {
  const panel = 'hello'
  const data = Quest.loadComputed(panel)
  res.json(data)
})

app.post('/quests', (req, res) => {
  console.log('POST add start')
  const panel = 'hello'
  const addedItem = Quest.add(panel, req.body)
  Compute(panel)
  res.json(addedItem)
  console.log('POST add end')
})

app.post('/quests/:id/position', (req, res) => {
  const questId = req.params.id
  const { x, y } = req.body
  const data = { x, y }
  const panel = 'hello'
  Quest.updatePosition(panel, questId, data)
  Compute(panel)
  res.status(200).send('OK')
})

app.post('/quests/:id/sockets', (req, res) => {
  console.log('POST start')
  const questId = req.params.id
  const { id: socketId, type } = req.body
  const data = { questId, socketId, type }
  const panel = 'hello'
  Quest.addSocket(panel, data)
  Compute(panel)
  res.status(200).send('OK')
})

app.post('/facts/:id', (req, res) => {
  const questId = req.params.id
  const { done } = req.body
  const panel = 'hello'
  Quest.addFact(panel, questId, { done })
  Compute(panel)
  res.status(200).send('OK')
})

module.exports = app
