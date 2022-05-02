const express = require('express')
const CalcQuest = require('../operation/CalcQuest')
const Quest = require('./lib/Quest')

const app = express()
app.use(express.json())

app.get('/quests', (req, res) => {
  const data = Quest.loadComputed()
  res.json(data)
})

app.get('/refresh', (req, res) => {
  CalcQuest()
  res.json({ data: 'data' })
})

app.post('/quests', (req, res) => {
  console.log('POST add start')
  const addedItem = Quest.add(req.body)
  CalcQuest()
  res.json(addedItem)
  console.log('POST add end')
})

app.post('/quests/:id/position', (req, res) => {
  const questId = req.params.id
  const { x, y } = req.body
  const data = { x, y }
  Quest.updatePosition(questId, data)
  CalcQuest()
  res.status(200).send('OK')
})

app.post('/quests/:id/sockets', (req, res) => {
  console.log('POST start')
  const questId = req.params.id
  const { id: socketId, type } = req.body
  const data = { questId, socketId, type }
  Quest.addSocket(data)
  CalcQuest()
  res.status(200).send('OK')
})

app.post('/facts/:id', (req, res) => {
  const questId = req.params.id
  const { done } = req.body
  Quest.addFact(questId, { done })
  CalcQuest()
  res.status(200).send('OK')
})

module.exports = app
