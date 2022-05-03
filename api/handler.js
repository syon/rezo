const express = require('express')
const CalcQuest = require('../operation/CalcQuest')
const Quest = require('./lib/Quest')

const app = express()
app.use(express.json())

app.get('/quests', (req, res) => {
  const panel = 'hello'
  const data = Quest.loadComputed(panel)
  res.json(data)
})

app.get('/refresh', (req, res) => {
  const panel = 'hello'
  CalcQuest(panel)
  res.json({ data: 'data' })
})

app.post('/quests', (req, res) => {
  console.log('POST add start')
  const panel = 'hello'
  const addedItem = Quest.add(panel, req.body)
  CalcQuest(panel)
  res.json(addedItem)
  console.log('POST add end')
})

app.post('/quests/:id/position', (req, res) => {
  const questId = req.params.id
  const { x, y } = req.body
  const data = { x, y }
  const panel = 'hello'
  Quest.updatePosition(panel, questId, data)
  CalcQuest(panel)
  res.status(200).send('OK')
})

app.post('/quests/:id/sockets', (req, res) => {
  console.log('POST start')
  const questId = req.params.id
  const { id: socketId, type } = req.body
  const data = { questId, socketId, type }
  const panel = 'hello'
  Quest.addSocket(panel, data)
  CalcQuest(panel)
  res.status(200).send('OK')
})

app.post('/facts/:id', (req, res) => {
  const questId = req.params.id
  const { done } = req.body
  const panel = 'hello'
  Quest.addFact(panel, questId, { done })
  CalcQuest(panel)
  res.status(200).send('OK')
})

module.exports = app
